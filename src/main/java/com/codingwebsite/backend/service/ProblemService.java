package com.codingwebsite.backend.service;

import com.codingwebsite.backend.dto.CreateProblemRequest;
import com.codingwebsite.backend.dto.ProblemDto;
import com.codingwebsite.backend.entity.Problem;
import com.codingwebsite.backend.entity.TestCase;
import com.codingwebsite.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for problem management
 */
@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    /**
     * Create a new problem with test cases
     */
    @Transactional
    public ProblemDto createProblem(CreateProblemRequest request) {
        Problem problem = new Problem(request.getTitle(), request.getDescription());

        for (CreateProblemRequest.TestCaseRequest tcRequest : request.getTestCases()) {
            TestCase testCase = new TestCase(tcRequest.getInput(), tcRequest.getExpectedOutput());
            problem.addTestCase(testCase);
        }

        Problem savedProblem = problemRepository.save(problem);
        return toDto(savedProblem);
    }

    /**
     * Get all problems
     */
    public List<ProblemDto> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get problem by ID
     */
    public ProblemDto getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
        return toDto(problem);
    }

    /**
     * Delete problem by ID
     */
    @Transactional
    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new RuntimeException("Problem not found with id: " + id);
        }
        problemRepository.deleteById(id);
    }

    /**
     * Convert Problem entity to DTO
     */
    private ProblemDto toDto(Problem problem) {
        List<ProblemDto.TestCaseDto> testCaseDtos = problem.getTestCases().stream()
                .map(tc -> new ProblemDto.TestCaseDto(tc.getId(), tc.getInput(), tc.getExpectedOutput()))
                .collect(Collectors.toList());

        return new ProblemDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                testCaseDtos);
    }
}
