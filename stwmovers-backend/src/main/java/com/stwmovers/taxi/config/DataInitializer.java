package com.stwmovers.taxi.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.Role;
import com.stwmovers.taxi.domain.repository.UserRepository;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final AppProperties appProperties;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository, AppProperties appProperties, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.appProperties = appProperties;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String adminEmail = appProperties.getAdmin().getEmail().trim().toLowerCase();
        String encodedPassword = passwordEncoder.encode(appProperties.getAdmin().getPassword());

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    if (user.getPasswordHash() == null
                            || !passwordEncoder.matches(appProperties.getAdmin().getPassword(), user.getPasswordHash())) {
                        user.setPasswordHash(encodedPassword);
                        user.setRole(Role.ADMIN);
                        user.setActive(true);
                        userRepository.save(user);
                    }
                },
                () -> userRepository.save(User.builder()
                        .email(adminEmail)
                        .passwordHash(encodedPassword)
                        .fullName("System Admin")
                        .phone("+34000000000")
                        .role(Role.ADMIN)
                        .active(true)
                        .build()));
    }
}
