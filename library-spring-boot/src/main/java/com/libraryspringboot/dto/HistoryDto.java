package com.libraryspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryDto {
    private Long id;

    private String userEmail;

    private String checkoutDate;

    private String returnedDate;

    private String title;

    private String author;

    private String description;

    private String img;
}
