package com.exlay.mixer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FirstMessageRequest {
    private String contert;
    private Long recipientId;
}
