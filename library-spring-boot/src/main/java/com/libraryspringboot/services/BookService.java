package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;
import com.libraryspringboot.models.ShelfCurrentLoansResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface BookService {
    Page<BookDto> getAllBooks(Pageable pageRequest);

    Page<BookDto> findByTitleContaining(String title, Pageable pageRequest);

    Page<BookDto> findByCategory(String category, Pageable pageRequest);

    BookDto getBookById(long bookId);

    BookDto checkoutBook(String userEmail, Long bookId) throws Exception;

    Boolean checkoutBookByUser(String userEmail, Long bookId);

    Integer currentLoansCount(String userEmail);

    List<ShelfCurrentLoansResponse> currentLoans(String uesrEmail) throws Exception;
}
