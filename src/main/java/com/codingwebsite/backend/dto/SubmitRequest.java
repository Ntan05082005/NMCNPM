package com.codingwebsite.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for code submission
 */
public class SubmitRequest {

    @NotNull(message = "Problem ID is required")
    private Long problemId;

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Language is required")
    private String language; // "python", "javascript", "cpp"

    public SubmitRequest() {
    }

    public SubmitRequest(Long problemId, String code, String language) {
        this.problemId = problemId;
        this.code = code;
        this.language = language;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
