package com.codingwebsite.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/**
 * Request DTO for creating a new problem
 */
public class CreateProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotEmpty(message = "At least one test case is required")
    @Valid
    private List<TestCaseRequest> testCases;

    public CreateProblemRequest() {
    }

    public CreateProblemRequest(String title, String description, List<TestCaseRequest> testCases) {
        this.title = title;
        this.description = description;
        this.testCases = testCases;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TestCaseRequest> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCaseRequest> testCases) {
        this.testCases = testCases;
    }

    /**
     * Nested DTO for test case input
     */
    public static class TestCaseRequest {

        @NotBlank(message = "Input is required")
        private String input;

        @NotBlank(message = "Expected output is required")
        private String expectedOutput;

        public TestCaseRequest() {
        }

        public TestCaseRequest(String input, String expectedOutput) {
            this.input = input;
            this.expectedOutput = expectedOutput;
        }

        public String getInput() {
            return input;
        }

        public void setInput(String input) {
            this.input = input;
        }

        public String getExpectedOutput() {
            return expectedOutput;
        }

        public void setExpectedOutput(String expectedOutput) {
            this.expectedOutput = expectedOutput;
        }
    }
}
