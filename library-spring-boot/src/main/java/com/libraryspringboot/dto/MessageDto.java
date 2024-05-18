package com.libraryspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;

    private String userEmail;

    private String title;

    private String question;

    private String adminEmail;

    private String response;

    private boolean closed;
}
