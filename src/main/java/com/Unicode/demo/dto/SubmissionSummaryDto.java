package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Summary DTO for a submission (lightweight version for stats)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionSummaryDto {

    private Long id;
    private Long problemId;
    private String problemTitle;
    private String problemSlug;
    private String difficulty;
    private String language;
    private String status;
    private Long executionTimeMs;
    private LocalDateTime submittedAt;
}
