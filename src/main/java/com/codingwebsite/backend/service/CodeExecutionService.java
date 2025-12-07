package com.codingwebsite.backend.service;

import com.codingwebsite.backend.enums.Language;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;

/**
 * Service for executing user code in Docker containers
 */
@Service
public class CodeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionService.class);
    private static final int TIMEOUT_SECONDS = 5;
    private static final String DOCKER_NETWORK = "none"; // No network access

    /**
     * Execute code and return the output
     */
    public ExecutionResult execute(String code, Language language, String input) {
        Path tempDir = null;
        try {
            // Create temporary directory for code
            tempDir = Files.createTempDirectory("code_exec_");

            // Write code to file
            String fileName = getFileName(language);
            Path codeFile = tempDir.resolve(fileName);
            Files.writeString(codeFile, code);

            // Write input to file
            Path inputFile = tempDir.resolve("input.txt");
            Files.writeString(inputFile, input);

            // Build and run Docker command
            String dockerCommand = buildDockerCommand(tempDir, language);

            return runDocker(dockerCommand);

        } catch (Exception e) {
            log.error("Execution error: {}", e.getMessage());
            return new ExecutionResult(false, "", e.getMessage(), 0);
        } finally {
            // Cleanup temp directory
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
        long startTime = System.currentTimeMillis();
        ProcessBuilder pb = new ProcessBuilder();

        // Use cmd.exe on Windows
        if (System.getProperty("os.name").toLowerCase().contains("windows")) {
            pb.command("cmd.exe", "/c", command);
        } else {
            pb.command("sh", "-c", command);
        }

        try {
            Process process = pb.start();

            // Read output asynchronously
            StringBuilder stdout = new StringBuilder();
            StringBuilder stderr = new StringBuilder();

            ExecutorService executor = Executors.newFixedThreadPool(2);

            Future<?> stdoutFuture = executor.submit(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stdout.append(line).append("\n");
                    }
                } catch (IOException e) {
                    log.error("Error reading stdout: {}", e.getMessage());
                }
            });

            Future<?> stderrFuture = executor.submit(() -> {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getErrorStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stderr.append(line).append("\n");
                    }
                } catch (IOException e) {
                    log.error("Error reading stderr: {}", e.getMessage());
                }
            });

            // Wait for process with timeout
            boolean finished = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                executor.shutdownNow();
                return new ExecutionResult(false, "", "Time Limit Exceeded", TIMEOUT_SECONDS * 1000L);
            }

            // Wait for stream readers
            stdoutFuture.get(1, TimeUnit.SECONDS);
            stderrFuture.get(1, TimeUnit.SECONDS);
            executor.shutdown();

            long executionTime = System.currentTimeMillis() - startTime;
            int exitCode = process.exitValue();

            String output = stdout.toString().trim();
            String error = stderr.toString().trim();

            if (exitCode != 0) {
                return new ExecutionResult(false, output, error.isEmpty() ? "Runtime Error" : error, executionTime);
            }

            return new ExecutionResult(true, output, "", executionTime);

        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            return new ExecutionResult(false, "", "Execution error: " + e.getMessage(), 0);
        } catch (IOException e) {
            return new ExecutionResult(false, "", "Failed to start Docker: " + e.getMessage(), 0);
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
    public record ExecutionResult(boolean success, String output, String error, long executionTimeMs) {
    }
}
