package com.exlay.mixer.controller;

import com.exlay.mixer.dto.ChatResponse;
import com.exlay.mixer.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    @GetMapping
    public List<ChatResponse> getUserChats(Authentication authentication){
        return chatService.getUserChats(authentication.getName());
    }

    


}
