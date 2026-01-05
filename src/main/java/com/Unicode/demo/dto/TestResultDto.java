package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResultDto {

    private Integer testCaseNumber;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private boolean passed;
    
    // Enhanced execution metrics
    private Long executionTimeMs;
    private Double memoryUsedMB;
    
    // Enhanced error information
    private String errorMessage;
    private String stderr;
    private String compilerError;
    private String status; // CORRECT, WRONG_ANSWER, RUNTIME_ERROR, etc.
    
    /**
     * Get formatted error message
     */
    public String getFormattedError() {
        if (compilerError != null && !compilerError.isEmpty()) {
            return "Compilation Error: " + compilerError;
        }
        if (stderr != null && !stderr.isEmpty()) {
            return "Runtime Error:\n" + stderr;
        }
        if (errorMessage != null && !errorMessage.isEmpty()) {
            return errorMessage;
        }
        if (!passed) {
            return "Expected: " + expectedOutput + ", Got: " + actualOutput;
        }
        return "Test passed in " + executionTimeMs + "ms";
    }
}
