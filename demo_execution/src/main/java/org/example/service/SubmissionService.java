package org.example.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.SubmissionResultDTO;
import org.example.dto.TestCaseResultDTO;
import org.example.service.execution.JudgeService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service tổng hợp - Chạy nhiều test cases và tổng hợp kết quả
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final JudgeService judgeService;

    /**
     * Submit code và chạy tất cả test cases
     */
    public SubmissionResultDTO submitCode(
            String code,
            String language,
            List<TestCaseInput> testCases
    ) {
        log.info("Submitting code for language: {} with {} test cases", language, testCases.size());

        List<TestCaseResultDTO> results = new ArrayList<>();
        long totalRuntime = 0;
        int passedCount = 0;

        // Chạy từng test case
        for (int i = 0; i < testCases.size(); i++) {
            TestCaseInput tc = testCases.get(i);

            TestCaseResultDTO result = judgeService.executeTestCase(
                    code,
                    language,
                    tc.getInput(),
                    tc.getExpectedOutput(),
                    i + 1  // Test case number bắt đầu từ 1
            );

            results.add(result);
            totalRuntime += result.getExecutionTimeMs();

            if (result.isCorrect()) {
                passedCount++;
            }

            // Nếu có lỗi compilation, dừng ngay (không cần chạy test case còn lại)
            if (result.getStatus() == TestCaseResultDTO.TestCaseStatus.COMPILATION_ERROR) {
                log.warn("Compilation error, stopping execution");
                break;
            }
        }

        // Tính toán trạng thái tổng thể
        SubmissionResultDTO.ExecutionStatus overallStatus = determineOverallStatus(results, passedCount, testCases.size());

        return SubmissionResultDTO.builder()
                .status(overallStatus)
                .testCasesPassed(passedCount)
                .totalTestCases(testCases.size())
                .testCaseResults(results)
                .runtimeMs(Math.toIntExact(totalRuntime))
                .memoryKb((int) results.stream()
                        .mapToDouble(r -> r.getMemoryUsedMB() * 1024)
                        .average()
                        .orElse(0))
                .errorMessage(getFirstErrorMessage(results))
                .stderr(getFirstStderr(results))
                .compilerError(getCompilerError(results))
                .build();
    }

    /**
     * Xác định trạng thái tổng thể của submission
     */
    private SubmissionResultDTO.ExecutionStatus determineOverallStatus(
            List<TestCaseResultDTO> results,
            int passedCount,
            int totalTestCases
    ) {
        // Kiểm tra compilation error
        boolean hasCompilationError = results.stream()
                .anyMatch(r -> r.getStatus() == TestCaseResultDTO.TestCaseStatus.COMPILATION_ERROR);
        if (hasCompilationError) {
            return SubmissionResultDTO.ExecutionStatus.COMPILATION_ERROR;
        }

        // Kiểm tra runtime error
        boolean hasRuntimeError = results.stream()
                .anyMatch(r -> r.getStatus() == TestCaseResultDTO.TestCaseStatus.RUNTIME_ERROR);
        if (hasRuntimeError) {
            return SubmissionResultDTO.ExecutionStatus.RUNTIME_ERROR;
        }

        // Kiểm tra timeout
        boolean hasTimeout = results.stream()
                .anyMatch(r -> r.getStatus() == TestCaseResultDTO.TestCaseStatus.TIME_LIMIT_EXCEEDED);
        if (hasTimeout) {
            return SubmissionResultDTO.ExecutionStatus.TIME_LIMIT_EXCEEDED;
        }

        // Kiểm tra memory limit
        boolean hasMemoryLimit = results.stream()
                .anyMatch(r -> r.getStatus() == TestCaseResultDTO.TestCaseStatus.MEMORY_LIMIT_EXCEEDED);
        if (hasMemoryLimit) {
            return SubmissionResultDTO.ExecutionStatus.MEMORY_LIMIT_EXCEEDED;
        }

        // Tất cả pass = CORRECT
        if (passedCount == totalTestCases) {
            return SubmissionResultDTO.ExecutionStatus.CORRECT;
        }

        // Còn lại là WRONG_ANSWER
        return SubmissionResultDTO.ExecutionStatus.WRONG_ANSWER;
    }

    /**
     * Lấy error message đầu tiên
     */
    private String getFirstErrorMessage(List<TestCaseResultDTO> results) {
        if (results == null || results.isEmpty()) {
            return null;
        }
        return results.stream()
                .filter(r -> r != null && r.hasError())
                .map(TestCaseResultDTO::getErrorMessage)
                .filter(msg -> msg != null && !msg.isEmpty())
                .findFirst()
                .orElse(null);
    }

    /**
     * Lấy stderr đầu tiên
     */
    private String getFirstStderr(List<TestCaseResultDTO> results) {
        if (results == null || results.isEmpty()) {
            return null;
        }
        return results.stream()
                .filter(r -> r != null && r.getStderr() != null && !r.getStderr().isEmpty())
                .map(TestCaseResultDTO::getStderr)
                .findFirst()
                .orElse(null);
    }

    /**
     * Lấy compiler error (nếu có)
     */
    private String getCompilerError(List<TestCaseResultDTO> results) {
        if (results == null || results.isEmpty()) {
            return null;
        }
        return results.stream()
                .filter(r -> r != null && r.getStatus() == TestCaseResultDTO.TestCaseStatus.COMPILATION_ERROR)
                .map(TestCaseResultDTO::getCompilerError)
                .filter(err -> err != null && !err.isEmpty())
                .findFirst()
                .orElse(null);
    }

    // ==================== DTO cho input ====================

    /**
     * Input cho 1 test case
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TestCaseInput {
        private String input;
        private String expectedOutput;
    }
}