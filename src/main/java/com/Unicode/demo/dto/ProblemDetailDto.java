package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Enhanced DTO for problem detail page with coding interface
 * Matches frontend requirements for the coding interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemDetailDto {
    private String id;
    private String slug;
    private String title;
    private String category;
    private String timeLimit; // Format: "HH:MM:SS"
    private String description;
    private List<ExampleDto> examples;
    private List<String> constraints;
    private DefaultCodeDto defaultCode;
    private SubmissionStatusDto submissionStatus; // User's last submission status

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExampleDto {
        private Integer id;
        private String input;
        private String output;
        private String explanation;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DefaultCodeDto {
        private String language;
        private String code;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubmissionStatusDto {
        private String errorType; // "compile", "runtime", "wrong_answer", "accepted", null
        private String errorMessage;
    }
}
