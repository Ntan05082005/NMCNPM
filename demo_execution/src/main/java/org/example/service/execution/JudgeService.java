package org.example.service.execution;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.TestCaseResultDTO;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;
import java.util.concurrent.*;

/**
 * YÊU CẦU 3: Judge Logic - Phân loại kết quả execution
 * Categorize results: CORRECT, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JudgeService {

    private final RuntimeCalculator runtimeCalculator;
    private final ErrorCaptureService errorCaptureService;

    // Giới hạn
    private static final long TIME_LIMIT_MS = 5000; // 5 giây
    private static final long MEMORY_LIMIT_KB = 256 * 1024; // 256 MB

    /**
     * Execute và judge 1 test case
     */
    public TestCaseResultDTO executeTestCase(
            String code,
            String language,
            String input,
            String expectedOutput,
            Integer testCaseNumber
    ) {
        log.info("Executing test case #{} for language: {}", testCaseNumber, language);

        TestCaseResultDTO.TestCaseResultDTOBuilder resultBuilder = TestCaseResultDTO.builder()
                .testCaseNumber(testCaseNumber)
                .input(input)
                .expectedOutput(expectedOutput);

        Path tempDir = null;
        try {
            // 1. Tạo temp directory
            tempDir = Files.createTempDirectory("judge_" + UUID.randomUUID());

            // 2. Compile code (nếu cần)
            CompilationResult compilationResult = compileCode(code, language, tempDir);

            if (!compilationResult.isSuccess()) {
                // COMPILATION_ERROR
                return resultBuilder
                        .status(TestCaseResultDTO.TestCaseStatus.COMPILATION_ERROR)
                        .passed(false)
                        .compilerError(compilationResult.getErrorMessage())
                        .stderr(compilationResult.getStderr())
                        .executionTimeMs(0L)
                        .memoryUsedMB(0.0)
                        .build();
            }

            // 3. Execute code với input
            ExecutionResult executionResult = executeCode(
                    compilationResult.getExecutablePath(),
                    language,
                    input,
                    tempDir
            );

            // 4. Phân loại kết quả
            return categorizeResult(
                    executionResult,
                    expectedOutput,
                    testCaseNumber,
                    resultBuilder
            );

        } catch (Exception e) {
            log.error("Unexpected error during test case execution", e);
            return resultBuilder
                    .status(TestCaseResultDTO.TestCaseStatus.RUNTIME_ERROR)
                    .passed(false)
                    .errorMessage("System error: " + e.getMessage())
                    .stderr(getStackTrace(e))
                    .build();
        } finally {
            // Cleanup temp files
            if (tempDir != null) {
                cleanupTempDirectory(tempDir);
            }
        }
    }

    /**
     * BƯỚC 1: Compile code
     */
    private CompilationResult compileCode(String code, String language, Path tempDir) throws IOException {
        CompilationResult result = new CompilationResult();

        switch (language.toLowerCase()) {
            case "java":
                result = compileJava(code, tempDir);
                break;
            case "python":
                // Python không cần compile
                Path pythonFile = tempDir.resolve("Solution.py");
                Files.writeString(pythonFile, code);
                result.setSuccess(true);
                result.setExecutablePath(pythonFile.toString());
                break;
            case "cpp":
            case "c++":
                result = compileCpp(code, tempDir);
                break;
            default:
                result.setSuccess(false);
                result.setErrorMessage("Unsupported language: " + language);
        }

        return result;
    }

    /**
     * Compile Java code
     */
    private CompilationResult compileJava(String code, Path tempDir) throws IOException {
        CompilationResult result = new CompilationResult();
        Path javaFile = tempDir.resolve("Solution.java");
        Files.writeString(javaFile, code);

        try {
            ProcessBuilder pb = new ProcessBuilder("javac", javaFile.toString());
            pb.directory(tempDir.toFile());
            Process process = pb.start();

            // Capture compilation output
            ErrorCaptureService.ProcessOutput output =
                    errorCaptureService.captureOutput(process, 10);

            boolean compiled = process.waitFor(10, TimeUnit.SECONDS);

            if (!compiled || process.exitValue() != 0) {
                // Compilation failed
                ErrorCaptureService.CompilerError compilerError =
                        errorCaptureService.parseCompilerError(output.getStderr(), "java");

                result.setSuccess(false);
                result.setErrorMessage(compilerError.getErrorMessage());
                result.setStderr(output.getStderr());
            } else {
                result.setSuccess(true);
                result.setExecutablePath(tempDir.toString());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            result.setSuccess(false);
            result.setErrorMessage("Compilation timeout");
        }

        return result;
    }

    /**
     * Compile C++ code
     */
    private CompilationResult compileCpp(String code, Path tempDir) throws IOException {
        CompilationResult result = new CompilationResult();
        Path cppFile = tempDir.resolve("solution.cpp");
        Path executable = tempDir.resolve("solution.out");
        Files.writeString(cppFile, code);

        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "g++", "-o", executable.toString(), cppFile.toString()
            );
            pb.directory(tempDir.toFile());
            Process process = pb.start();

            ErrorCaptureService.ProcessOutput output =
                    errorCaptureService.captureOutput(process, 10);

            boolean compiled = process.waitFor(10, TimeUnit.SECONDS);

            if (!compiled || process.exitValue() != 0) {
                ErrorCaptureService.CompilerError compilerError =
                        errorCaptureService.parseCompilerError(output.getStderr(), "cpp");

                result.setSuccess(false);
                result.setErrorMessage(compilerError.getErrorMessage());
                result.setStderr(output.getStderr());
            } else {
                result.setSuccess(true);
                result.setExecutablePath(executable.toString());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            result.setSuccess(false);
            result.setErrorMessage("Compilation timeout");
        }

        return result;
    }

    /**
     * BƯỚC 2: Execute compiled code
     */
    private ExecutionResult executeCode(
            String executablePath,
            String language,
            String input,
            Path tempDir
    ) throws IOException {
        ExecutionResult result = new ExecutionResult();

        ProcessBuilder pb = createProcessBuilder(language, executablePath, tempDir);
        pb.redirectErrorStream(false);

        try {
            Process process = pb.start();

            // Gửi input vào stdin
            if (input != null && !input.isEmpty()) {
                try (BufferedWriter writer = new BufferedWriter(
                        new OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(input);
                    writer.flush();
                }
            }

            // Đo runtime và capture output
            long startTime = System.nanoTime();

            ErrorCaptureService.ProcessOutput output =
                    errorCaptureService.captureOutput(process, Math.toIntExact(TIME_LIMIT_MS / 1000));

            boolean finished = process.waitFor(TIME_LIMIT_MS, TimeUnit.MILLISECONDS);

            long runtimeMs = (System.nanoTime() - startTime) / 1_000_000;

            if (!finished) {
                // TIME_LIMIT_EXCEEDED
                process.destroyForcibly();
                result.setTimedOut(true);
                result.setRuntimeMs(TIME_LIMIT_MS);
            } else {
                result.setRuntimeMs(runtimeMs);
                result.setExitCode(process.exitValue());
                result.setStdout(output.getStdout());
                result.setStderr(output.getStderr());

                // Estimate memory (simplified)
                result.setMemoryUsedMB(estimateMemoryUsage(process));
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            result.setTimedOut(true);
            result.setRuntimeMs(TIME_LIMIT_MS);
        }

        return result;
    }

    /**
     * Create ProcessBuilder based on language
     */
    private ProcessBuilder createProcessBuilder(String language, String executablePath, Path tempDir) {
        switch (language.toLowerCase()) {
            case "java":
                return new ProcessBuilder("java", "-cp", executablePath, "Solution");
            case "python":
                return new ProcessBuilder("python3", executablePath);
            case "cpp":
            case "c++":
                return new ProcessBuilder(executablePath);
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }

    /**
     * BƯỚC 3: Phân loại kết quả (YÊU CẦU 3 - CORE LOGIC)
     */
    private TestCaseResultDTO categorizeResult(
            ExecutionResult executionResult,
            String expectedOutput,
            Integer testCaseNumber,
            TestCaseResultDTO.TestCaseResultDTOBuilder resultBuilder
    ) {
        // Thêm thông tin cơ bản
        resultBuilder
                .executionTimeMs(executionResult.getRuntimeMs())
                .memoryUsedMB(executionResult.getMemoryUsedMB())
                .actualOutput(executionResult.getStdout());

        // 1. TIME_LIMIT_EXCEEDED
        if (executionResult.isTimedOut()) {
            return resultBuilder
                    .status(TestCaseResultDTO.TestCaseStatus.TIME_LIMIT_EXCEEDED)
                    .passed(false)
                    .errorMessage("Time limit exceeded (" + TIME_LIMIT_MS + "ms)")
                    .build();
        }

        // 2. MEMORY_LIMIT_EXCEEDED
        if (executionResult.getMemoryUsedMB() > (MEMORY_LIMIT_KB / 1024.0)) {
            return resultBuilder
                    .status(TestCaseResultDTO.TestCaseStatus.MEMORY_LIMIT_EXCEEDED)
                    .passed(false)
                    .errorMessage("Memory limit exceeded")
                    .build();
        }

        // 3. RUNTIME_ERROR
        if (executionResult.getExitCode() != 0) {
            ErrorCaptureService.RuntimeError runtimeError =
                    errorCaptureService.parseRuntimeError(
                            executionResult.getStderr(),
                            executionResult.getExitCode()
                    );

            return resultBuilder
                    .status(TestCaseResultDTO.TestCaseStatus.RUNTIME_ERROR)
                    .passed(false)
                    .errorMessage(runtimeError.getErrorMessage())
                    .stderr(runtimeError.getStackTrace())
                    .build();
        }

        // 4. So sánh output - CORRECT vs WRONG_ANSWER
        String actualOutput = normalizeOutput(executionResult.getStdout());
        String expected = normalizeOutput(expectedOutput);

        if (actualOutput.equals(expected)) {
            // CORRECT ✅
            return resultBuilder
                    .status(TestCaseResultDTO.TestCaseStatus.CORRECT)
                    .passed(true)
                    .build();
        } else {
            // WRONG_ANSWER ❌
            return resultBuilder
                    .status(TestCaseResultDTO.TestCaseStatus.WRONG_ANSWER)
                    .passed(false)
                    .errorMessage("Expected: " + expectedOutput + ", but got: " + actualOutput)
                    .build();
        }
    }

    /**
     * Normalize output để so sánh (trim whitespace, newlines)
     */
    private String normalizeOutput(String output) {
        if (output == null) return "";
        return output.trim().replaceAll("\\s+", " ");
    }

    /**
     * Estimate memory usage (simplified)
     */
    private double estimateMemoryUsage(Process process) {
        // Simplified estimation - trong production nên dùng tools như /proc/<pid>/status
        return 10.0; // MB
    }

    /**
     * Cleanup temp directory
     */
    private void cleanupTempDirectory(Path tempDir) {
        try {
            Files.walk(tempDir)
                    .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            log.warn("Failed to delete: {}", path);
                        }
                    });
        } catch (IOException e) {
            log.warn("Failed to cleanup temp directory: {}", tempDir, e);
        }
    }

    /**
     * Get stack trace as string
     */
    private String getStackTrace(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    // ==================== INNER CLASSES ====================

    @lombok.Data
    private static class CompilationResult {
        private boolean success;
        private String executablePath;
        private String errorMessage;
        private String stderr;
    }

    @lombok.Data
    private static class ExecutionResult {
        private boolean timedOut;
        private int exitCode;
        private long runtimeMs;
        private double memoryUsedMB;
        private String stdout;
        private String stderr;
    }
}