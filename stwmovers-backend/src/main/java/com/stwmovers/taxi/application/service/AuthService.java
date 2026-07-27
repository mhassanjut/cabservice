package com.stwmovers.taxi.application.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.stwmovers.taxi.application.dto.request.GoogleLoginRequest;
import com.stwmovers.taxi.application.dto.request.LoginRequest;
import com.stwmovers.taxi.application.dto.request.RegisterRequest;
import com.stwmovers.taxi.application.dto.response.AuthResponse;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.Role;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.infrastructure.security.GoogleTokenVerifier;
import com.stwmovers.taxi.infrastructure.security.JwtTokenProvider;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final RefreshTokenService refreshTokenService;
    private final TokenRevocationService tokenRevocationService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            GoogleTokenVerifier googleTokenVerifier,
            RefreshTokenService refreshTokenService,
            TokenRevocationService tokenRevocationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.googleTokenVerifier = googleTokenVerifier;
        this.refreshTokenService = refreshTokenService;
        this.tokenRevocationService = tokenRevocationService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .active(true)
                .build();
        userRepository.save(user);
        return issueSession(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()));
        User user = userRepository.findByEmailAndActiveTrue(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        return issueSession(user);
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(request.getIdToken());

        Boolean emailVerified = payload.getEmailVerified();
        if (emailVerified == null || !emailVerified) {
            throw new BadRequestException("Google email is not verified");
        }

        String googleId = payload.getSubject();
        String email = payload.getEmail().trim().toLowerCase();
        String fullName = payload.get("name") != null ? payload.get("name").toString() : email;
        String picture = payload.get("picture") != null ? payload.get("picture").toString() : null;

        return userRepository.findByGoogleId(googleId)
                .map(user -> updateGoogleProfile(user, fullName, picture))
                .orElseGet(() -> linkOrCreateGoogleUser(googleId, email, fullName, picture));
    }

    public AuthResponse refreshSession(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BadRequestException("User account is inactive");
        }
        return reissueAccessToken(user);
    }

    public AuthResponse issueSession(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        JwtTokenProvider.AccessToken accessToken = jwtTokenProvider.generateAccessToken(principal);
        tokenRevocationService.trackSession(user.getId(), accessToken.jti(), accessToken.expiresAtEpochMs());

        String refreshToken = refreshTokenService.create(user.getId());
        return buildAuthResponse(user, accessToken, refreshToken);
    }

    private AuthResponse reissueAccessToken(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        JwtTokenProvider.AccessToken accessToken = jwtTokenProvider.generateAccessToken(principal);
        tokenRevocationService.trackSession(user.getId(), accessToken.jti(), accessToken.expiresAtEpochMs());
        return buildAuthResponse(user, accessToken, null);
    }

    private AuthResponse buildAuthResponse(User user, JwtTokenProvider.AccessToken accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken.token())
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresInMs(jwtTokenProvider.getAccessExpirationMs())
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }

    @Transactional
    public void revokeAllSessions(java.util.UUID userId) {
        tokenRevocationService.revokeAllForUser(userId);
        refreshTokenService.revokeAllForUser(userId);
    }

    @Transactional
    private AuthResponse updateGoogleProfile(User user, String fullName, String picture) {
        if (picture != null && !picture.isBlank()) {
            user.setProfilePictureUrl(picture);
        }
        if (user.getFullName() == null || user.getFullName().isBlank()) {
            user.setFullName(fullName);
        }
        userRepository.save(user);
        return issueSession(user);
    }

    private AuthResponse linkOrCreateGoogleUser(String googleId, String email, String fullName, String picture) {
        return userRepository.findByEmailAndActiveTrue(email)
                .map(existing -> {
                    if (existing.getGoogleId() != null && !existing.getGoogleId().equals(googleId)) {
                        throw new BadRequestException("Email already linked to another Google account");
                    }
                    existing.setGoogleId(googleId);
                    if (existing.getFullName() == null || existing.getFullName().isBlank()) {
                        existing.setFullName(fullName);
                    }
                    if (picture != null && !picture.isBlank()) {
                        existing.setProfilePictureUrl(picture);
                    }
                    userRepository.save(existing);
                    return issueSession(existing);
                })
                .orElseGet(() -> {
                    User user = User.builder()
                            .email(email)
                            .googleId(googleId)
                            .fullName(fullName)
                            .profilePictureUrl(picture)
                            .role(Role.CUSTOMER)
                            .active(true)
                            .build();
                    userRepository.save(user);
                    return issueSession(user);
                });
    }
}
