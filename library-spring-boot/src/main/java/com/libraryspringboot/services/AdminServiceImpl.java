package com.libraryspringboot.services;

import com.libraryspringboot.entities.Book;
import com.libraryspringboot.models.AddBookRequest;
import com.libraryspringboot.repos.BookRepository;
import com.libraryspringboot.repos.CheckoutRepository;
import com.libraryspringboot.repos.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class AdminServiceImpl implements AdminService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final CheckoutRepository checkoutRepository;

    @Override
    public void increaseBookQuantity(Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        if (book.isEmpty()) {
            throw new Exception("Book not found");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        bookRepository.save(book.get());
    }

    @Override
    public void decreaseBookQuantity(Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        if (book.isEmpty() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0) {
            throw new Exception("Book not found or quantity locked");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        bookRepository.save(book.get());
    }

    @Override
    public void postBook(AddBookRequest addBookRequest) {
        Book book = Book.builder()
                .title(addBookRequest.getTitle())
                .author(addBookRequest.getAuthor())
                .description(addBookRequest.getDescription())
                .copies(addBookRequest.getCopies())
                .copiesAvailable(addBookRequest.getCopies())
                .category(addBookRequest.getCategory())
                .img(addBookRequest.getImg())
                .build();
        bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        if (book.isEmpty()) {
            throw new Exception("Book not found");
        }

        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }
}
