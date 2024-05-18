package com.libraryspringboot.controllers;

import com.libraryspringboot.dto.MessageDto;
import com.libraryspringboot.models.AdminQuestionRequest;
import com.libraryspringboot.services.MessagesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Messages")
@RequestMapping("api/messages")
@RequiredArgsConstructor
public class MessagesController {

    private final MessagesService messagesService;

    @CrossOrigin
    @PostMapping("/secure/add/message")
    public void postMessage(
            Authentication authentication,
            @RequestBody MessageDto messageRequest) {
        String userEmail = authentication.getName();
        messagesService.postMessage(messageRequest, userEmail);
    }

    @CrossOrigin
    @PutMapping("/secure/admin/message")
    public void putMessage(
            Authentication authentication,
            @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String userEmail = authentication.getName();
        String admin = "";
//                ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only.");
        }
        messagesService.putMessage(adminQuestionRequest, userEmail);
    }
}
