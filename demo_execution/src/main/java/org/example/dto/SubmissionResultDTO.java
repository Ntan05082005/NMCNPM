package org.example.dto;

import lombok.*;

import java.util.List;

/**
 * SubmissionResultDTO - Kết quả tổng hợp của TOÀN BỘ submission
 * (Chứa nhiều TestCaseResultDTO)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResultDTO {

    // ===== Thông tin submission =====
    private Long submissionId;
    private Long userId;
    private Long problemId;
    private String language;

    // ===== YÊU CẦU 3: Overall Status =====
    private ExecutionStatus status;  // Trạng thái tổng thể

    // ===== YÊU CẦU 1: Execution Results (Tổng hợp) =====
    private Integer runtimeMs;       // Runtime trung bình hoặc tổng
    private Integer memoryKb;        // Memory trung bình

    // ===== Test Cases Results =====
    private List<TestCaseResultDTO> testCaseResults;  // Danh sách kết quả từng test case
    private Integer testCasesPassed;   // Số test cases đã pass
    private Integer totalTestCases;    // Tổng số test cases

    // ===== YÊU CẦU 2: Error Information (nếu có) =====
    private String errorMessage;       // Lỗi chung (nếu có)
    private String stderr;             // stderr của test case fail đầu tiên
    private String compilerError;      // Lỗi biên dịch (nếu có)

    // ===== YÊU CẦU 3: Execution Status Enum =====
    @Getter
    public enum ExecutionStatus {
        CORRECT("Correct", "✅ Accepted"),
        WRONG_ANSWER("Wrong Answer", "❌ Wrong Answer"),
        COMPILATION_ERROR("Compilation Error", "🔧 Compilation Error"),
        RUNTIME_ERROR("Runtime Error", "⚠️ Runtime Error"),
        TIME_LIMIT_EXCEEDED("Time Limit Exceeded", "⏱️ Time Limit Exceeded"),
        MEMORY_LIMIT_EXCEEDED("Memory Limit Exceeded", "💾 Memory Limit Exceeded");

        private final String status;
        private final String displayName;

        ExecutionStatus(String status, String displayName) {
            this.status = status;
            this.displayName = displayName;
        }

    }

    // ===== Helper Methods =====

    /**
     * Kiểm tra có pass hết test cases không
     */
    public boolean isCorrect() {
        return status == ExecutionStatus.CORRECT &&
                testCasesPassed != null &&
                testCasesPassed.equals(totalTestCases);
    }

    /**
     * Kiểm tra có lỗi không
     */
    public boolean hasError() {
        return status == ExecutionStatus.RUNTIME_ERROR
                || status == ExecutionStatus.COMPILATION_ERROR
                || status == ExecutionStatus.TIME_LIMIT_EXCEEDED
                || status == ExecutionStatus.MEMORY_LIMIT_EXCEEDED;
    }

    /**
     * Tính acceptance rate
     */
    public double getAcceptanceRate() {
        if (totalTestCases == null || totalTestCases == 0) {
            return 0.0;
        }
        return (testCasesPassed * 100.0) / totalTestCases;
    }

    /**
     * Format message tổng hợp cho user
     */
    public String getFormattedMessage() {
        if (status == null) {
            return "Unknown status";
        }

        return switch (status) {
            case CORRECT -> String.format("✅ Accepted! All %d test cases passed in %dms",
                    totalTestCases, runtimeMs);
            case WRONG_ANSWER -> String.format("❌ Wrong Answer: %d/%d test cases passed",
                    testCasesPassed, totalTestCases);
            case COMPILATION_ERROR -> "🔧 Compilation Error: " +
                    (compilerError != null ? compilerError : "Code failed to compile");
            case RUNTIME_ERROR -> String.format("⚠️ Runtime Error on test case %d: %s",
                    testCasesPassed + 1,
                    errorMessage != null ? errorMessage : "Unknown error");
            case TIME_LIMIT_EXCEEDED -> String.format("⏱️ Time Limit Exceeded on test case %d (took %dms)",
                    testCasesPassed + 1, runtimeMs);
            case MEMORY_LIMIT_EXCEEDED -> String.format("💾 Memory Limit Exceeded on test case %d (used %dKB)",
                    testCasesPassed + 1, memoryKb);
        };
    }

    /**
     * Lấy summary ngắn gọn
     */
    public String getSummary() {
        return String.format("%s | %d/%d passed | Runtime: %dms | Memory: %dKB",
                status.getDisplayName(),
                testCasesPassed != null ? testCasesPassed : 0,
                totalTestCases != null ? totalTestCases : 0,
                runtimeMs != null ? runtimeMs : 0,
                memoryKb != null ? memoryKb : 0
        );
    }
}