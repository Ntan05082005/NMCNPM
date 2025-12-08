package com.Unicode.demo.service;

import com.Unicode.demo.enums.Language;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;

/**
 * Service for executing user code in Docker containers
 * Provides isolated sandbox environment for code execution
 */
@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionService.class);
    private static final int TIMEOUT_SECONDS = 5;
    private static final String DOCKER_NETWORK = "none"; // No network access for security

    private final RuntimeCalculator runtimeCalculator;
    private final ErrorCaptureService errorCaptureService;

    /**
     * Execute code and return the result
     */
    public ExecutionResult execute(String code, Language language, String input) {
        Path tempDir = null;
        try {
            // Create temporary directory for code execution
            tempDir = Files.createTempDirectory("code_exec_");

            // Write code to file
            String fileName = getFileName(language);
            Path codeFile = tempDir.resolve(fileName);
            Files.writeString(codeFile, code);

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

    private String getFileName(Language language) {
        return switch (language) {
            case PYTHON -> "solution.py";
            case JAVASCRIPT -> "solution.js";
            case CPP -> "solution.cpp";
        };
    }

    private String buildDockerCommand(Path tempDir, Language language) {
        String absPath = tempDir.toAbsolutePath().toString().replace("\\", "/");

        return switch (language) {
            case PYTHON -> String.format(
                    "docker run --rm --network=%s -v \"%s:/code:ro\" -w /code python:3.11-slim " +
                            "sh -c \"python solution.py < input.txt\"",
                    DOCKER_NETWORK, absPath);
            case JAVASCRIPT -> String.format(
                    "docker run --rm --network=%s -v \"%s:/code:ro\" -w /code node:20-slim " +
                            "sh -c \"node solution.js < input.txt\"",
                    DOCKER_NETWORK, absPath);
            case CPP -> String.format(
                    "docker run --rm --network=%s -v \"%s:/code\" -w /code gcc:13 " +
                            "sh -c \"g++ -o solution solution.cpp && ./solution < input.txt\"",
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

            // Use RuntimeCalculator for accurate timing
            RuntimeCalculator.RuntimeResult runtimeResult = 
                runtimeCalculator.measureExecutionTime(process, TIMEOUT_SECONDS * 1000L);

            // Use ErrorCaptureService to capture output
            ErrorCaptureService.CapturedOutput captured = 
                errorCaptureService.captureOutput(process, TIMEOUT_SECONDS * 1000L);

            // Check for timeout
            if (runtimeResult.isTimedOut()) {
                return new ExecutionResult(
                    false, 
                    captured.getStdout(), 
                    "Time Limit Exceeded", 
                    runtimeResult.getExecutionTimeMs(),
                    captured.getStderr(),
                    "",
                    true
                );
            }

            // Check exit code
            if (runtimeResult.getExitCode() != 0) {
                String errorMsg = captured.hasError() ? 
                    errorCaptureService.formatErrorMessage(captured) : 
                    "Runtime Error";
                
                return new ExecutionResult(
                    false, 
                    captured.getStdout(), 
                    errorMsg, 
                    runtimeResult.getExecutionTimeMs(),
                    captured.getStderr(),
                    "",
                    false
                );
            }

            // Success
            return new ExecutionResult(
                true, 
                captured.getCleanOutput(), 
                "", 
                runtimeResult.getExecutionTimeMs(),
                "",
                "",
                false
            );

        } catch (Exception e) {
            log.error("Docker execution failed", e);
            return new ExecutionResult(
                false, 
                "", 
                "Failed to execute: " + e.getMessage(), 
                0,
                "",
                "",
                false
            );
        }
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
        String stderr,
        String compilerError,
        boolean timedOut
    ) {
        // Constructor for backward compatibility
        public ExecutionResult(boolean success, String output, String error, long executionTimeMs) {
            this(success, output, error, executionTimeMs, "", "", false);
        }
        
        public boolean hasCompilationError() {
            return compilerError != null && !compilerError.isEmpty();
        }
        
        public boolean hasRuntimeError() {
            return !success && !timedOut && !hasCompilationError();
        }
    }
}
