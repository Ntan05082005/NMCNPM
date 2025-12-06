package org.example.service.execution;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * YÊU CẦU 1: Calculate Runtime
 * Class chuyên tính toán thời gian thực thi của code
 */
@Slf4j
@Component
public class RuntimeCalculator {

    /**
     * Đo thời gian thực thi của một process
     *
     * @param process Process đang chạy
     * @param timeoutMs Thời gian timeout tối đa (milliseconds)
     * @return RuntimeResult chứa thông tin về thời gian
     */
    public RuntimeResult measureExecutionTime(Process process, long timeoutMs) {
        RuntimeResult result = new RuntimeResult();

        long startTime = System.nanoTime(); // Dùng nanoTime để chính xác hơn

        try {
            // Đợi process kết thúc hoặc timeout
            boolean finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS);

            long endTime = System.nanoTime();
            long durationNanos = endTime - startTime;

            // Convert sang milliseconds
            long durationMs = durationNanos / 1_000_000;

            result.setExecutionTimeMs(durationMs);
            result.setTimedOut(!finished);

            if (!finished) {
                // Process vẫn đang chạy -> kill nó
                process.destroyForcibly();
                log.warn("Process timeout after {}ms", durationMs);
            } else {
                log.debug("Process completed in {}ms", durationMs);
            }

            result.setSuccess(finished);

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
     * Đo thời gian với callback function (functional approach)
     */
    public <T> TimedResult<T> measureTime(java.util.concurrent.Callable<T> task) {
        long startTime = System.nanoTime();

        try {
            T result = task.call();
            long endTime = System.nanoTime();
            long durationMs = (endTime - startTime) / 1_000_000;

            return new TimedResult<>(result, durationMs, true, null);

        } catch (Exception e) {
            long endTime = System.nanoTime();
            long durationMs = (endTime - startTime) / 1_000_000;

            return new TimedResult<>(null, durationMs, false, e.getMessage());
        }
    }

    /**
     * Result class cho runtime measurement
     */
    @Data
    public static class RuntimeResult {
        private long executionTimeMs;      // Thời gian thực thi (milliseconds)
        private boolean timedOut;          // Có bị timeout không?
        private boolean success;           // Có chạy thành công không?

        /**
         * Check xem có vượt quá time limit không
         */
        public boolean exceededTimeLimit(long timeLimitMs) {
            return executionTimeMs > timeLimitMs || timedOut;
        }

        /**
         * Format time để hiển thị
         */
        public String getFormattedTime() {
            if (executionTimeMs < 1000) {
                return executionTimeMs + "ms";
            } else {
                double seconds = executionTimeMs / 1000.0;
                return String.format("%.2fs", seconds);
            }
        }
    }

    /**
         * Generic result class với timing info
         */
        public record TimedResult<T>(T result, long executionTimeMs, boolean success, String errorMessage) {
    }
}