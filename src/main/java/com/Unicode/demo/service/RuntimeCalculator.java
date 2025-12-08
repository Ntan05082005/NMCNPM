package com.Unicode.demo.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * Calculate accurate runtime using nanoseconds precision
 */
@Slf4j
@Component
public class RuntimeCalculator {

    /**
     * Measure execution time of a process with timeout
     */
    public RuntimeResult measureExecutionTime(Process process, long timeoutMs) {
        RuntimeResult result = new RuntimeResult();
        
        long startTime = System.nanoTime(); // Use nanoTime for accuracy
        
        try {
            boolean finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
            
            long endTime = System.nanoTime();
            long durationNanos = endTime - startTime;
            long durationMs = durationNanos / 1_000_000; // Convert to milliseconds
            
            result.setExecutionTimeMs(durationMs);
            result.setTimedOut(!finished);
            
            if (!finished) {
                process.destroyForcibly();
                log.warn("Process timeout after {}ms", durationMs);
            } else {
                log.debug("Process completed in {}ms", durationMs);
            }
            
            result.setSuccess(finished);
            result.setExitCode(finished ? process.exitValue() : -1);
            
        } catch (InterruptedException e) {
            log.error("Runtime measurement interrupted", e);
            result.setSuccess(false);
            result.setTimedOut(true);
            result.setExecutionTimeMs(timeoutMs);
            Thread.currentThread().interrupt();
        }
        
        return result;
    }
    
    /**
     * Result class for runtime measurement
     */
    @Data
    public static class RuntimeResult {
        private long executionTimeMs;
        private boolean timedOut;
        private boolean success;
        private int exitCode;
        
        public boolean exceededTimeLimit(long timeLimitMs) {
            return executionTimeMs > timeLimitMs || timedOut;
        }
        
        public String getFormattedTime() {
            if (executionTimeMs < 1000) {
                return executionTimeMs + "ms";
            } else {
                double seconds = executionTimeMs / 1000.0;
                return String.format("%.2fs", seconds);
            }
        }
    }
}
