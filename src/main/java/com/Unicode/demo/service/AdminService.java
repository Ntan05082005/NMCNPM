package com.Unicode.demo.service;

import com.Unicode.demo.dto.*;
import com.Unicode.demo.entity.*;
import com.Unicode.demo.enums.Role;
import com.Unicode.demo.mapper.ProblemMapper;
import com.Unicode.demo.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final TagRepository tagRepository;
    private final TestCaseRepository testCaseRepository;
    private final ProblemMapper problemMapper;

    public AdminService(UserRepository userRepository,
            ProblemRepository problemRepository,
            SubmissionRepository submissionRepository,
            TagRepository tagRepository,
            TestCaseRepository testCaseRepository,
            ProblemMapper problemMapper) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
        this.tagRepository = tagRepository;
        this.testCaseRepository = testCaseRepository;
        this.problemMapper = problemMapper;
    }

    // ==================== DASHBOARD STATS ====================

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic counts
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProblems", problemRepository.count());
        stats.put("totalSubmissions", submissionRepository.count());
        stats.put("totalTags", tagRepository.count());

        // Count by role
        long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN).count();
        stats.put("adminCount", adminCount);
        stats.put("userCount", userRepository.count() - adminCount);

        // Advanced Analytics
        
        // Submission statistics by status (using SubmissionStatus enum)
        List<Submission> allSubmissions = submissionRepository.findAll();
        
        long acceptedSubmissions = allSubmissions.stream()
                .filter(s -> s.getStatus() != null && s.getStatus().name().equals("ACCEPTED")).count();
        long wrongAnswerSubmissions = allSubmissions.stream()
                .filter(s -> s.getStatus() != null && s.getStatus().name().equals("WRONG_ANSWER")).count();
        long timeLimitExceeded = allSubmissions.stream()
                .filter(s -> s.getStatus() != null && s.getStatus().name().equals("TIME_LIMIT_EXCEEDED")).count();
        long runtimeError = allSubmissions.stream()
                .filter(s -> s.getStatus() != null && s.getStatus().name().equals("RUNTIME_ERROR")).count();
        long compilationError = allSubmissions.stream()
                .filter(s -> s.getStatus() != null && s.getStatus().name().equals("COMPILATION_ERROR")).count();
        long pending = allSubmissions.stream()
                .filter(s -> s.getStatus() != null && s.getStatus().name().equals("PENDING")).count();
        
        long totalSubmissions = submissionRepository.count();
        
        stats.put("acceptedSubmissions", acceptedSubmissions);
        stats.put("wrongAnswerSubmissions", wrongAnswerSubmissions);
        stats.put("timeLimitExceeded", timeLimitExceeded);
        stats.put("runtimeError", runtimeError);
        stats.put("compilationError", compilationError);
        stats.put("pendingSubmissions", pending);
        
        // Success rate
        double successRate = totalSubmissions > 0 
            ? (acceptedSubmissions * 100.0 / totalSubmissions) 
            : 0.0;
        stats.put("successRate", Math.round(successRate * 100.0) / 100.0);
        
        // Submission status breakdown for chart
        Map<String, Long> submissionsByStatus = new HashMap<>();
        submissionsByStatus.put("ACCEPTED", acceptedSubmissions);
        submissionsByStatus.put("WRONG_ANSWER", wrongAnswerSubmissions);
        submissionsByStatus.put("TIME_LIMIT_EXCEEDED", timeLimitExceeded);
        submissionsByStatus.put("RUNTIME_ERROR", runtimeError);
        submissionsByStatus.put("COMPILATION_ERROR", compilationError);
        submissionsByStatus.put("PENDING", pending);
        stats.put("submissionsByStatus", submissionsByStatus);

        // Problem difficulty breakdown
        long easyProblems = problemRepository.findAll().stream()
                .filter(p -> "EASY".equalsIgnoreCase(p.getDifficulty())).count();
        long mediumProblems = problemRepository.findAll().stream()
                .filter(p -> "MEDIUM".equalsIgnoreCase(p.getDifficulty())).count();
        long hardProblems = problemRepository.findAll().stream()
                .filter(p -> "HARD".equalsIgnoreCase(p.getDifficulty())).count();
        
        Map<String, Long> problemsByDifficulty = new HashMap<>();
        problemsByDifficulty.put("easy", easyProblems);
        problemsByDifficulty.put("medium", mediumProblems);
        problemsByDifficulty.put("hard", hardProblems);
        stats.put("problemsByDifficulty", problemsByDifficulty);

        // Active users (users who submitted in last 7 days)
        java.time.LocalDateTime weekAgo = java.time.LocalDateTime.now().minusDays(7);
        long activeUsersThisWeek = submissionRepository.findAll().stream()
                .filter(s -> s.getSubmittedAt() != null && s.getSubmittedAt().isAfter(weekAgo))
                .map(s -> s.getUser().getId())
                .distinct()
                .count();
        stats.put("activeUsersThisWeek", activeUsersThisWeek);

        // Recent submissions (last 24 hours)
        java.time.LocalDateTime dayAgo = java.time.LocalDateTime.now().minusDays(1);
        long submissionsToday = submissionRepository.findAll().stream()
                .filter(s -> s.getSubmittedAt() != null && s.getSubmittedAt().isAfter(dayAgo))
                .count();
        stats.put("submissionsToday", submissionsToday);

        // Popular problems (top 5 by submission count)
        Map<Problem, Long> problemSubmissionCounts = submissionRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    Submission::getProblem,
                    java.util.stream.Collectors.counting()
                ));
        
        List<Map<String, Object>> popularProblems = problemSubmissionCounts.entrySet().stream()
                .sorted(Map.Entry.<Problem, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> problemInfo = new HashMap<>();
                    problemInfo.put("id", entry.getKey().getId());
                    problemInfo.put("title", entry.getKey().getTitle());
                    problemInfo.put("difficulty", entry.getKey().getDifficulty());
                    problemInfo.put("submissionCount", entry.getValue());
                    return problemInfo;
                })
                .toList();
        stats.put("popularProblems", popularProblems);

        // Recent activity (last 10 submissions)
        List<Map<String, Object>> recentActivity = submissionRepository.findAll().stream()
                .sorted((s1, s2) -> {
                    if (s1.getSubmittedAt() == null) return 1;
                    if (s2.getSubmittedAt() == null) return -1;
                    return s2.getSubmittedAt().compareTo(s1.getSubmittedAt());
                })
                .limit(10)
                .map(s -> {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", s.getId());
                    activity.put("username", s.getUser().getUsername());
                    activity.put("problemTitle", s.getProblem().getTitle());
                    activity.put("status", s.getStatus());
                    activity.put("language", s.getLanguage());
                    activity.put("submittedAt", s.getSubmittedAt());
                    return activity;
                })
                .toList();
        stats.put("recentActivity", recentActivity);

        return stats;
    }

    // ==================== USER MANAGEMENT ====================

    public Page<UserDto> getAllUsers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return userRepository.findAll(pageable)
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole()));
    }

    @Transactional
    public UserDto updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = Role.valueOf(roleName.toUpperCase());
        user.setRole(role);
        User saved = userRepository.save(user);

        return new UserDto(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getRole());
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    // ==================== PROBLEM MANAGEMENT ====================

    public Page<ProblemDto> getAllProblemsForAdmin(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        Page<Problem> problemPage;
        if (search != null && !search.isEmpty()) {
            problemPage = problemRepository.findByTitleContainingIgnoreCase(search, pageable);
        } else {
            problemPage = problemRepository.findAll(pageable);
        }
        
        // Map to DTO and recalculate stats from actual submissions
        return problemPage.map(problem -> {
            ProblemDto dto = problemMapper.toDto(problem);
            
            // Recalculate from actual submissions in database
            Long totalSubs = submissionRepository.countByProblemId(problem.getId());
            Long acceptedSubs = submissionRepository.countAcceptedByProblemId(problem.getId());
            
            dto.setTotalSubmissions(totalSubs.intValue());
            dto.setTotalAccepted(acceptedSubs.intValue());
            
            // Calculate acceptance rate
            if (totalSubs > 0) {
                double rate = (acceptedSubs.doubleValue() / totalSubs.doubleValue()) * 100.0;
                dto.setAcceptanceRate(new java.math.BigDecimal(rate).setScale(2, java.math.RoundingMode.HALF_UP));
            } else {
                dto.setAcceptanceRate(java.math.BigDecimal.ZERO);
            }
            
            return dto;
        });
    }

    public Problem getProblemById(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + problemId));
    }

    @Transactional
    public Problem createProblem(Problem problem, List<Map<String, Object>> testCases, List<Long> tagIds) {
        // Generate slug from title
        String slug = problem.getTitle().toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
        problem.setSlug(slug);

        // Assign tags if provided
        if (tagIds != null && !tagIds.isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
            problem.setTags(tags);
        }

        Problem saved = problemRepository.save(problem);

        // Add test cases
        if (testCases != null) {
            for (Map<String, Object> tc : testCases) {
                TestCase testCase = new TestCase();
                testCase.setInput((String) tc.get("input"));
                testCase.setExpectedOutput((String) tc.get("expectedOutput"));
                testCase.setIsSample(Boolean.TRUE.equals(tc.get("isSample")));
                testCase.setProblem(saved);
                testCaseRepository.save(testCase);
            }
        }

        return saved;
    }

    @Transactional
    public Problem updateProblem(Long problemId, Problem updated, List<Map<String, Object>> testCases,
            List<Long> tagIds) {
        Problem existing = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Update fields
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDifficulty(updated.getDifficulty());
        existing.setConstraints(updated.getConstraints());
        existing.setTimeLimitMs(updated.getTimeLimitMs());
        existing.setMemoryLimitMb(updated.getMemoryLimitMb());
        existing.setStarterCodeCpp(updated.getStarterCodeCpp());
        existing.setStarterCodePython(updated.getStarterCodePython());
        existing.setStarterCodeJavascript(updated.getStarterCodeJavascript());
        existing.setDriverCodeCpp(updated.getDriverCodeCpp());
        existing.setDriverCodePython(updated.getDriverCodePython());
        existing.setDriverCodeJavascript(updated.getDriverCodeJavascript());
        existing.setFunctionName(updated.getFunctionName());
        existing.setExample1Input(updated.getExample1Input());
        existing.setExample1Output(updated.getExample1Output());
        existing.setExample1Explanation(updated.getExample1Explanation());
        existing.setExample2Input(updated.getExample2Input());
        existing.setExample2Output(updated.getExample2Output());
        existing.setExample2Explanation(updated.getExample2Explanation());
        existing.setSummary(updated.getSummary());
        existing.setLearningObjectives(updated.getLearningObjectives());
        existing.setCategory(updated.getCategory());

        // Update tags if provided
        // - If tagIds is null: keep existing tags (frontend didn't send tagIds field)
        // - If tagIds is empty list []: clear all tags
        // - If tagIds has values: replace with new tags
        if (tagIds != null) {
            if (tagIds.isEmpty()) {
                existing.setTags(new HashSet<>()); // Clear tags
            } else {
                Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
                existing.setTags(tags);
            }
        }

        // Update test cases if provided
        if (testCases != null) {
            // Remove old test cases
            testCaseRepository.deleteByProblemId(problemId);

            // Add new test cases
            for (Map<String, Object> tc : testCases) {
                TestCase testCase = new TestCase();
                testCase.setInput((String) tc.get("input"));
                testCase.setExpectedOutput((String) tc.get("expectedOutput"));
                testCase.setIsSample(Boolean.TRUE.equals(tc.get("isSample")));
                testCase.setProblem(existing);
                testCaseRepository.save(testCase);
            }
        }

        return problemRepository.save(existing);
    }

    @Transactional
    public void deleteProblem(Long problemId) {
        if (!problemRepository.existsById(problemId)) {
            throw new RuntimeException("Problem not found");
        }
        problemRepository.deleteById(problemId);
    }

    public List<TestCase> getTestCases(Long problemId) {
        return testCaseRepository.findByProblemId(problemId);
    }

    // ==================== SUBMISSION MANAGEMENT ====================

    public Page<Submission> getAllSubmissions(int page, int size, String status, String language, String username,
            Long problemId, Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());

        // Build specification for dynamic filtering
        org.springframework.data.jpa.domain.Specification<Submission> spec = (root, query, cb) -> cb.conjunction();

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status").as(String.class), status));
        }

        if (language != null && !language.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("language").as(String.class), language));
        }

        if (username != null && !username.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("user").get("username")),
                    "%" + username.toLowerCase() + "%"));
        }

        if (problemId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("problem").get("id"), problemId));
        }

        if (userId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("user").get("id"), userId));
        }

        return submissionRepository.findAll(spec, pageable);
    }

    public List<Submission> getAcceptedSolutionsForProblem(Long problemId) {
        return submissionRepository.findByProblemIdAndStatus(problemId, "ACCEPTED");
    }

    // ==================== TAGS ====================

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
}
