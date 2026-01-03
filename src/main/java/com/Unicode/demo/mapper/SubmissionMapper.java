package com.Unicode.demo.mapper;

import com.Unicode.demo.dto.SubmissionListDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {

    public SubmissionListDto toListDto(Submission submission) {
        Problem problem = submission.getProblem();
        
        return SubmissionListDto.builder()
                .id(submission.getId())
                .userId(submission.getUser() != null ? submission.getUser().getId() : null)
                .username(submission.getUser() != null ? submission.getUser().getUsername() : null)
                .problemId(problem != null ? problem.getId() : null)
                .problemTitle(problem != null ? problem.getTitle() : "Unknown Problem")
                .problemSlug(problem != null ? problem.getSlug() : null)
                .problemDifficulty(problem != null ? problem.getDifficulty() : null)
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .executionTimeMs(submission.getExecutionTimeMs())
                .submittedAt(submission.getSubmittedAt())
                .testCasesPassed(submission.getTestCasesPassed())
                .totalTestCases(submission.getTotalTestCases())
                .build();
    }
}