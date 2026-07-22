package com.exlay.mixer.controller;

import com.exlay.mixer.dto.MessageRequest;
import com.exlay.mixer.dto.MessageResponse;
import com.exlay.mixer.dto.StartDirectMessageRequest;
import com.exlay.mixer.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/chat/{chatId}")
    public List<MessageResponse> getChatMessages(
            @PathVariable Long chatId, Authentication authentication
    ){
        return messageService.getChatMessages(chatId, authentication.getName());
    }

    @PostMapping("/startchat")
    public MessageResponse startChat(
            @RequestBody StartDirectMessageRequest request, Authentication authentication
    ){
        return messageService.startChat(request, authentication.getName());

    }

    @PostMapping("/chat/{chatId}")
    public MessageResponse sendMessage(
            @PathVariable Long chatId,
            @RequestBody MessageRequest request, Authentication authentication
    ){
        return messageService.sendMessage(chatId, request, authentication.getName());

    }


}
