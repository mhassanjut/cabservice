package com.stwmovers.taxi.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stwmovers.taxi.domain.entity.User;
import com.stwmovers.taxi.domain.enums.Role;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndActiveTrue(String email);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    long countByRoleAndActiveTrue(Role role);

    @Query("""
            SELECT u FROM User u
            WHERE u.role = :role
              AND u.active = TRUE
              AND u.googleId IS NOT NULL
              AND (
                COALESCE(:search, '') = ''
                OR lower(u.email) LIKE lower(concat('%', :search, '%'))
                OR lower(u.fullName) LIKE lower(concat('%', :search, '%'))
              )
            """)
    Page<User> findGoogleCustomers(
            @Param("role") Role role, @Param("search") String search, Pageable pageable);
}
