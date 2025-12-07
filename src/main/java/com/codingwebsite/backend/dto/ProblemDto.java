package com.codingwebsite.backend.dto;

import java.util.List;

/**
 * Response DTO for problem data
 */
public class ProblemDto {

    private Long id;
    private String title;
    private String description;
    private List<TestCaseDto> testCases;

    public ProblemDto() {
    }

    public ProblemDto(Long id, String title, String description, List<TestCaseDto> testCases) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.testCases = testCases;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<TestCaseDto> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCaseDto> testCases) {
        this.testCases = testCases;
    }

    /**
     * Nested DTO for test case
     */
    public static class TestCaseDto {
        private Long id;
        private String input;
        private String expectedOutput;

        public TestCaseDto() {
        }

        public TestCaseDto(Long id, String input, String expectedOutput) {
            this.id = id;
            this.input = input;
            this.expectedOutput = expectedOutput;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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
