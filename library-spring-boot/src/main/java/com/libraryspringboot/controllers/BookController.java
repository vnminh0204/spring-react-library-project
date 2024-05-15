package com.libraryspringboot.controllers;

import com.libraryspringboot.dto.BookDto;
import com.libraryspringboot.services.BookService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Book")
@RequestMapping("api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<Page<BookDto>> getAllBooks(
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "9") Integer limit
    ) {
        Page<BookDto> books = bookService.getAllBooks(PageRequest.of(offset, limit));
        return ResponseEntity.ok().body(books);
    }

    @CrossOrigin
    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getEmployeeById(@PathVariable("id") Long id) {
        BookDto bookDto = bookService.getBookById(id);
        return ResponseEntity.ok().body(bookDto);
    }

    @CrossOrigin
    @GetMapping("/search/findByTitleContaining")
    public ResponseEntity<Page<BookDto>> findByTitleContaining(
            @RequestParam("title") String title,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Page<BookDto> books = bookService.findByTitleContaining(title, PageRequest.of(offset, limit));
        return ResponseEntity.ok().body(books);
    }

    @CrossOrigin
    @GetMapping("/search/findByCategory")
    public ResponseEntity<Page<BookDto>> findByCategory(
            @RequestParam("category") String category,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "9") Integer limit
    ) {
        Page<BookDto> books = bookService.findByCategory(category, PageRequest.of(offset, limit));
        return ResponseEntity.ok().body(books);
    }

    @CrossOrigin
    @PutMapping("/secure/checkout")
    public ResponseEntity<BookDto> findByUserEmailAndBookId(
            @RequestParam String userEmail,
            @RequestParam Long bookId
    ) throws Exception {
        return ResponseEntity.ok().body(bookService.checkoutBook(userEmail, bookId));
    }

    @CrossOrigin
    @GetMapping("secure/ischeckout/byuser")
    public ResponseEntity<Boolean> checkoutBookByUser(
            @RequestParam String userEmail,
            @RequestParam Long bookId
    ) {
        return ResponseEntity.ok().body(bookService.checkoutBookByUser(userEmail, bookId));
    }

    @CrossOrigin
    @GetMapping("secure/currentloans/count")
    public ResponseEntity<Integer> currentLoansCount(
            @RequestParam String userEmail
    ) {
        return ResponseEntity.ok().body(bookService.currentLoansCount(userEmail));
    }
}
