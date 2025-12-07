package com.codingwebsite.backend.dto;

import java.util.List;

/**
 * Response DTO for code submission result
 */
public class SubmitResponse {

    private Long submissionId;
    private String status;
    private String output;
    private String errorMessage;
    private Long executionTimeMs;
    private List<TestResultDto> testResults;

    public SubmitResponse() {
    }

    public SubmitResponse(Long submissionId, String status, String output, String errorMessage,
            Long executionTimeMs, List<TestResultDto> testResults) {
        this.submissionId = submissionId;
        this.status = status;
        this.output = output;
        this.errorMessage = errorMessage;
        this.executionTimeMs = executionTimeMs;
        this.testResults = testResults;
    }

    // Getters and Setters
    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Long getExecutionTimeMs() {
        return executionTimeMs;
    }

    public void setExecutionTimeMs(Long executionTimeMs) {
        this.executionTimeMs = executionTimeMs;
    }

    public List<TestResultDto> getTestResults() {
        return testResults;
    }

    public void setTestResults(List<TestResultDto> testResults) {
        this.testResults = testResults;
    }
}
