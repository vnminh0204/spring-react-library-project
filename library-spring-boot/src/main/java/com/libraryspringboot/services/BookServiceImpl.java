package com.libraryspringboot.services;

import com.libraryspringboot.dto.BookDto;
import com.libraryspringboot.entities.Book;
import com.libraryspringboot.repos.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class BookServiceImpl implements BookService {

    private final ModelMapper modelMapper;

    private final BookRepository bookRepository;

    public Page<BookDto> getAllBooks(PageRequest pageRequest) {
        log.info("Get all books");
        Page<Book> books = bookRepository.findAll(pageRequest);
        return books.map(entity -> modelMapper.map(entity, BookDto.class));
    }

    public BookDto getBookById(long bookId) {
        log.info("Get book id = {}", bookId);
        return this.modelMapper.map(bookRepository.findById(bookId).orElse(null), BookDto.class);
    }
}
