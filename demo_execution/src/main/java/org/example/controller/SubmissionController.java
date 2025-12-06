package org.example.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.SubmissionResultDTO;
import org.example.service.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller cho code submission
 */
@Slf4j
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    /**
     * Submit code và chạy test cases
     *
     * POST /api/submissions/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<SubmissionResultDTO> submitCode(
            @RequestBody SubmitCodeRequest request
    ) {
        log.info("Received submission for language: {}", request.getLanguage());

        try {
            SubmissionResultDTO result = submissionService.submitCode(
                    request.getCode(),
                    request.getLanguage(),
                    request.getTestCases()
            );

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Error during code submission", e);

            // Trả về error response
            SubmissionResultDTO errorResult = SubmissionResultDTO.builder()
                    .status(SubmissionResultDTO.ExecutionStatus.RUNTIME_ERROR)
                    .testCasesPassed(0)
                    .totalTestCases(request.getTestCases().size())
                    .errorMessage("System error: " + e.getMessage())
                    .stderr(getStackTrace(e))
                    .build();

            return ResponseEntity.status(500).body(errorResult);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Judge service is running!");
    }

    // ==================== Request DTO ====================

    /**
     * Request body cho submit code
     */
    @lombok.Data
    public static class SubmitCodeRequest {
        private String code;               // Code của user
        private String language;           // java, python, cpp
        private List<SubmissionService.TestCaseInput> testCases;  // Danh sách test cases
    }

    // Helper method
    private String getStackTrace(Exception e) {
        java.io.StringWriter sw = new java.io.StringWriter();
        java.io.PrintWriter pw = new java.io.PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }
}