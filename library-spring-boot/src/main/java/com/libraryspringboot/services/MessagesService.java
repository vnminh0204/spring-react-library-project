package com.libraryspringboot.services;

import com.libraryspringboot.dto.MessageDto;
import com.libraryspringboot.models.AdminQuestionRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessagesService {

    void postMessage(MessageDto messageRequest, String userEmail);

    void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception;

    Page<MessageDto> getMessagesByUserEmail(String userEmail, Pageable pageRequest);
}
