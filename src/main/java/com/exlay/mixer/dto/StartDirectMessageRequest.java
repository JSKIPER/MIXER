package com.exlay.mixer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartDirectMessageRequest {
    private Long recipientId;
    private String content;
}
