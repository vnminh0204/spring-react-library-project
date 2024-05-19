package com.libraryspringboot.controllers;

import com.libraryspringboot.dto.PaymentDto;
import com.libraryspringboot.models.PaymentInfoRequest;
import com.libraryspringboot.services.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Payment")
@RequestMapping("/api/payment/secure")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @CrossOrigin
    @GetMapping("/search/findByUserEmail")
    public ResponseEntity<PaymentDto> findPaymentByUserEmail(@RequestParam("userEmail") String userEmail) {
        PaymentDto payment = paymentService.findPaymentsByUserEmail(userEmail);
        return ResponseEntity.ok().body(payment);
    }

    @CrossOrigin
    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(
            @RequestBody PaymentInfoRequest paymentInfoRequest) throws StripeException {
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
        String paymentStr = paymentIntent.toJson();

        return ResponseEntity.ok().body(paymentStr);
    }

    @CrossOrigin
    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(
            Authentication authentication
    ) throws Exception {
        String userEmail = authentication.getName();
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        return paymentService.stripePayment(userEmail);
    }
}
