package com.libraryspringboot.services;

import com.libraryspringboot.dto.MessageDto;
import com.libraryspringboot.entities.Message;
import com.libraryspringboot.models.AdminQuestionRequest;
import com.libraryspringboot.repos.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class MessagesServiceImpl implements MessagesService {

    private final ModelMapper modelMapper;

    private final MessageRepository messageRepository;

    @Override
    public Page<MessageDto> getAllMessages(Pageable pageRequest) {
        log.info("Get all messages");
        Page<Message> messages = messageRepository.findAll(pageRequest);
        return messages.map(entity -> modelMapper.map(entity, MessageDto.class));
    }

    @Override
    public void postMessage(MessageDto messageRequest, String userEmail) {
        Message message = Message.builder()
                .title(messageRequest.getTitle())
                .question(messageRequest.getQuestion())
                .userEmail(userEmail)
                .build();
        messageRepository.save(message);
    }

    @Override
    public void putMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());
        if (message.isEmpty()) {
            throw new Exception("Message not found");
        }

        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);
        messageRepository.save(message.get());
    }

    @Override
    public Page<MessageDto> getMessagesByUserEmail(String userEmail, Pageable pageRequest) {
        log.info("Get all messages for {}", userEmail);
        Page<Message> messages = messageRepository.findByUserEmail(userEmail, pageRequest);
        return messages.map(entity -> modelMapper.map(entity, MessageDto.class));
    }

    @Override
    public Page<MessageDto> getMessagesByClosed(Boolean closed, Pageable pageRequest) {
        log.info("Get all closed messages");
        Page<Message> messages = messageRepository.findByClosed(closed, pageRequest);
        return messages.map(entity -> modelMapper.map(entity, MessageDto.class));
    }
}
