package com.Unicode.demo.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Service for capturing stdout, stderr, and error messages from code execution
 */
@Slf4j
@Service
public class ErrorCaptureService {

    private static final int MAX_OUTPUT_LINES = 100;
    private static final int MAX_LINE_LENGTH = 1000;

    /**
     * Capture both stdout and stderr from a process
     */
    public CapturedOutput captureOutput(Process process, long timeoutMs) {
        CapturedOutput output = new CapturedOutput();
        
        ExecutorService executor = Executors.newFixedThreadPool(2);
        
        try {
            // Capture stdout
            Future<String> stdoutFuture = executor.submit(() -> 
                readStream(process.getInputStream(), "stdout"));
            
            // Capture stderr
            Future<String> stderrFuture = executor.submit(() -> 
                readStream(process.getErrorStream(), "stderr"));
            
            // Wait for both with timeout
            try {
                output.setStdout(stdoutFuture.get(timeoutMs + 1000, TimeUnit.MILLISECONDS));
                output.setStderr(stderrFuture.get(timeoutMs + 1000, TimeUnit.MILLISECONDS));
            } catch (TimeoutException e) {
                log.warn("Output capture timed out");
                stdoutFuture.cancel(true);
                stderrFuture.cancel(true);
                output.setTimedOut(true);
            } catch (InterruptedException | ExecutionException e) {
                log.error("Error capturing output", e);
                output.setStdout(stdoutFuture.isDone() ? stdoutFuture.get() : "");
                output.setStderr(stderrFuture.isDone() ? stderrFuture.get() : "");
            }
            
        } catch (Exception e) {
            log.error("Failed to capture output", e);
        } finally {
            executor.shutdownNow();
        }
        
        // Extract error details
        if (!output.getStderr().isEmpty()) {
            output.setErrorType(detectErrorType(output.getStderr()));
            output.setStackTrace(extractStackTrace(output.getStderr()));
        }
        
        return output;
    }
    
    /**
     * Read stream with line limit
     */
    private String readStream(InputStream stream, String streamName) {
        List<String> lines = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            int lineCount = 0;
            
            while ((line = reader.readLine()) != null && lineCount < MAX_OUTPUT_LINES) {
                // Truncate very long lines
                if (line.length() > MAX_LINE_LENGTH) {
                    line = line.substring(0, MAX_LINE_LENGTH) + "... (truncated)";
                }
                lines.add(line);
                lineCount++;
            }
            
            if (lineCount >= MAX_OUTPUT_LINES) {
                lines.add("... (output truncated, too many lines)");
            }
            
        } catch (IOException e) {
            log.error("Error reading {}", streamName, e);
        }
        
        return lines.stream().collect(Collectors.joining("\n"));
    }
    
    /**
     * Detect type of error from stderr
     */
    private String detectErrorType(String stderr) {
        String lowerStderr = stderr.toLowerCase();
        
        if (lowerStderr.contains("syntaxerror") || lowerStderr.contains("syntax error")) {
            return "SYNTAX_ERROR";
        }
        if (lowerStderr.contains("compilation") || lowerStderr.contains("error:")) {
            return "COMPILATION_ERROR";
        }
        if (lowerStderr.contains("timeout") || lowerStderr.contains("time limit")) {
            return "TIMEOUT";
        }
        if (lowerStderr.contains("memory")) {
            return "MEMORY_ERROR";
        }
        if (lowerStderr.contains("segmentation fault") || lowerStderr.contains("segfault")) {
            return "SEGMENTATION_FAULT";
        }
        if (lowerStderr.contains("exception") || lowerStderr.contains("error")) {
            return "RUNTIME_ERROR";
        }
        
        return "UNKNOWN_ERROR";
    }
    
    /**
     * Extract stack trace from stderr
     */
    private List<String> extractStackTrace(String stderr) {
        List<String> stackTrace = new ArrayList<>();
        String[] lines = stderr.split("\n");
        
        boolean inStackTrace = false;
        for (String line : lines) {
            // Detect start of stack trace
            if (line.contains("Traceback") || line.contains("at ") || 
                line.trim().startsWith("File \"") || line.contains("Exception")) {
                inStackTrace = true;
            }
            
            if (inStackTrace) {
                stackTrace.add(line);
                
                // Limit stack trace lines
                if (stackTrace.size() >= 20) {
                    stackTrace.add("... (stack trace truncated)");
                    break;
                }
            }
        }
        
        return stackTrace;
    }
    
    /**
     * Format error message for user display
     */
    public String formatErrorMessage(CapturedOutput output) {
        StringBuilder message = new StringBuilder();
        
        if (output.isTimedOut()) {
            message.append("Execution timed out\n");
        }
        
        if (!output.getStderr().isEmpty()) {
            message.append("Error Output:\n");
            message.append(output.getStderr());
            
            if (!output.getStackTrace().isEmpty()) {
                message.append("\n\nStack Trace:\n");
                output.getStackTrace().forEach(line -> message.append(line).append("\n"));
            }
        }
        
        return message.toString().trim();
    }
    
    /**
     * Data class for captured output
     */
    @Data
    public static class CapturedOutput {
        private String stdout = "";
        private String stderr = "";
        private String errorType = "";
        private List<String> stackTrace = new ArrayList<>();
        private boolean timedOut = false;
        
        public boolean hasError() {
            return !stderr.isEmpty() || timedOut;
        }
        
        public String getCleanOutput() {
            return stdout.trim();
        }
    }
}
