package com.exlay.mixer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MessageResponse {
    private Long messageId;
    private Long chatId;
    private Long senderId;
    private String content;
    private String status;
    private LocalDateTime sentAt;

}
