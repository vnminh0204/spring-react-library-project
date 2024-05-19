package com.libraryspringboot.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfoRequest {

    private int amount;
    private String currency;
    private String receiptEmail;
}
