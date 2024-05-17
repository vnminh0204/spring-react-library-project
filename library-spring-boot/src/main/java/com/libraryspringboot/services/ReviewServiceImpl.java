package com.libraryspringboot.services;

import com.libraryspringboot.dto.ReviewDto;
import com.libraryspringboot.dto.ReviewRequest;
import com.libraryspringboot.entities.Review;
import com.libraryspringboot.repos.BookRepository;
import com.libraryspringboot.repos.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ReviewServiceImpl implements ReviewService{
  private final ModelMapper modelMapper;

  private final ReviewRepository reviewRepository;

  @Override
  public Page<ReviewDto> getReviewsByBookId(long bookId, Pageable pageRequest) {
    log.info("Get reviews for book id = {}", bookId);
    Page<Review> reviews = reviewRepository.findByBookId(bookId, pageRequest);
    return reviews.map(entity -> modelMapper.map(entity, ReviewDto.class));
  }

  @Override
  public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
    Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
    if (validateReview != null) {
      throw new Exception("Review already exists");
    }

    Review review = new Review();
    review.setUserEmail(userEmail);
    review.setBookId(reviewRequest.getBookId());
    review.setRating(reviewRequest.getRating());
    if (reviewRequest.getReviewDescription().isPresent()) {
      review.setReviewDescription(reviewRequest.getReviewDescription().map(Object::toString).orElse(null));
    }
    review.setDate(Date.valueOf(LocalDate.now()));
    reviewRepository.save(review);
  }

  @Override
  public Boolean userReviewListed(String userEmail, Long bookId) {
    Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);

    return validateReview != null;
  }
}
