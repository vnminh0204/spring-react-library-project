package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;
import com.libraryspringboot.dto.HistoryDto;
import com.libraryspringboot.entities.Book;
import com.libraryspringboot.entities.Checkout;
import com.libraryspringboot.entities.History;
import com.libraryspringboot.entities.Payment;
import com.libraryspringboot.models.ShelfCurrentLoansResponse;
import com.libraryspringboot.repos.BookRepository;
import com.libraryspringboot.repos.CheckoutRepository;
import com.libraryspringboot.repos.HistoryRepository;
import com.libraryspringboot.repos.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class BookServiceImpl implements BookService {

    private final ModelMapper modelMapper;

    private final BookRepository bookRepository;

    private final CheckoutRepository checkoutRepository;

    private final HistoryRepository historyRepository;

    private final PaymentRepository paymentRepository;

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

        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean bookNeedsReturned = false;

        for (Checkout checkout : currentBooksCheckedOut) {
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;

            double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

            if (differenceInTime < 0) {
                bookNeedsReturned = true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
            throw new Exception("Outstanding fees");
        }

        if (userPayment == null) {
            Payment payment = Payment.builder()
                    .amount(00.00)
                    .userEmail(userEmail)
                    .build();
            paymentRepository.save(payment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(modelMapper.map(book.get(), Book.class));

        Checkout checkout = Checkout.builder()
                .userEmail(userEmail)
                .checkoutDate(LocalDate.now().toString())
                .returnDate(LocalDate.now().plusDays(7).toString())
                .bookId(book.get().getId())
                .build();
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

    @Override
    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);

        List<Long> bookIdList = checkoutList.stream()
                .map(Checkout::getBookId)
                .collect(Collectors.toList());

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> Objects.equals(x.getBookId(), book.getId())).findFirst();

            if (checkout.isPresent()) {

                Date returnDate = sdf.parse(checkout.get().getReturnDate());
                Date currentDate = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(returnDate.getTime() - currentDate.getTime(),
                        TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(modelMapper.map(book, BookDto.class), difference_In_Time));
            }
        }
        return shelfCurrentLoansResponses;
    }

    @Override
    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date returnDate = sdFormat.parse(validateCheckout.getReturnDate());
        Date currentDate = sdFormat.parse(LocalDate.now().toString());

        if (returnDate.compareTo(currentDate) > 0 || returnDate.compareTo(currentDate) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }

    @Override
    public void returnBook(String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (book.isEmpty() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepository.save(book.get());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        if (differenceInTime < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            paymentRepository.save(payment);
        }


        checkoutRepository.deleteById(validateCheckout.getId());

        History history = History.builder()
                .userEmail(userEmail)
                .checkoutDate(validateCheckout.getCheckoutDate())
                .returnedDate(LocalDate.now().toString())
                .title(book.get().getTitle())
                .author(book.get().getAuthor())
                .description(book.get().getDescription())
                .img(book.get().getImg())
                .build();

        historyRepository.save(history);
    }

    @Override
    public Page<HistoryDto> findLoansHistoryByUserEmail(String userEmail, Pageable pageRequest) {
        log.info("Get all loans history");
        Page<History> histories = historyRepository.findBooksByUserEmail(userEmail, pageRequest);
        return histories.map(entity -> modelMapper.map(entity, HistoryDto.class));
    }
}
