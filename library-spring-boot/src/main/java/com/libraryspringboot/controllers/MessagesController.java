package com.libraryspringboot.controllers;

import com.libraryspringboot.dto.MessageDto;
import com.libraryspringboot.models.AdminQuestionRequest;
import com.libraryspringboot.services.MessagesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Messages")
@RequestMapping("api/messages")
@RequiredArgsConstructor
public class MessagesController {

    private final MessagesService messagesService;

    @CrossOrigin
    @GetMapping("")
    ResponseEntity<Page<MessageDto>> getAllMessages(
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "9") Integer limit
    ) {
        var sortOrder = Sort.by("id").descending();
        Page<MessageDto> messages = messagesService.getAllMessages(PageRequest.of(offset, limit, sortOrder));
        return ResponseEntity.ok().body(messages);
    }

    @CrossOrigin
    @GetMapping("/search/findByUserEmail/")
    ResponseEntity<Page<MessageDto>> getMessagesByUserEmail(
            @RequestParam() String userEmail,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "9") Integer limit
    ) {
        // Latest messages will appear first
        var sortOrder = Sort.by("id").descending();
        Page<MessageDto> messages = messagesService.getMessagesByUserEmail(userEmail, PageRequest.of(offset, limit, sortOrder));
        return ResponseEntity.ok().body(messages);
    }

    @CrossOrigin
    @GetMapping("/search/findByClosed/")
    ResponseEntity<Page<MessageDto>> getMessagesByClosed(
            @RequestParam() Boolean closed,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "9") Integer limit
    ) {
        // Latest messages will appear first
        var sortOrder = Sort.by("id").descending();
        Page<MessageDto> messages = messagesService.getMessagesByClosed(closed, PageRequest.of(offset, limit, sortOrder));
        return ResponseEntity.ok().body(messages);
    }

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
            @RequestBody AdminQuestionRequest adminQuestionRequest
    ) throws Exception {
        String userEmail = authentication.getName();
        var claims = ((Jwt) authentication.getPrincipal()).getClaims();
        var userType = ((String) claims.get("userType")).toLowerCase();
        if (userType == null || !userType.equals("admin")) {
            throw new Exception("Administration page only");
        }
        messagesService.putMessage(adminQuestionRequest, userEmail);
    }
}
