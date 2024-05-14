package com.libraryspringboot.services;

import com.libraryspringboot.dto.ReviewDto;
import com.libraryspringboot.entities.Review;
import com.libraryspringboot.repos.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class ReviewServiceImpl implements ReviewService{
  private final ModelMapper modelMapper;

  private final ReviewRepository reviewRepository;

  @Override
  public Page<ReviewDto> getReviewsByBookId(long bookId, Pageable pageRequest) {
    log.info("Get reviews for book id = {}", bookId);
    Page<Review> reviews = reviewRepository.findByBookId(bookId, pageRequest);
    return reviews.map(entity -> modelMapper.map(entity, ReviewDto.class));
  }
}
