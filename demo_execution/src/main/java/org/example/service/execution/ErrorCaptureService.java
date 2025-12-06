package org.example.service.execution;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.concurrent.*;

/**
 * YÊU CẦU 2: Capture stderr và Stack Trace
 * Class chuyên bắt và xử lý errors từ process execution
 */
@Slf4j
@Component
public class ErrorCaptureService {

    private final ExecutorService executorService = Executors.newFixedThreadPool(2);

    /**
     * Capture stdout và stderr từ process
     *
     * @param process Process đang chạy
     * @param timeoutSeconds Timeout để đọc output (seconds)
     * @return ProcessOutput chứa stdout và stderr
     */
    public ProcessOutput captureOutput(Process process, int timeoutSeconds) {
        ProcessOutput output = new ProcessOutput();

        try {
            // Đọc stdout và stderr song song (parallel)
            Future<String> stdoutFuture = executorService.submit(() ->
                    readStream(process.getInputStream())
            );

            Future<String> stderrFuture = executorService.submit(() ->
                    readStream(process.getErrorStream())
            );

            // Đợi cả 2 stream với timeout
            try {
                String stdout = stdoutFuture.get(timeoutSeconds, TimeUnit.SECONDS);
                String stderr = stderrFuture.get(timeoutSeconds, TimeUnit.SECONDS);

                output.setStdout(stdout);
                output.setStderr(stderr);
                output.setSuccess(true);

            } catch (TimeoutException e) {
                log.warn("Timeout while reading process output");
                stdoutFuture.cancel(true);
                stderrFuture.cancel(true);
                output.setSuccess(false);
                output.setStderr("Timeout while reading output");
            }

        } catch (Exception e) {
            log.error("Error capturing output", e);
            output.setSuccess(false);
            output.setStderr("Failed to capture output: " + e.getMessage());
        }

        return output;
    }

    /**
     * Đọc stream thành string
     */
    private String readStream(InputStream inputStream) throws IOException {
        StringBuilder output = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        return output.toString();
    }

    /**
     * Parse compiler error từ stderr
     *
     * @param stderr Raw stderr string
     * @param language Programming language
     * @return CompilerError đã được parse
     */
    public CompilerError parseCompilerError(String stderr, String language) {
        CompilerError error = new CompilerError();
        error.setRawError(stderr);

        if (stderr == null || stderr.isEmpty()) {
            error.setHasError(false);
            return error;
        }

        error.setHasError(true);

        // Parse error theo từng ngôn ngữ
        switch (language.toLowerCase()) {
            case "java":
                parseJavaError(stderr, error);
                break;
            case "python":
                parsePythonError(stderr, error);
                break;
            case "cpp":
            case "c++":
                parseCppError(stderr, error);
                break;
            default:
                error.setErrorMessage(stderr);
        }

        return error;
    }

    /**
     * Parse Java compilation errors
     */
    private void parseJavaError(String stderr, CompilerError error) {
        // Java error format: "Solution.java:10: error: ';' expected"
        String[] lines = stderr.split("\n");

        for (String line : lines) {
            if (line.contains("error:")) {
                // Extract line number
                if (line.matches(".*\\.java:\\d+:.*")) {
                    String[] parts = line.split(":");
                    if (parts.length >= 3) {
                        try {
                            error.setLineNumber(Integer.parseInt(parts[1].trim()));
                        } catch (NumberFormatException ignored) {}
                    }
                }

                // Extract error message
                int errorIndex = line.indexOf("error:");
                if (errorIndex != -1) {
                    String msg = line.substring(errorIndex + 6).trim();
                    error.setErrorMessage(msg);
                    break;
                }
            }
        }

        if (error.getErrorMessage() == null) {
            error.setErrorMessage(stderr);
        }
    }

    /**
     * Parse Python errors
     */
    private void parsePythonError(String stderr, CompilerError error) {
        // Python error format: "  File "solution.py", line 10"
        //                      "    SyntaxError: invalid syntax"
        String[] lines = stderr.split("\n");

        for (String line : lines) {
            // Find line number
            if (line.contains("line ")) {
                String[] parts = line.split("line ");
                if (parts.length >= 2) {
                    try {
                        String numStr = parts[1].trim().split("[^0-9]")[0];
                        error.setLineNumber(Integer.parseInt(numStr));
                    } catch (Exception ignored) {
                    }
                }
            }

            // Find error type
            if (line.contains("Error:")) {
                error.setErrorMessage(line.trim());
                break;
            }
        }

        if (error.getErrorMessage() == null) {
            // Get last non-empty line
            for (int i = lines.length - 1; i >= 0; i--) {
                if (!lines[i].trim().isEmpty()) {
                    error.setErrorMessage(lines[i].trim());
                    break;
                }
            }
        }
    }

    /**
     * Parse C++ errors
     */
    private void parseCppError(String stderr, CompilerError error) {
        // C++ error format: "solution.cpp:10:5: error: expected ';'"
        String[] lines = stderr.split("\n");

        for (String line : lines) {
            if (line.contains("error:")) {
                // Extract line number
                String[] parts = line.split(":");
                if (parts.length >= 2) {
                    try {
                        error.setLineNumber(Integer.parseInt(parts[1].trim()));
                    } catch (NumberFormatException ignored) {}
                }

                // Extract error message
                int errorIndex = line.indexOf("error:");
                if (errorIndex != -1) {
                    error.setErrorMessage(line.substring(errorIndex + 6).trim());
                    break;
                }
            }
        }

        if (error.getErrorMessage() == null) {
            error.setErrorMessage(stderr);
        }
    }

    /**
     * Parse runtime error từ stderr
     */
    public RuntimeError parseRuntimeError(String stderr, int exitCode) {
        RuntimeError error = new RuntimeError();
        error.setRawError(stderr);
        error.setExitCode(exitCode);

        if (stderr == null || stderr.isEmpty()) {
            error.setErrorMessage("Process exited with code " + exitCode);
            return error;
        }

        // Tìm exception name và message
        String[] lines = stderr.split("\n");

        for (String line : lines) {
            // Java: "Exception in thread "main" java.lang.NullPointerException"
            if (line.contains("Exception")) {
                int exceptionIndex = line.indexOf("Exception");
                error.setExceptionType(extractExceptionType(line, exceptionIndex));
                error.setErrorMessage(line.trim());
                error.setStackTrace(stderr);
                return error;
            }

            // Python: "ZeroDivisionError: division by zero"
            if (line.contains("Error:")) {
                String[] parts = line.split(":");
                if (parts.length >= 1) {
                    error.setExceptionType(parts[0].trim());
                }
                if (parts.length >= 2) {
                    error.setErrorMessage(parts[1].trim());
                }
                error.setStackTrace(stderr);
                return error;
            }
        }

        // Nếu không parse được, lấy toàn bộ stderr
        error.setErrorMessage(lines.length > 0 ? lines[0] : stderr);
        error.setStackTrace(stderr);

        return error;
    }

    /**
     * Extract exception type từ error message
     */
    private String extractExceptionType(String line, int startIndex) {
        // Tìm từ Exception đến khoảng trắng hoặc ':'
        int endIndex = startIndex + "Exception".length();

        // Tìm ngược về đầu của class name
        int classStart = startIndex;
        while (classStart > 0 && Character.isJavaIdentifierPart(line.charAt(classStart - 1))) {
            classStart--;
        }

        // Extract full exception class name

        return line.substring(classStart, endIndex).trim();
    }

    /**
     * Format stack trace để dễ đọc hơn
     */
    public String formatStackTrace(String stackTrace, int maxLines) {
        if (stackTrace == null || stackTrace.isEmpty()) {
            return "";
        }

        String[] lines = stackTrace.split("\n");
        StringBuilder formatted = new StringBuilder();

        int count = 0;
        for (String line : lines) {
            if (count >= maxLines) {
                formatted.append("... (").append(lines.length - maxLines)
                        .append(" more lines)\n");
                break;
            }
            formatted.append(line).append("\n");
            count++;
        }

        return formatted.toString();
    }

    /**
     * Cleanup resources
     */
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    // ===== Data Classes =====

    @Data
    public static class ProcessOutput {
        private String stdout;
        private String stderr;
        private boolean success;

        public boolean hasStderr() {
            return stderr != null && !stderr.isEmpty();
        }
    }

    @Data
    public static class CompilerError {
        private String rawError;        // Raw stderr
        private String errorMessage;    // Parsed error message
        private Integer lineNumber;     // Line number của lỗi
        private boolean hasError;

        public String getFormattedError() {
            if (lineNumber != null) {
                return String.format("Line %d: %s", lineNumber, errorMessage);
            }
            return errorMessage;
        }
    }

    @Data
    public static class RuntimeError {
        private String rawError;        // Raw stderr
        private String errorMessage;    // Short error message
        private String exceptionType;   // Exception class name
        private String stackTrace;      // Full stack trace
        private int exitCode;

        public String getSummary() {
            if (exceptionType != null) {
                return exceptionType + ": " + errorMessage;
            }
            return errorMessage;
        }
    }
}