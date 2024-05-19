package com.libraryspringboot.services;

import com.libraryspringboot.dto.PaymentDto;
import com.libraryspringboot.entities.Payment;
import com.libraryspringboot.models.PaymentInfoRequest;
import com.libraryspringboot.repos.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    private final ModelMapper modelMapper;

    @Value("${stripe.key.secret}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfoRequest.getAmount());
        params.put("currency", paymentInfoRequest.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    @Override
    public ResponseEntity<String> stripePayment(String userEmail) throws Exception {
        Payment payment = paymentRepository.findByUserEmail(userEmail);

        if (payment == null) {
            throw new Exception("Payment information is missing");
        }
        payment.setAmount(00.00);
        paymentRepository.save(payment);
        return ResponseEntity.ok().build();
    }

    @Override
    public PaymentDto findPaymentsByUserEmail(String userEmail) {
        return modelMapper.map(paymentRepository.findByUserEmail(userEmail), PaymentDto.class);
    }
}
