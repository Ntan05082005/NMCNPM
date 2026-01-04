package com.Unicode.demo.controller;

import com.Unicode.demo.dto.ChatRequestDto;
import com.Unicode.demo.dto.ChatResponseDto;
import com.Unicode.demo.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDto> chat(@RequestBody ChatRequestDto request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ChatResponseDto.error("Message cannot be empty"));
            }

            String reply = geminiService.chat(request.getMessage(), request.getContext());
            return ResponseEntity.ok(ChatResponseDto.success(reply));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ChatResponseDto.error("Failed to get AI response: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI service is running");
    }
}
