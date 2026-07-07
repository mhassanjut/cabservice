package com.stwmovers.taxi.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.stwmovers.taxi.domain.entity.Payment;
import com.stwmovers.taxi.domain.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByBookingId(UUID bookingId);

    Optional<Payment> findByStripeSessionId(String stripeSessionId);

    long countByStatus(PaymentStatus status);

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    Page<Payment> findAll(Pageable pageable);
}
