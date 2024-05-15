package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;
import com.libraryspringboot.entities.Book;
import com.libraryspringboot.entities.Checkout;
import com.libraryspringboot.repos.BookRepository;
import com.libraryspringboot.repos.CheckoutRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class BookServiceImpl implements BookService {

    private final ModelMapper modelMapper;

    private final BookRepository bookRepository;

    private final CheckoutRepository checkoutRepository;

    @Override
    public Page<BookDto> getAllBooks(Pageable pageRequest) {
        log.info("Get all books");
        Page<Book> books = bookRepository.findAll(pageRequest);
        return books.map(entity -> modelMapper.map(entity, BookDto.class));
    }

    @Override
    public Page<BookDto> findByTitleContaining(String title, Pageable pageRequest) {
        Page<Book> books = bookRepository.findByTitleContaining(title, pageRequest);
        return books.map(entity -> modelMapper.map(entity, BookDto.class));
    }

    @Override
    public Page<BookDto> findByCategory(String category, Pageable pageRequest) {
        Page<Book> books = bookRepository.findByCategory(category, pageRequest);
        return books.map(entity -> modelMapper.map(entity, BookDto.class));
    }

    @Override
    public BookDto getBookById(long bookId) {
        log.info("Get book id = {}", bookId);
        return this.modelMapper.map(bookRepository.findById(bookId).orElse(null), BookDto.class);
    }

    @Override
    public BookDto checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<BookDto> book = bookRepository.findById(bookId).map(bookEnitty -> modelMapper.map(bookEnitty, BookDto.class));

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (book.isEmpty() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            log.error("Book doesn't exist or already checkout - book id = {} , user = {}", bookId, userEmail);
            throw new Exception("Book doesn't exist or already checkout by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(modelMapper.map(book.get(), Book.class));

        Checkout checkout = new Checkout(
                null,
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    @Override
    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        return validateCheckout != null;
    }

    @Override
    public Integer currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }
}
