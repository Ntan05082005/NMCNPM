package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for user submission statistics with detailed breakdown
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
    private Long acceptedCount;
    private Long wrongAnswerCount;
    private Long runtimeErrorCount;
    private Long compilationErrorCount;
    private Long timeLimitExceededCount;

    // Problem counts
    private Long totalProblemsSolved; // Distinct problems with at least one ACCEPTED
    private Long totalProblemsAttempted; // Distinct problems attempted

    // Rates
    private Double acceptanceRate; // acceptedSubmissions / totalSubmissions * 100

    // Problems solved by difficulty
    private Long easyProblemsSolved;
    private Long mediumProblemsSolved;
    private Long hardProblemsSolved;

    // Detailed submission lists by status
    private List<SubmissionSummaryDto> acceptedSubmissions;
    private List<SubmissionSummaryDto> wrongAnswerSubmissions;
    private List<SubmissionSummaryDto> runtimeErrorSubmissions;
    private List<SubmissionSummaryDto> compilationErrorSubmissions;
    private List<SubmissionSummaryDto> timeLimitExceededSubmissions;

    // Problems solved by difficulty with details
    private List<ProblemSummaryDto> easyProblemsSolvedList;
    private List<ProblemSummaryDto> mediumProblemsSolvedList;
    private List<ProblemSummaryDto> hardProblemsSolvedList;
}
