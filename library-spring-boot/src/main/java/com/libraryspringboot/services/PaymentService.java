package com.libraryspringboot.services;

import com.libraryspringboot.dto.PaymentDto;
import com.libraryspringboot.models.PaymentInfoRequest;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;

public interface PaymentService {
    PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException;

    ResponseEntity<String> stripePayment(String userEmail) throws Exception;

    PaymentDto findPaymentsByUserEmail(String userEmail);
}
