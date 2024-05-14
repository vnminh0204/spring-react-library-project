package com.libraryspringboot.services;

import com.libraryspringboot.dto.ReviewDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
  Page<ReviewDto> getReviewsByBookId(long bookId, Pageable pageRequest);
}
