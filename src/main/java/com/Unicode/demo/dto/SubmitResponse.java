package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitResponse {

    private Long submissionId;
    private String status;
    private String output;
    private String errorMessage;
    private Long executionTimeMs;
    private List<TestResultDto> testResults;
    
    // Enhanced fields
    private Integer testCasesPassed;
    private Integer totalTestCases;
    private String stderr;
    private String compilerError;
    private Double memoryUsedMB;
    
    /**
     * Get acceptance rate
     */
    public double getAcceptanceRate() {
        if (totalTestCases == null || totalTestCases == 0) {
            return 0.0;
        }
        return (testCasesPassed * 100.0) / totalTestCases;
    }
    
    /**
     * Get formatted summary message
     */
    public String getSummary() {
        return String.format("%s | %d/%d passed | Runtime: %dms", 
            status,
            testCasesPassed != null ? testCasesPassed : 0,
            totalTestCases != null ? totalTestCases : 0,
            executionTimeMs != null ? executionTimeMs : 0
        );
    }
}
