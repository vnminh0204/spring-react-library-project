package com.libraryspringboot.models;

import com.libraryspringboot.dto.BookDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShelfCurrentLoansResponse {

    private BookDto book;

    private long daysLeft;
}