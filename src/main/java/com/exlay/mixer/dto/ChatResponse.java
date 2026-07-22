package com.exlay.mixer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ChatResponse {
    private Long chatId;
    private Long userId;
    private String username;

}
