package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;

import java.util.List;

public interface BookService {
    List<BookDto> getAllBooks();

    BookDto getBookById(long bookId);
}
