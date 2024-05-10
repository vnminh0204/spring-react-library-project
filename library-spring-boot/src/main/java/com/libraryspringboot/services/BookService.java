package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface BookService {
    Page<BookDto> getAllBooks(PageRequest pageRequest);

    BookDto getBookById(long bookId);
}
