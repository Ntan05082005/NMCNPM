package com.codingwebsite.backend.controller;

import com.codingwebsite.backend.dto.SubmitRequest;
import com.codingwebsite.backend.dto.SubmitResponse;
import com.codingwebsite.backend.entity.Problem;
import com.codingwebsite.backend.repository.ProblemRepository;
import com.codingwebsite.backend.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for code submissions
 */
@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final ProblemRepository problemRepository;

    public SubmissionController(SubmissionService submissionService,
            ProblemRepository problemRepository) {
        this.submissionService = submissionService;
        this.problemRepository = problemRepository;
    }

    /**
     * Submit code for a problem
     * POST /api/submissions
     */
    @PostMapping("/submissions")
    public ResponseEntity<SubmitResponse> submit(@Valid @RequestBody SubmitRequest request) {
        SubmitResponse response = submissionService.submit(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all problems
     * GET /api/problems
     */
    @GetMapping("/problems")
    public ResponseEntity<List<Problem>> getProblems() {
        List<Problem> problems = problemRepository.findAll();
        return ResponseEntity.ok(problems);
    }

    /**
     * Get a specific problem
     * GET /api/problems/{id}
     */
    @GetMapping("/problems/{id}")
    public ResponseEntity<Problem> getProblem(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        return ResponseEntity.ok(problem);
    }
}
