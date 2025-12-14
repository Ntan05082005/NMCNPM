package com.Unicode.demo.controller;

import com.Unicode.demo.dto.PageResponse;
import com.Unicode.demo.dto.ProblemDto;
import com.Unicode.demo.dto.ProblemDetailDto;
import com.Unicode.demo.dto.ProblemFilterDto;
import com.Unicode.demo.service.ProblemService;
import com.Unicode.demo.service.ProblemDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class ProblemController {

    private final ProblemService problemService;
    private final ProblemDetailService problemDetailService;

    /**
     * Simple test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("ProblemController is accessible!");
    }

    /**
     * Get paginated and filtered problems
     * 
     * Example requests:
     * GET /api/problems?page=0&size=20
     * GET /api/problems?page=0&size=20&difficulty=EASY&difficulty=MEDIUM
     * GET /api/problems?page=0&size=20&tags=array&tags=string
     * GET /api/problems?page=0&size=20&search=two sum
     * GET /api/problems?page=0&size=20&sortBy=likes&sortDirection=DESC
     * GET /api/problems?page=0&size=20&isPremium=false
     */
    @GetMapping
    public ResponseEntity<PageResponse<ProblemDto>> getProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) List<String> difficulty,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isPremium,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        try {
            System.out.println("🎯 ProblemController.getProblems() called");
            ProblemFilterDto filter = new ProblemFilterDto();
            filter.setDifficulty(difficulty);
            filter.setTags(tags);
            filter.setSearch(search);
            filter.setIsPremium(isPremium);
            filter.setSortBy(sortBy);
            filter.setSortDirection(sortDirection);

            System.out.println("🎯 Calling problemService.getProblems()...");
            PageResponse<ProblemDto> response = problemService.getProblems(filter, page, size);
            System.out.println("🎯 Service returned " + response.getTotalElements() + " problems");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Exception in getProblems: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get problem by slug
     * 
     * Example: GET /api/problems/two-sum
     */
    @GetMapping("/{slug}")
    public ResponseEntity<ProblemDto> getProblemBySlug(@PathVariable String slug) {
        ProblemDto problem = problemService.getProblemBySlug(slug);
        return ResponseEntity.ok(problem);
    }

    /**
     * Get problem by ID
     * 
     * Example: GET /api/problems/id/1
     */
    @GetMapping("/id/{id}")
    public ResponseEntity<ProblemDto> getProblemById(@PathVariable Long id) {
        ProblemDto problem = problemService.getProblemById(id);
        return ResponseEntity.ok(problem);
    }

    /**
     * Get problem detail for coding interface by slug
     * 
     * Example: GET /api/problems/two-sum/detail?language=python
     */
    @GetMapping("/{slug}/detail")
    public ResponseEntity<ProblemDetailDto> getProblemDetailBySlug(
            @PathVariable String slug,
            @RequestParam(required = false, defaultValue = "cpp") String language) {
        ProblemDetailDto problemDetail = problemDetailService.getProblemDetailBySlug(slug, language);
        return ResponseEntity.ok(problemDetail);
    }

    /**
     * Get problem detail for coding interface by ID
     * 
     * Example: GET /api/problems/id/1/detail?language=python
     */
    @GetMapping("/id/{id}/detail")
    public ResponseEntity<ProblemDetailDto> getProblemDetailById(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "cpp") String language) {
        ProblemDetailDto problemDetail = problemDetailService.getProblemDetailById(id, language);
        return ResponseEntity.ok(problemDetail);
    }
}
