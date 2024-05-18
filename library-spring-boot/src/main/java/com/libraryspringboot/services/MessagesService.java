package com.libraryspringboot.services;

import com.libraryspringboot.dto.MessageDto;
import com.libraryspringboot.models.AdminQuestionRequest;

public interface MessagesService {

    void postMessage(MessageDto messageRequest, String userEmail);

    void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception;
}
