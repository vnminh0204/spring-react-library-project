package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {
    Page<BookDto> getAllBooks(Pageable pageRequest);

    Page<BookDto> findByTitleContaining(String title, Pageable pageRequest);

    Page<BookDto> findByCategory(String category, Pageable pageRequest);

    BookDto getBookById(long bookId);
}
