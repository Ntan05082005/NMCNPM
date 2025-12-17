package com.Unicode.demo.service;

import com.Unicode.demo.dto.SubmitRequest;
import com.Unicode.demo.dto.SubmitResponse;
import com.Unicode.demo.dto.TestResultDto;
import com.Unicode.demo.dto.UserStatsDto;
import com.Unicode.demo.dto.SubmissionSummaryDto;
import com.Unicode.demo.dto.ProblemSummaryDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Submission;
import com.Unicode.demo.entity.TestCase;
import com.Unicode.demo.entity.User;
import com.Unicode.demo.enums.Language;
import com.Unicode.demo.enums.SubmissionStatus;
import com.Unicode.demo.repository.ProblemRepository;
import com.Unicode.demo.repository.SubmissionRepository;
import com.Unicode.demo.repository.TestCaseRepository;
import com.Unicode.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final CodeExecutionService codeExecutionService;
    private final JudgeService judgeService;

    /**
     * Submit code for a problem and run test cases
     */
    @Transactional
    public SubmitResponse submit(SubmitRequest request) {
        // Get current authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get problem
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Get test cases for the problem
        List<TestCase> testCases = testCaseRepository.findByProblemId(problem.getId());
        if (testCases.isEmpty()) {
            throw new RuntimeException("No test cases found for this problem");
        }

        // Parse language
        Language language = parseLanguage(request.getLanguage());

        // Create submission entity
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setCode(request.getCode());
        submission.setLanguage(language);
        submission.setStatus(SubmissionStatus.PENDING);

        // Run all test cases
        List<TestResultDto> testResults = new ArrayList<>();
        int passedCount = 0;
        long totalExecutionTime = 0;
        String lastOutput = "";
        String errorMessage = null;
        String lastStderr = "";
        boolean hasCompilationError = false;
        boolean hasTimeout = false;

        for (int i = 0; i < testCases.size(); i++) {
            TestCase testCase = testCases.get(i);

            CodeExecutionService.ExecutionResult result = codeExecutionService.execute(
                    request.getCode(),
                    language,
                    testCase.getInput());

            totalExecutionTime += result.executionTimeMs();
            lastOutput = result.output();
            lastStderr = result.stderr();

            // Check for execution errors
            if (!result.success()) {
                errorMessage = result.error();

                if (result.timedOut()) {
                    hasTimeout = true;
                }

                if (result.hasCompilationError()) {
                    hasCompilationError = true;
                }

                // Build detailed test result
                TestResultDto testResult = TestResultDto.builder()
                        .testCaseNumber(i + 1)
                        .input(testCase.getInput())
                        .expectedOutput(testCase.getExpectedOutput())
                        .actualOutput(result.output())
                        .passed(false)
                        .executionTimeMs(result.executionTimeMs())
                        .errorMessage(result.error())
                        .stderr(result.stderr())
                        .compilerError(result.compilerError())
                        .status(judgeService.categorizeTestResult(TestResultDto.builder()
                                .stderr(result.stderr())
                                .compilerError(result.compilerError())
                                .executionTimeMs(result.executionTimeMs())
                                .build()))
                        .build();

                testResults.add(testResult);
                break; // Stop on first error
            }

            // Compare output with expected output using JudgeService
            boolean passed = judgeService.compareOutputs(testCase.getExpectedOutput(), result.output());

            if (passed) {
                passedCount++;
            }

            TestResultDto testResult = TestResultDto.builder()
                    .testCaseNumber(i + 1)
                    .input(testCase.getInput())
                    .expectedOutput(testCase.getExpectedOutput())
                    .actualOutput(result.output())
                    .passed(passed)
                    .executionTimeMs(result.executionTimeMs())
                    .status(passed ? "CORRECT" : "WRONG_ANSWER")
                    .build();

            testResults.add(testResult);
        }

        // Use JudgeService to determine final status
        SubmissionStatus finalStatus = judgeService.judgeSubmission(
                testResults.toArray(new TestResultDto[0]),
                hasCompilationError,
                hasTimeout);

        submission.setStatus(finalStatus);

        submission.setOutput(lastOutput);
        submission.setErrorMessage(errorMessage);
        submission.setExecutionTimeMs(totalExecutionTime);

        // Save submission to database
        Submission savedSubmission = submissionRepository.save(submission);

        // Build enhanced response using builder
        return SubmitResponse.builder()
                .submissionId(savedSubmission.getId())
                .status(savedSubmission.getStatus().name())
                .output(savedSubmission.getOutput())
                .errorMessage(savedSubmission.getErrorMessage())
                .executionTimeMs(savedSubmission.getExecutionTimeMs())
                .testResults(testResults)
                .testCasesPassed(passedCount)
                .totalTestCases(testCases.size())
                .stderr(lastStderr)
                .compilerError(hasCompilationError ? errorMessage : null)
                .build();
    }

    /**
     * Get user's submission history
     */
    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
    }

    /**
     * Get all submissions for a problem
     */
    public List<Submission> getProblemSubmissions(Long problemId) {
        return submissionRepository.findByProblemIdOrderBySubmittedAtDesc(problemId);
    }

    /**
     * Get a submission by ID
     */
    public Submission getSubmissionById(Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + submissionId));
    }

    /**
     * Get user submission statistics with detailed breakdowns
     */
    public UserStatsDto getUserStats(Long userId) {
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Get all user submissions
        List<Submission> allSubmissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);

        // Group submissions by status
        List<SubmissionSummaryDto> acceptedList = new ArrayList<>();
        List<SubmissionSummaryDto> wrongAnswerList = new ArrayList<>();
        List<SubmissionSummaryDto> runtimeErrorList = new ArrayList<>();
        List<SubmissionSummaryDto> compilationErrorList = new ArrayList<>();
        List<SubmissionSummaryDto> timeLimitExceededList = new ArrayList<>();

        for (Submission s : allSubmissions) {
            SubmissionSummaryDto summary = SubmissionSummaryDto.builder()
                    .id(s.getId())
                    .problemId(s.getProblem().getId())
                    .problemTitle(s.getProblem().getTitle())
                    .problemSlug(s.getProblem().getSlug())
                    .difficulty(s.getProblem().getDifficulty())
                    .language(s.getLanguage().name())
                    .status(s.getStatus().name())
                    .executionTimeMs(s.getExecutionTimeMs())
                    .submittedAt(s.getSubmittedAt())
                    .build();

            switch (s.getStatus()) {
                case ACCEPTED -> acceptedList.add(summary);
                case WRONG_ANSWER -> wrongAnswerList.add(summary);
                case RUNTIME_ERROR -> runtimeErrorList.add(summary);
                case COMPILATION_ERROR -> compilationErrorList.add(summary);
                case TIME_LIMIT_EXCEEDED -> timeLimitExceededList.add(summary);
                default -> {
                } // PENDING or other statuses
            }
        }

        // Get distinct problems solved by difficulty
        List<ProblemSummaryDto> easyProblemsList = new ArrayList<>();
        List<ProblemSummaryDto> mediumProblemsList = new ArrayList<>();
        List<ProblemSummaryDto> hardProblemsList = new ArrayList<>();

        // Get unique solved problems from accepted submissions
        acceptedList.stream()
                .map(s -> ProblemSummaryDto.builder()
                        .id(s.getProblemId())
                        .title(s.getProblemTitle())
                        .slug(s.getProblemSlug())
                        .difficulty(s.getDifficulty())
                        .build())
                .distinct()
                .forEach(p -> {
                    switch (p.getDifficulty().toUpperCase()) {
                        case "EASY" -> easyProblemsList.add(p);
                        case "MEDIUM" -> mediumProblemsList.add(p);
                        case "HARD" -> hardProblemsList.add(p);
                    }
                });

        // Count problems
        Long totalProblemsAttempted = submissionRepository.countDistinctProblemsAttemptedByUserId(userId);
        Long totalProblemsSolved = submissionRepository.countDistinctProblemsSolvedByUserId(userId);

        // Calculate acceptance rate
        Long totalSubmissions = (long) allSubmissions.size();
        Long acceptedCount = (long) acceptedList.size();
        Double acceptanceRate = totalSubmissions > 0
                ? (acceptedCount * 100.0) / totalSubmissions
                : 0.0;

        return UserStatsDto.builder()
                .userId(userId)
                .username(user.getUsername())
                .totalSubmissions(totalSubmissions)
                .acceptedCount(acceptedCount)
                .wrongAnswerCount((long) wrongAnswerList.size())
                .runtimeErrorCount((long) runtimeErrorList.size())
                .compilationErrorCount((long) compilationErrorList.size())
                .timeLimitExceededCount((long) timeLimitExceededList.size())
                .totalProblemsAttempted(totalProblemsAttempted)
                .totalProblemsSolved(totalProblemsSolved)
                .easyProblemsSolved((long) easyProblemsList.size())
                .mediumProblemsSolved((long) mediumProblemsList.size())
                .hardProblemsSolved((long) hardProblemsList.size())
                .acceptanceRate(Math.round(acceptanceRate * 100.0) / 100.0)
                // Detailed lists
                .acceptedSubmissions(acceptedList)
                .wrongAnswerSubmissions(wrongAnswerList)
                .runtimeErrorSubmissions(runtimeErrorList)
                .compilationErrorSubmissions(compilationErrorList)
                .timeLimitExceededSubmissions(timeLimitExceededList)
                .easyProblemsSolvedList(easyProblemsList)
                .mediumProblemsSolvedList(mediumProblemsList)
                .hardProblemsSolvedList(hardProblemsList)
                .build();
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
