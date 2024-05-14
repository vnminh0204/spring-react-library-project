package com.libraryspringboot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ReviewDto {
  private Long id;

  private String userEmail;

  private Date date;

  private double rating;

  private Long bookId;

  private String reviewDescription;
}
