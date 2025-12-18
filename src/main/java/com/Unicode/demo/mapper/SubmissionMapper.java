package com.Unicode.demo.mapper;

import com.Unicode.demo.dto.SubmissionListDto;
import com.Unicode.demo.entity.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {

    public SubmissionListDto toListDto(Submission submission) {
        return SubmissionListDto.builder()
                .id(submission.getId())
                .userId(submission.getUser().getId())
                .username(submission.getUser().getUsername())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .problemSlug(submission.getProblem().getSlug())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .executionTimeMs(submission.getExecutionTimeMs())
                .submittedAt(submission.getSubmittedAt())
                .testCasesPassed(submission.getTestCasesPassed())
                .totalTestCases(submission.getTotalTestCases())
                .build();
    }
}