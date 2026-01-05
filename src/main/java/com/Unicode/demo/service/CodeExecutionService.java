package com.Unicode.demo.service;

import com.Unicode.demo.enums.Language;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;
import java.util.regex.*;

/**
 * Service for executing user code in Docker containers
 * Provides isolated sandbox environment for code execution
 */
@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionService.class);
    private static final int TIMEOUT_SECONDS = 10; // Increased to allow for Docker startup
    private static final String DOCKER_NETWORK = "none"; // No network access for security
    private static final Pattern TIME_PATTERN = Pattern.compile("___TIME_MS:(\\d+)___");
    private static final Pattern MEMORY_PATTERN = Pattern.compile("___MEM_KB:(\\d+)___");

    private final RuntimeCalculator runtimeCalculator;
    private final ErrorCaptureService errorCaptureService;

    /**
     * Execute code and return the result
     */
    public ExecutionResult execute(String code, Language language, String input) {
        return execute(code, language, input, null);
    }

    /**
     * Execute code with optional driver template (LeetCode-style)
     * If driverTemplate is provided, user code is wrapped with it before execution
     */
    public ExecutionResult execute(String code, Language language, String input, String driverTemplate) {
        Path tempDir = null;
        try {
            // Create temporary directory for code execution
            tempDir = Files.createTempDirectory("code_exec_");

            // Wrap user code with driver template if provided
            String executableCode = code;
            if (driverTemplate != null && !driverTemplate.isEmpty()) {
                executableCode = wrapWithDriver(code, driverTemplate);
                log.debug("Wrapped user code with driver template");
            }

            // Write code to file
            String fileName = getFileName(language);
            Path codeFile = tempDir.resolve(fileName);
            Files.writeString(codeFile, executableCode);

            // Write input to file
            Path inputFile = tempDir.resolve("input.txt");
            Files.writeString(inputFile, input);

            // Build Docker command
            String dockerCommand = buildDockerCommand(tempDir, language);

            return runDocker(dockerCommand);

        } catch (Exception e) {
            log.error("Execution error: {}", e.getMessage());
            return new ExecutionResult(false, "", e.getMessage(), 0);
        } finally {
            // Cleanup temporary directory
            if (tempDir != null) {
                cleanupTempDir(tempDir);
            }
        }
    }

    /**
     * Wrap user solution code with driver template
     */
    private String wrapWithDriver(String userCode, String driverTemplate) {
        return driverTemplate.replace("{{USER_SOLUTION}}", userCode);
    }

    private String getFileName(Language language) {
        return switch (language) {
            case PYTHON -> "solution.py";
            case JAVASCRIPT -> "solution.js";
            case CPP -> "solution.cpp";
        };
    }

    private String buildDockerCommand(Path tempDir, Language language) {
        String absPath = tempDir.toAbsolutePath().toString().replace("\\", "/");

        // Memory tracking using /usr/bin/time -v -o to write timing to separate file
        // Custom images (unicode-*) have time package pre-installed
        // This keeps program output clean and separate from timing info
        return switch (language) {
            case PYTHON -> String.format(
                    "docker run --rm --network=%s -v \"%s:/code:ro\" -w /code trantho16/unicode-python:latest " +
                            "sh -c \"start=$(date +%%s%%N) && " +
                            "/usr/bin/time -v -o /tmp/time.txt python solution.py < input.txt && " +
                            "end=$(date +%%s%%N) && " +
                            "mem=$(grep 'Maximum resident set size' /tmp/time.txt | awk '{print $NF}') && " +
                            "echo ___TIME_MS:$(((end-start)/1000000))___ && echo ___MEM_KB:${mem:-0}___\"",
                    DOCKER_NETWORK, absPath);
            case JAVASCRIPT -> String.format(
                    "docker run --rm --network=%s -v \"%s:/code:ro\" -w /code trantho16/unicode-node:latest " +
                            "sh -c \"start=$(date +%%s%%N) && " +
                            "/usr/bin/time -v -o /tmp/time.txt node solution.js < input.txt && " +
                            "end=$(date +%%s%%N) && " +
                            "mem=$(grep 'Maximum resident set size' /tmp/time.txt | awk '{print $NF}') && " +
                            "echo ___TIME_MS:$(((end-start)/1000000))___ && echo ___MEM_KB:${mem:-0}___\"",
                    DOCKER_NETWORK, absPath);
            case CPP -> String.format(
                    "docker run --rm --network=%s -v \"%s:/code\" -w /code trantho16/unicode-gcc:latest " +
                            "sh -c \"g++ -O2 -o solution solution.cpp && " +
                            "start=$(date +%%s%%N) && " +
                            "/usr/bin/time -v -o /tmp/time.txt ./solution < input.txt && " +
                            "end=$(date +%%s%%N) && " +
                            "mem=$(grep 'Maximum resident set size' /tmp/time.txt | awk '{print $NF}') && " +
                            "echo ___TIME_MS:$(((end-start)/1000000))___ && echo ___MEM_KB:${mem:-0}___\"",
                    DOCKER_NETWORK, absPath);
        };
    }

    private ExecutionResult runDocker(String command) {
        ProcessBuilder pb = new ProcessBuilder();

        // Use cmd.exe on Windows, sh on Unix
        if (System.getProperty("os.name").toLowerCase().contains("windows")) {
            pb.command("cmd.exe", "/c", command);
        } else {
            pb.command("sh", "-c", command);
        }

        try {
            Process process = pb.start();

            // Use RuntimeCalculator for external timing (fallback)
            RuntimeCalculator.RuntimeResult runtimeResult = runtimeCalculator.measureExecutionTime(process,
                    TIMEOUT_SECONDS * 1000L);

            // Use ErrorCaptureService to capture output
            ErrorCaptureService.CapturedOutput captured = errorCaptureService.captureOutput(process,
                    TIMEOUT_SECONDS * 1000L);

            // Check for timeout
            if (runtimeResult.isTimedOut()) {
                return new ExecutionResult(
                        false,
                        captured.getStdout(),
                        "Time Limit Exceeded",
                        runtimeResult.getExecutionTimeMs(),
                        captured.getStderr(),
                        "",
                        true);
            }

            // Check exit code
            if (runtimeResult.getExitCode() != 0) {
                String errorMsg = captured.hasError() ? errorCaptureService.formatErrorMessage(captured)
                        : "Runtime Error";

                // Detect if this is a compilation error (C++/Java) vs runtime error
                String compilerError = "";
                String stderr = captured.getStderr();
                if (stderr != null && !stderr.isEmpty()) {
                    String lowerStderr = stderr.toLowerCase();
                    // Check for common compilation error patterns
                    if (lowerStderr.contains("error:") &&
                            (lowerStderr.contains(".cpp") || lowerStderr.contains(".c") ||
                                    lowerStderr.contains("solution.cpp") || lowerStderr.contains("expected"))) {
                        compilerError = stderr;
                        errorMsg = "Compilation Error";
                    } else if (lowerStderr.contains("undefined reference") ||
                            lowerStderr.contains("syntax error") ||
                            lowerStderr.contains("cannot find symbol") ||
                            lowerStderr.contains("fatal error")) {
                        compilerError = stderr;
                        errorMsg = "Compilation Error";
                    }
                }

                return new ExecutionResult(
                        false,
                        captured.getStdout(),
                        errorMsg,
                        runtimeResult.getExecutionTimeMs(),
                        captured.getStderr(),
                        compilerError,
                        false);
            }

            // Parse internal timing and memory from output
            String rawOutput = captured.getCleanOutput();
            long internalTimeMs = parseInternalTiming(rawOutput);
            long memoryUsedKb = parseMemoryUsage(rawOutput);
            String cleanOutput = stripMetricsMarkers(rawOutput);

            // Use internal timing if available, otherwise fall back to external
            long finalTime = internalTimeMs >= 0 ? internalTimeMs : runtimeResult.getExecutionTimeMs();

            log.debug("Internal execution time: {}ms (external: {}ms), memory: {}KB",
                    internalTimeMs, runtimeResult.getExecutionTimeMs(), memoryUsedKb);

            // Success
            return new ExecutionResult(
                    true,
                    cleanOutput,
                    "",
                    finalTime,
                    memoryUsedKb,
                    "",
                    "",
                    false);

        } catch (Exception e) {
            log.error("Docker execution failed", e);
            return new ExecutionResult(
                    false,
                    "",
                    "Failed to execute: " + e.getMessage(),
                    0,
                    "",
                    "",
                    false);
        }
    }

    /**
     * Parse internal timing marker from output
     * 
     * @return execution time in ms, or -1 if not found
     */
    private long parseInternalTiming(String output) {
        if (output == null || output.isEmpty()) {
            return -1;
        }
        Matcher matcher = TIME_PATTERN.matcher(output);
        if (matcher.find()) {
            try {
                return Long.parseLong(matcher.group(1));
            } catch (NumberFormatException e) {
                log.warn("Failed to parse internal timing: {}", matcher.group(1));
                return -1;
            }
        }
        return -1;
    }

    /**
     * Parse memory usage marker from output
     * 
     * @return memory used in KB, or 0 if not found
     */
    private long parseMemoryUsage(String output) {
        if (output == null || output.isEmpty()) {
            return 0;
        }
        Matcher matcher = MEMORY_PATTERN.matcher(output);
        if (matcher.find()) {
            try {
                return Long.parseLong(matcher.group(1));
            } catch (NumberFormatException e) {
                log.warn("Failed to parse memory usage: {}", matcher.group(1));
                return 0;
            }
        }
        return 0;
    }

    /**
     * Remove timing and memory markers from output
     */
    private String stripMetricsMarkers(String output) {
        if (output == null) {
            return "";
        }
        String result = TIME_PATTERN.matcher(output).replaceAll("");
        result = MEMORY_PATTERN.matcher(result).replaceAll("");
        return result.trim();
    }

    private void cleanupTempDir(Path tempDir) {
        try {
            Files.walk(tempDir)
                    .sorted((a, b) -> -a.compareTo(b))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            log.warn("Failed to delete: {}", path);
                        }
                    });
        } catch (IOException e) {
            log.warn("Failed to cleanup temp dir: {}", e.getMessage());
        }
    }

    /**
     * Result of code execution
     */
    public record ExecutionResult(
            boolean success,
            String output,
            String error,
            long executionTimeMs,
            long memoryUsedKb,
            String stderr,
            String compilerError,
            boolean timedOut) {
        // Constructor for backward compatibility
        public ExecutionResult(boolean success, String output, String error, long executionTimeMs) {
            this(success, output, error, executionTimeMs, 0, "", "", false);
        }

        // Constructor without memory (for compatibility)
        public ExecutionResult(boolean success, String output, String error, long executionTimeMs,
                String stderr, String compilerError, boolean timedOut) {
            this(success, output, error, executionTimeMs, 0, stderr, compilerError, timedOut);
        }

        public boolean hasCompilationError() {
            return compilerError != null && !compilerError.isEmpty();
        }

        public boolean hasRuntimeError() {
            return !success && !timedOut && !hasCompilationError();
        }
    }
}
