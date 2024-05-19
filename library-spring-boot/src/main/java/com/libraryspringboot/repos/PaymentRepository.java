package com.libraryspringboot.repos;

import com.libraryspringboot.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByUserEmail(String userEmail);
}
