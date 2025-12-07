package com.codingwebsite.backend.service;

import com.codingwebsite.backend.dto.SubmitRequest;
import com.codingwebsite.backend.dto.SubmitResponse;
import com.codingwebsite.backend.dto.TestResultDto;
import com.codingwebsite.backend.entity.Problem;
import com.codingwebsite.backend.entity.Submission;
import com.codingwebsite.backend.entity.TestCase;
import com.codingwebsite.backend.entity.User;
import com.codingwebsite.backend.enums.Language;
import com.codingwebsite.backend.enums.SubmissionStatus;
import com.codingwebsite.backend.repository.ProblemRepository;
import com.codingwebsite.backend.repository.SubmissionRepository;
import com.codingwebsite.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for handling code submissions
 */
@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final CodeExecutionService codeExecutionService;

    public SubmissionService(SubmissionRepository submissionRepository,
            ProblemRepository problemRepository,
            UserRepository userRepository,
            CodeExecutionService codeExecutionService) {
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.codeExecutionService = codeExecutionService;
    }

    /**
     * Submit code for a problem
     */
    @Transactional
    public SubmitResponse submit(SubmitRequest request) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get problem
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Parse language
        Language language = parseLanguage(request.getLanguage());

        // Create submission
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setCode(request.getCode());
        submission.setLanguage(language);
        submission.setStatus(SubmissionStatus.PENDING);

        // Run test cases
        List<TestResultDto> testResults = new ArrayList<>();
        boolean allPassed = true;
        long totalExecutionTime = 0;
        String lastOutput = "";
        String errorMessage = null;

        for (TestCase testCase : problem.getTestCases()) {
            CodeExecutionService.ExecutionResult result = codeExecutionService.execute(
                    request.getCode(),
                    language,
                    testCase.getInput());

            totalExecutionTime += result.executionTimeMs();
            lastOutput = result.output();

            if (!result.success()) {
                allPassed = false;
                errorMessage = result.error();

                // Determine error type
                if (result.error().contains("Time Limit")) {
                    submission.setStatus(SubmissionStatus.TIME_LIMIT_EXCEEDED);
                } else if (result.error().contains("compilation") || result.error().contains("Compilation")) {
                    submission.setStatus(SubmissionStatus.COMPILATION_ERROR);
                } else {
                    submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
                }

                testResults.add(new TestResultDto(
                        testCase.getInput(),
                        testCase.getExpectedOutput(),
                        result.error(),
                        false));
                break;
            }

            // Compare output
            boolean passed = result.output().trim().equals(testCase.getExpectedOutput().trim());
            testResults.add(new TestResultDto(
                    testCase.getInput(),
                    testCase.getExpectedOutput(),
                    result.output(),
                    passed));

            if (!passed) {
                allPassed = false;
            }
        }

        // Set final status
        if (errorMessage == null) {
            submission.setStatus(allPassed ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER);
        }

        submission.setOutput(lastOutput);
        submission.setErrorMessage(errorMessage);
        submission.setExecutionTimeMs(totalExecutionTime);

        // Save submission
        Submission savedSubmission = submissionRepository.save(submission);

        // Build response
        return new SubmitResponse(
                savedSubmission.getId(),
                savedSubmission.getStatus().name(),
                savedSubmission.getOutput(),
                savedSubmission.getErrorMessage(),
                savedSubmission.getExecutionTimeMs(),
                testResults);
    }

    private Language parseLanguage(String language) {
        return switch (language.toLowerCase()) {
            case "python", "py" -> Language.PYTHON;
            case "javascript", "js" -> Language.JAVASCRIPT;
            case "cpp", "c++" -> Language.CPP;
            default -> throw new RuntimeException("Unsupported language: " + language);
        };
    }
}
