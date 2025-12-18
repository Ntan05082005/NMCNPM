package com.Unicode.demo.dto;

import com.Unicode.demo.enums.Language;
import com.Unicode.demo.enums.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionListDto {
    private Long id;
    private Long userId;
    private String username;
    private Long problemId;
    private String problemTitle;
    private String problemSlug;
    private Language language;
    private SubmissionStatus status;
    private Long executionTimeMs;
    private LocalDateTime submittedAt;
    private Integer testCasesPassed;
    private Integer totalTestCases;
}