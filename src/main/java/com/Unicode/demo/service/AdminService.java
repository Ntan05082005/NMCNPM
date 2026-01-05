package com.Unicode.demo.service;

import com.Unicode.demo.dto.*;
import com.Unicode.demo.entity.*;
import com.Unicode.demo.enums.Role;
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

    public AdminService(UserRepository userRepository,
            ProblemRepository problemRepository,
            SubmissionRepository submissionRepository,
            TagRepository tagRepository,
            TestCaseRepository testCaseRepository) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
        this.tagRepository = tagRepository;
        this.testCaseRepository = testCaseRepository;
    }

    // ==================== DASHBOARD STATS ====================

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProblems", problemRepository.count());
        stats.put("totalSubmissions", submissionRepository.count());
        stats.put("totalTags", tagRepository.count());

        // Count by role
        long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN).count();
        stats.put("adminCount", adminCount);
        stats.put("userCount", userRepository.count() - adminCount);

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

    public Page<Problem> getAllProblemsForAdmin(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        if (search != null && !search.isEmpty()) {
            return problemRepository.findByTitleContainingIgnoreCase(search, pageable);
        }
        return problemRepository.findAll(pageable);
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
        if (tagIds != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
            existing.setTags(tags);
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

    public Page<Submission> getAllSubmissions(int page, int size, String status, Long problemId, Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());

        // For now, return all submissions - could add filters later
        return submissionRepository.findAll(pageable);
    }

    public List<Submission> getAcceptedSolutionsForProblem(Long problemId) {
        return submissionRepository.findByProblemIdAndStatus(problemId, "ACCEPTED");
    }

    // ==================== TAGS ====================

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
}
