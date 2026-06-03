package com.stwmovers.taxi.application.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stwmovers.taxi.application.dto.request.LoginRequest;
import com.stwmovers.taxi.application.dto.request.RegisterRequest;
import com.stwmovers.taxi.application.dto.response.AuthResponse;
import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.Role;
import com.stwmovers.taxi.domain.repository.UserRepository;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.infrastructure.security.JwtTokenProvider;
import com.stwmovers.taxi.infrastructure.security.UserPrincipal;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
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
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()));
        User user = userRepository.findByEmailAndActiveTrue(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtTokenProvider.generateToken(principal);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresInMs(jwtTokenProvider.getExpirationMs())
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
