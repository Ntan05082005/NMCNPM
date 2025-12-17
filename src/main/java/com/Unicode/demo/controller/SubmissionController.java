package com.Unicode.demo.controller;

import com.Unicode.demo.dto.SubmitRequest;
import com.Unicode.demo.dto.SubmitResponse;
import com.Unicode.demo.entity.Submission;
import com.Unicode.demo.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for code submission endpoints
 */
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    /**
     * Submit code for a problem
     * POST /api/submissions
     * 
     * Request body:
     * {
     * "problemId": 1,
     * "code": "def two_sum(nums, target): ...",
     * "language": "python"
     * }
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SubmitResponse> submit(@Valid @RequestBody SubmitRequest request) {
        SubmitResponse response = submissionService.submit(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get user's submission history
     * GET /api/submissions/user/{userId}
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Submission>> getUserSubmissions(@PathVariable Long userId) {
        List<Submission> submissions = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Get all submissions for a problem
     * GET /api/submissions/problem/{problemId}
     */
    @GetMapping("/problem/{problemId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Submission>> getProblemSubmissions(@PathVariable Long problemId) {
        List<Submission> submissions = submissionService.getProblemSubmissions(problemId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Get a submission by ID
     * GET /api/submissions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long id) {
        Submission submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(submission);
    }
}
