package com.Unicode.demo.service;

import com.Unicode.demo.dto.SubmitRequest;
import com.Unicode.demo.dto.SubmitResponse;
import com.Unicode.demo.dto.TestResultDto;
import com.Unicode.demo.dto.UserStatsDto;
import com.Unicode.demo.dto.SubmissionListDto;
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
import com.Unicode.demo.mapper.SubmissionMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(SubmissionService.class);

    private final SubmissionMapper submissionMapper;
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

            // Get driver template for the language (LeetCode-style execution)
            String driverTemplate = getDriverTemplate(problem, language);

            CodeExecutionService.ExecutionResult result = codeExecutionService.execute(
                    request.getCode(),
                    language,
                    testCase.getInput(),
                    driverTemplate);

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

            // Debug logging for troubleshooting
            log.debug("Test case {}: input='{}', expected='{}', actual='{}', passed={}",
                    i + 1,
                    testCase.getInput().replace("\n", "\\n"),
                    testCase.getExpectedOutput().replace("\n", "\\n"),
                    result.output().replace("\n", "\\n"),
                    passed);
            log.debug("Driver template present: {}", driverTemplate != null && !driverTemplate.isEmpty());

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
                .compilerError(hasCompilationError ? lastStderr : null)
                .build();
    }

    /**
     * Run code without saving - for testing before submission
     * If customInput is provided, runs with that input only
     * Otherwise runs against sample test cases (first 2)
     */
    public SubmitResponse runCode(SubmitRequest request) {
        // Get problem
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Parse language
        Language language = parseLanguage(request.getLanguage());
        
        // Check if custom input is provided
        String customInput = request.getCustomInput();
        boolean isCustomRun = customInput != null && !customInput.trim().isEmpty();
        
        if (isCustomRun) {
            // Run with custom input only
            return runWithCustomInput(problem, language, request.getCode(), customInput.trim());
        } else {
            // Run with sample test cases
            return runWithSampleTestCases(problem, language, request.getCode());
        }
    }
    
    /**
     * Run code with custom user-provided input
     */
    private SubmitResponse runWithCustomInput(Problem problem, Language language, String code, String customInput) {
        // Get driver template for the language
        String driverTemplate = getDriverTemplate(problem, language);
        
        CodeExecutionService.ExecutionResult result = codeExecutionService.execute(
                code,
                language,
                customInput,
                driverTemplate);
        
        List<TestResultDto> testResults = new ArrayList<>();
        
        TestResultDto testResult = TestResultDto.builder()
                .testCaseNumber(1)
                .input(customInput)
                .expectedOutput("(Custom Input - No Expected Output)")
                .actualOutput(result.output())
                .passed(result.success())
                .executionTimeMs(result.executionTimeMs())
                .errorMessage(result.error())
                .stderr(result.stderr())
                .compilerError(result.compilerError())
                .status(result.success() ? "EXECUTED" : 
                       result.hasCompilationError() ? "COMPILE_ERROR" :
                       result.timedOut() ? "TIME_LIMIT_EXCEEDED" : "RUNTIME_ERROR")
                .build();
        
        testResults.add(testResult);
        
        String status = result.success() ? "EXECUTED" : 
                       result.hasCompilationError() ? "COMPILE_ERROR" :
                       result.timedOut() ? "TIME_LIMIT_EXCEEDED" : "RUNTIME_ERROR";
        
        return SubmitResponse.builder()
                .submissionId(null)
                .status(status)
                .output(result.output())
                .errorMessage(result.error())
                .executionTimeMs(result.executionTimeMs())
                .testResults(testResults)
                .testCasesPassed(result.success() ? 1 : 0)
                .totalTestCases(1)
                .stderr(result.stderr())
                .compilerError(result.compilerError())
                .message("Custom input execution completed")
                .build();
    }
    
    /**
     * Run code with sample test cases (first 2)
     */
    private SubmitResponse runWithSampleTestCases(Problem problem, Language language, String code) {
        // Get test cases for the problem - only use first 2 (sample cases)
        List<TestCase> allTestCases = testCaseRepository.findByProblemId(problem.getId());
        if (allTestCases.isEmpty()) {
            return SubmitResponse.builder()
                    .submissionId(null)
                    .status("NO_TEST_CASES")
                    .errorMessage("No test cases available for this problem. Please use Custom Input to test your code.")
                    .testCasesPassed(0)
                    .totalTestCases(0)
                    .testResults(new ArrayList<>())
                    .message("No test cases found")
                    .build();
        }
        
        // Limit to sample test cases (first 2)
        List<TestCase> sampleTestCases = allTestCases.size() > 2 
                ? allTestCases.subList(0, 2) 
                : allTestCases;

        // Run sample test cases
        List<TestResultDto> testResults = new ArrayList<>();
        int passedCount = 0;
        long totalExecutionTime = 0;
        String lastOutput = "";
        String errorMessage = null;
        String lastStderr = "";
        boolean hasCompilationError = false;
        boolean hasTimeout = false;

        for (int i = 0; i < sampleTestCases.size(); i++) {
            TestCase testCase = sampleTestCases.get(i);

            // Get driver template for the language
            String driverTemplate = getDriverTemplate(problem, language);

            CodeExecutionService.ExecutionResult result = codeExecutionService.execute(
                    code,
                    language,
                    testCase.getInput(),
                    driverTemplate);

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

            // Compare output
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

        // Determine status
        SubmissionStatus finalStatus = judgeService.judgeSubmission(
                testResults.toArray(new TestResultDto[0]),
                hasCompilationError,
                hasTimeout);

        // Return response WITHOUT saving to database
        return SubmitResponse.builder()
                .submissionId(null) // No submission saved
                .status(finalStatus.name())
                .output(lastOutput)
                .errorMessage(errorMessage)
                .executionTimeMs(totalExecutionTime)
                .testResults(testResults)
                .testCasesPassed(passedCount)
                .totalTestCases(sampleTestCases.size())
                .stderr(lastStderr)
                .compilerError(hasCompilationError ? lastStderr : null)
                .message("Run completed (sample test cases only)")
                .build();
    }

    /**
     * Get user's submission history with problem data eagerly loaded
     */
    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserIdWithProblem(userId);
    }

    /**
     * Get user's submission history as DTOs with problem information
     */
    public List<SubmissionListDto> getUserSubmissionsDto(Long userId) {
        List<Submission> submissions = submissionRepository.findByUserIdWithProblem(userId);
        return submissions.stream()
            .map(this::toSubmissionListDto)
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Convert Submission entity to SubmissionListDto
     */
    private SubmissionListDto toSubmissionListDto(Submission submission) {
        return SubmissionListDto.builder()
            .id(submission.getId())
            .userId(submission.getUser() != null ? submission.getUser().getId() : null)
            .username(submission.getUser() != null ? submission.getUser().getUsername() : null)
            .problemId(submission.getProblem() != null ? submission.getProblem().getId() : null)
            .problemTitle(submission.getProblem() != null ? submission.getProblem().getTitle() : "Unknown Problem")
            .problemSlug(submission.getProblem() != null ? submission.getProblem().getSlug() : null)
            .problemDifficulty(submission.getProblem() != null ? submission.getProblem().getDifficulty() : null)
            .language(submission.getLanguage())
            .status(submission.getStatus())
            .executionTimeMs(submission.getExecutionTimeMs())
            .submittedAt(submission.getSubmittedAt())
            .testCasesPassed(submission.getTestCasesPassed())
            .totalTestCases(submission.getTotalTestCases())
            .build();
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

    /**
     * Get driver template for LeetCode-style execution
     * Returns null if no driver template is configured (falls back to full program
     * mode)
     */
    private String getDriverTemplate(Problem problem, Language language) {
        return switch (language) {
            case CPP -> problem.getDriverCodeCpp();
            case PYTHON -> problem.getDriverCodePython();
            case JAVASCRIPT -> problem.getDriverCodeJavascript();
        };
    }

    public Page<SubmissionListDto> getSubmissions(Long userId, Long problemId, SubmissionStatus status, String search,
            Pageable pageable) {
        Specification<Submission> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo User ID
            if (userId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), userId));
            }

            // 2. Lọc theo Problem ID
            if (problemId != null) {
                predicates.add(cb.equal(root.get("problem").get("id"), problemId));
            }

            // 3. Lọc theo Status (ACCEPTED, WRONG_ANSWER,...)
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // 4. Tìm kiếm theo tên bài tập
            if (search != null && !search.isEmpty()) {
                String searchLike = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("problem").get("title")), searchLike));
            }

            // Kết hợp các điều kiện bằng AND
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Query Database và Map sang DTO
        return submissionRepository.findAll(spec, pageable)
                .map(submissionMapper::toListDto);
    }
}
