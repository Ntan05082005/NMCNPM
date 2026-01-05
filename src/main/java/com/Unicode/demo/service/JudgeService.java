package com.Unicode.demo.service;

import com.Unicode.demo.dto.TestResultDto;
import com.Unicode.demo.enums.SubmissionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for judging submission results and categorizing status
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JudgeService {

    /**
     * Judge overall submission status based on test results
     */
    public SubmissionStatus judgeSubmission(TestResultDto[] testResults, 
                                           boolean hasCompilationError,
                                           boolean hasTimeout) {
        // Compilation error takes highest priority
        if (hasCompilationError) {
            return SubmissionStatus.COMPILATION_ERROR;
        }
        
        // Timeout error
        if (hasTimeout) {
            return SubmissionStatus.TIME_LIMIT_EXCEEDED;
        }
        
        // Check test results
        if (testResults == null || testResults.length == 0) {
            return SubmissionStatus.PENDING;
        }
        
        boolean allPassed = true;
        boolean hasRuntimeError = false;
        
        for (TestResultDto result : testResults) {
            if (!result.isPassed()) {
                allPassed = false;
                
                // Check if it's runtime error vs wrong answer
                if (result.getErrorMessage() != null && !result.getErrorMessage().isEmpty()) {
                    hasRuntimeError = true;
                    break;
                }
                if (result.getStderr() != null && !result.getStderr().isEmpty()) {
                    hasRuntimeError = true;
                    break;
                }
            }
        }
        
        if (allPassed) {
            return SubmissionStatus.ACCEPTED;
        }
        
        if (hasRuntimeError) {
            return SubmissionStatus.RUNTIME_ERROR;
        }
        
        return SubmissionStatus.WRONG_ANSWER;
    }
    
    /**
     * Categorize individual test case result
     */
    public String categorizeTestResult(TestResultDto testResult) {
        // Check compilation error
        if (testResult.getCompilerError() != null && !testResult.getCompilerError().isEmpty()) {
            return "COMPILATION_ERROR";
        }
        
        // Check timeout
        if (testResult.getExecutionTimeMs() != null && testResult.getExecutionTimeMs() > 5000) {
            return "TIMEOUT";
        }
        
        // Check runtime error
        if (testResult.getStderr() != null && !testResult.getStderr().isEmpty()) {
            return "RUNTIME_ERROR";
        }
        
        if (testResult.getErrorMessage() != null && !testResult.getErrorMessage().isEmpty()) {
            return "RUNTIME_ERROR";
        }
        
        // Check correctness
        if (testResult.isPassed()) {
            return "CORRECT";
        }
        
        return "WRONG_ANSWER";
    }
    
    /**
     * Get detailed status message
     */
    public String getStatusMessage(SubmissionStatus status, int passedTests, int totalTests) {
        return switch (status) {
            case ACCEPTED -> String.format("Accepted - All %d test cases passed", totalTests);
            case WRONG_ANSWER -> String.format("Wrong Answer - %d/%d test cases passed", passedTests, totalTests);
            case RUNTIME_ERROR -> "Runtime Error - Code crashed during execution";
            case TIME_LIMIT_EXCEEDED -> "Time Limit Exceeded - Execution took too long";
            case COMPILATION_ERROR -> "Compilation Error - Code failed to compile";
            case PENDING -> "Pending - Waiting for execution";
        };
    }
    
    /**
     * Compare outputs (handles whitespace differences)
     */
    public boolean compareOutputs(String expected, String actual) {
        if (expected == null || actual == null) {
            return false;
        }
        
        // Normalize whitespace
        String normalizedExpected = normalizeOutput(expected);
        String normalizedActual = normalizeOutput(actual);
        
        return normalizedExpected.equals(normalizedActual);
    }
    
    /**
     * Normalize output for comparison
     */
    private String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }
        
        // Trim each line and remove trailing whitespace
        String[] lines = output.split("\n");
        StringBuilder normalized = new StringBuilder();
        
        for (String line : lines) {
            String trimmedLine = line.trim();
            if (!trimmedLine.isEmpty()) {
                normalized.append(trimmedLine).append("\n");
            }
        }
        
        return normalized.toString().trim();
    }
    
    /**
     * Calculate score based on test results
     */
    public double calculateScore(int passedTests, int totalTests) {
        if (totalTests == 0) {
            return 0.0;
        }
        return (passedTests * 100.0) / totalTests;
    }
}
