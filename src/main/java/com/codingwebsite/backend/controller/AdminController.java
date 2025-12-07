package com.codingwebsite.backend.controller;

import com.codingwebsite.backend.dto.CreateProblemRequest;
import com.codingwebsite.backend.dto.ProblemDto;
import com.codingwebsite.backend.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin controller for problem management
 * All endpoints require ADMIN role
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProblemService problemService;

    public AdminController(ProblemService problemService) {
        this.problemService = problemService;
    }

    /**
     * Create a new problem
     * POST /api/admin/problems
     */
    @PostMapping("/problems")
    public ResponseEntity<ProblemDto> createProblem(@Valid @RequestBody CreateProblemRequest request) {
        ProblemDto problem = problemService.createProblem(request);
        return new ResponseEntity<>(problem, HttpStatus.CREATED);
    }

    /**
     * Get all problems
     * GET /api/admin/problems
     */
    @GetMapping("/problems")
    public ResponseEntity<List<ProblemDto>> getAllProblems() {
        List<ProblemDto> problems = problemService.getAllProblems();
        return ResponseEntity.ok(problems);
    }

    /**
     * Get problem by ID
     * GET /api/admin/problems/{id}
     */
    @GetMapping("/problems/{id}")
    public ResponseEntity<ProblemDto> getProblem(@PathVariable Long id) {
        ProblemDto problem = problemService.getProblemById(id);
        return ResponseEntity.ok(problem);
    }

    /**
     * Delete problem by ID
     * DELETE /api/admin/problems/{id}
     */
    @DeleteMapping("/problems/{id}")
    public ResponseEntity<Map<String, String>> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(Map.of("message", "Problem deleted successfully"));
    }
}
