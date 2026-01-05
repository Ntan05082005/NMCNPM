package com.Unicode.demo.controller;

import com.Unicode.demo.dto.ProblemDto;
import com.Unicode.demo.entity.*;
import com.Unicode.demo.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==================== DASHBOARD ====================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    public ResponseEntity<Page<?>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size, sortBy, direction));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            return ResponseEntity.ok(adminService.updateUserRole(userId, role));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== PROBLEM MANAGEMENT ====================

    @GetMapping("/problems")
    public ResponseEntity<Page<ProblemDto>> getAllProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllProblemsForAdmin(page, size, search));
    }

    @GetMapping("/problems/{problemId}")
    public ResponseEntity<?> getProblemById(@PathVariable Long problemId) {
        try {
            Problem problem = adminService.getProblemById(problemId);
            return ResponseEntity.ok(problem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/problems")
    public ResponseEntity<?> createProblem(@RequestBody Map<String, Object> body) {
        try {
            Problem problem = new Problem();
            problem.setTitle((String) body.get("title"));
            problem.setDescription((String) body.get("description"));
            problem.setDifficulty((String) body.get("difficulty"));
            problem.setConstraints((String) body.get("constraints"));
            problem.setTimeLimitMs((Integer) body.getOrDefault("timeLimitMs", 2000));
            problem.setMemoryLimitMb((Integer) body.getOrDefault("memoryLimitMb", 256));
            problem.setStarterCodeCpp((String) body.get("starterCodeCpp"));
            problem.setStarterCodePython((String) body.get("starterCodePython"));
            problem.setStarterCodeJavascript((String) body.get("starterCodeJavascript"));
            problem.setDriverCodeCpp((String) body.get("driverCodeCpp"));
            problem.setDriverCodePython((String) body.get("driverCodePython"));
            problem.setDriverCodeJavascript((String) body.get("driverCodeJavascript"));
            problem.setFunctionName((String) body.get("functionName"));
            problem.setExample1Input((String) body.get("example1Input"));
            problem.setExample1Output((String) body.get("example1Output"));
            problem.setExample1Explanation((String) body.get("example1Explanation"));
            problem.setExample2Input((String) body.get("example2Input"));
            problem.setExample2Output((String) body.get("example2Output"));
            problem.setExample2Explanation((String) body.get("example2Explanation"));
            problem.setSummary((String) body.get("summary"));
            problem.setLearningObjectives((String) body.get("learningObjectives"));
            problem.setCategory((String) body.get("category"));

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> testCases = (List<Map<String, Object>>) body.get("testCases");

            @SuppressWarnings("unchecked")
            List<Integer> tagIdInts = (List<Integer>) body.get("tagIds");
            List<Long> tagIds = tagIdInts != null ? tagIdInts.stream().map(Long::valueOf).toList() : null;

            Problem created = adminService.createProblem(problem, testCases, tagIds);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/problems/{problemId}")
    public ResponseEntity<?> updateProblem(
            @PathVariable Long problemId,
            @RequestBody Map<String, Object> body) {
        try {
            Problem problem = new Problem();
            problem.setTitle((String) body.get("title"));
            problem.setDescription((String) body.get("description"));
            problem.setDifficulty((String) body.get("difficulty"));
            problem.setConstraints((String) body.get("constraints"));
            problem.setTimeLimitMs((Integer) body.getOrDefault("timeLimitMs", 2000));
            problem.setMemoryLimitMb((Integer) body.getOrDefault("memoryLimitMb", 256));
            problem.setStarterCodeCpp((String) body.get("starterCodeCpp"));
            problem.setStarterCodePython((String) body.get("starterCodePython"));
            problem.setStarterCodeJavascript((String) body.get("starterCodeJavascript"));
            problem.setDriverCodeCpp((String) body.get("driverCodeCpp"));
            problem.setDriverCodePython((String) body.get("driverCodePython"));
            problem.setDriverCodeJavascript((String) body.get("driverCodeJavascript"));
            problem.setFunctionName((String) body.get("functionName"));
            problem.setExample1Input((String) body.get("example1Input"));
            problem.setExample1Output((String) body.get("example1Output"));
            problem.setExample1Explanation((String) body.get("example1Explanation"));
            problem.setExample2Input((String) body.get("example2Input"));
            problem.setExample2Output((String) body.get("example2Output"));
            problem.setExample2Explanation((String) body.get("example2Explanation"));
            problem.setSummary((String) body.get("summary"));
            problem.setLearningObjectives((String) body.get("learningObjectives"));
            problem.setCategory((String) body.get("category"));

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> testCases = (List<Map<String, Object>>) body.get("testCases");

            @SuppressWarnings("unchecked")
            List<Integer> tagIdInts = (List<Integer>) body.get("tagIds");
            List<Long> tagIds = tagIdInts != null ? tagIdInts.stream().map(Long::valueOf).toList() : null;

            Problem updated = adminService.updateProblem(problemId, problem, testCases, tagIds);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/problems/{problemId}")
    public ResponseEntity<?> deleteProblem(@PathVariable Long problemId) {
        try {
            adminService.deleteProblem(problemId);
            return ResponseEntity.ok(Map.of("message", "Problem deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/problems/{problemId}/testcases")
    public ResponseEntity<List<TestCase>> getTestCases(@PathVariable Long problemId) {
        return ResponseEntity.ok(adminService.getTestCases(problemId));
    }

    // ==================== SUBMISSIONS ====================

    @GetMapping("/submissions")
    public ResponseEntity<Page<Submission>> getAllSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Long problemId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity
                .ok(adminService.getAllSubmissions(page, size, status, language, username, problemId, userId));
    }

    @GetMapping("/problems/{problemId}/solutions")
    public ResponseEntity<List<Submission>> getAcceptedSolutions(@PathVariable Long problemId) {
        return ResponseEntity.ok(adminService.getAcceptedSolutionsForProblem(problemId));
    }

    // ==================== TAGS ====================

    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(adminService.getAllTags());
    }
}
