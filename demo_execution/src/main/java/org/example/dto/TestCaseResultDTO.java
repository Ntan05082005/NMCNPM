package org.example.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResultDTO {

    private Integer testCaseNumber;
    private Boolean passed;

    // Input/Output
    private String input;
    private String expectedOutput;
    private String actualOutput;

    // ===== YÊU CẦU 1: Execution Results (Runtime) =====
    private Long executionTimeMs;      // Thời gian thực thi (milliseconds)
    private Double memoryUsedMB;       // Bộ nhớ sử dụng (MB)

    // ===== YÊU CẦU 2: Error Information (stderr, stack trace) =====
    private String errorMessage;       // Thông báo lỗi ngắn gọn
    private String stderr;             // Stack trace đầy đủ từ stderr
    private String compilerError;      // Lỗi biên dịch (nếu có)

    // ===== YÊU CẦU 3: Judge Status Categories =====
    private TestCaseStatus status;

    @Getter
    public enum TestCaseStatus {
        CORRECT("Correct", "✅"),                           // Đúng hoàn toàn
        WRONG_ANSWER("Wrong Answer", "❌"),                 // Sai kết quả
        COMPILATION_ERROR("Compilation Error", "🔧"),      // Lỗi biên dịch
        RUNTIME_ERROR("Runtime Error", "⚠️"),              // Lỗi runtime
        TIME_LIMIT_EXCEEDED("Time Limit Exceeded", "⏱️"),  // Quá thời gian
        MEMORY_LIMIT_EXCEEDED("Memory Limit Exceeded", "💾"); // Quá bộ nhớ

        private final String displayName;
        private final String icon;

        TestCaseStatus(String displayName, String icon) {
            this.displayName = displayName;
            this.icon = icon;
        }

        public String getFormattedName() {
            return icon + " " + displayName;
        }
    }

    // ===== Helper Methods =====

    /**
     * Kiểm tra test case có pass không
     */
    public boolean isCorrect() {
        return status == TestCaseStatus.CORRECT && Boolean.TRUE.equals(passed);
    }

    /**
     * Kiểm tra có lỗi không
     */
    public boolean hasError() {
        return status == TestCaseStatus.RUNTIME_ERROR
                || status == TestCaseStatus.COMPILATION_ERROR
                || status == TestCaseStatus.TIME_LIMIT_EXCEEDED
                || status == TestCaseStatus.MEMORY_LIMIT_EXCEEDED;
    }

    /**
     * Lấy thông báo lỗi đã format
     */
    public String getFormattedErrorMessage() {
        if (status == null) {
            return "Unknown error";
        }

        switch (status) {
            case COMPILATION_ERROR:
                return compilerError != null ? compilerError : "Compilation failed";

            case RUNTIME_ERROR:
                String msg = errorMessage != null ? errorMessage : "Runtime error occurred";
                if (stderr != null && !stderr.isEmpty()) {
                    msg += "\n\nStack trace:\n" + stderr;
                }
                return msg;

            case TIME_LIMIT_EXCEEDED:
                return "Time limit exceeded (took " + executionTimeMs + "ms)";

            case MEMORY_LIMIT_EXCEEDED:
                return "Memory limit exceeded (used " + memoryUsedMB + "MB)";

            case WRONG_ANSWER:
                return "Expected: " + expectedOutput + "\nActual: " + actualOutput;

            case CORRECT:
                return "Test case passed in " + executionTimeMs + "ms";

            default:
                return "Unknown status";
        }
    }

    /**
     * Lấy thông tin ngắn gọn về kết quả
     */
    public String getSummary() {
        return String.format("Test #%d: %s (Runtime: %dms, Memory: %.2fMB)",
                testCaseNumber,
                status.getFormattedName(),
                executionTimeMs,
                memoryUsedMB
        );
    }
}