package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto {
    private boolean success;
    private String reply;
    private String error;

    public static ChatResponseDto success(String reply) {
        return new ChatResponseDto(true, reply, null);
    }

    public static ChatResponseDto error(String errorMessage) {
        return new ChatResponseDto(false, null, errorMessage);
    }
}
