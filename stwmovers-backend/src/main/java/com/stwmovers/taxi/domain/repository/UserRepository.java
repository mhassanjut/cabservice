package com.stwmovers.taxi.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.Role;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndActiveTrue(String email);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    long countByRoleAndActiveTrue(Role role);
}
