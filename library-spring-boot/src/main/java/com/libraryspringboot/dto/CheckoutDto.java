package com.libraryspringboot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CheckoutDto {
    private Long id;

    private String userEmail;

    private String checkoutDate;

    private String returnDate;

    private Long bookId;
}
