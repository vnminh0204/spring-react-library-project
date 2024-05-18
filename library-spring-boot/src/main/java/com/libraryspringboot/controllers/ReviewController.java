package com.libraryspringboot.controllers;

import com.libraryspringboot.dto.ReviewDto;
import com.libraryspringboot.models.ReviewRequest;
import com.libraryspringboot.services.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Reviews")
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @CrossOrigin
    @GetMapping("/search/findByBookId")
    public ResponseEntity<Page<ReviewDto>> getReviewsByBookId(
            @RequestParam("bookId") long bookId,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "9") Integer limit
    ) {
        var sortOrder = Sort.by("date").descending();
        Page<ReviewDto> reviews = reviewService.getReviewsByBookId(bookId, PageRequest.of(offset, limit, sortOrder));
        return ResponseEntity.ok().body(reviews);
    }

    @CrossOrigin
    @PostMapping("/secure")
    public void postReview(
            Authentication authentication,
            @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = authentication.getName();
        if (userEmail == null) {
            throw new Exception("Username is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }

    @CrossOrigin
    @GetMapping("/secure/user/book/")
    public Boolean reviewBookByUser(
            Authentication authentication,
            @RequestParam Long bookId) throws Exception {
        String userEmail = authentication.getName();
        if (userEmail == null) {
            throw new Exception("Username is missing");
        }

        return reviewService.userReviewListed(userEmail, bookId);
    }
}
