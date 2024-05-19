package com.libraryspringboot.services;

import com.libraryspringboot.models.AddBookRequest;


public interface AdminService {
    void increaseBookQuantity(Long bookId) throws Exception;

    void decreaseBookQuantity(Long bookId) throws Exception;

    void postBook(AddBookRequest addBookRequest);

    void deleteBook(Long bookId) throws Exception;
}
