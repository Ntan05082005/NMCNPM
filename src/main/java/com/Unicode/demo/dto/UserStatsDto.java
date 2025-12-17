package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user submission statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {

    private Long userId;
    private String username;

    // Submission counts
    private Long totalSubmissions;
    private Long acceptedSubmissions;
    private Long wrongAnswerSubmissions;
    private Long runtimeErrorSubmissions;
    private Long compilationErrorSubmissions;
    private Long timeLimitExceededSubmissions;

    // Problem counts
    private Long totalProblemsSolved; // Distinct problems with at least one ACCEPTED
    private Long totalProblemsAttempted; // Distinct problems attempted

    // Rates
    private Double acceptanceRate; // acceptedSubmissions / totalSubmissions * 100

    // Additional stats
    private Long easyProblemsSolved;
    private Long mediumProblemsSolved;
    private Long hardProblemsSolved;
}
