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
@Tag(name = "Books")
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
}
