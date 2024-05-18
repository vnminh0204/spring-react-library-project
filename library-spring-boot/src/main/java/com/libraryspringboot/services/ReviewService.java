package com.libraryspringboot.services;

import com.libraryspringboot.dto.ReviewDto;
import com.libraryspringboot.models.ReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    Page<ReviewDto> getReviewsByBookId(long bookId, Pageable pageRequest);

    void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception;

    Boolean userReviewListed(String userEmail, Long bookId);
}
