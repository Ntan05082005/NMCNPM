package com.Unicode.demo.service;

import com.Unicode.demo.dto.PageResponse;
import com.Unicode.demo.dto.ProblemDto;
import com.Unicode.demo.dto.ProblemFilterDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.mapper.ProblemMapper;
import com.Unicode.demo.repository.ProblemRepository;
import com.Unicode.demo.specification.ProblemSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;

    public PageResponse<ProblemDto> getProblems(
            ProblemFilterDto filter,
            int page,
            int size
    ) {
        return getProblems(filter, page, size, null);
    }

    public PageResponse<ProblemDto> getProblems(
            ProblemFilterDto filter,
            int page,
            int size,
            Long userId
    ) {
        // Validate and set defaults
        if (size <= 0 || size > 100) {
            size = 20; // Default page size
        }
        if (page < 0) {
            page = 0;
        }

        // Create sort
        Sort sort = createSort(filter.getSortBy(), filter.getSortDirection());
        
        // Create pageable
        Pageable pageable = PageRequest.of(page, size, sort);

        // Create specification with filters
        Specification<Problem> spec = ProblemSpecification.withFilters(
                filter.getDifficulty(),
                filter.getTags(),
                filter.getSearch(),
                filter.getIsPremium()
        );

        // Execute query
        Page<Problem> problemPage = problemRepository.findAll(spec, pageable);

        // Map to DTOs with user context for solve status
        final Long userIdFinal = userId;
        List<ProblemDto> content = problemPage.getContent().stream()
                .map(problem -> problemMapper.toDto(problem, userIdFinal))
                .collect(Collectors.toList());

        // Create response
        return new PageResponse<>(
                content,
                problemPage.getNumber(),
                problemPage.getSize(),
                problemPage.getTotalElements(),
                problemPage.getTotalPages(),
                problemPage.isLast(),
                problemPage.isFirst()
        );
    }

    public ProblemDto getProblemBySlug(String slug) {
        return getProblemBySlug(slug, null);
    }

    public ProblemDto getProblemBySlug(String slug, Long userId) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Problem not found with slug: " + slug));
        return problemMapper.toDto(problem, userId);
    }

    public ProblemDto getProblemById(Long id) {
        return getProblemById(id, null);
    }

    public ProblemDto getProblemById(Long id, Long userId) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
        return problemMapper.toDto(problem, userId);
    }

    private Sort createSort(String sortBy, String sortDirection) {
        // Default sort - Alphabetical by title
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "title";
            sortDirection = "ASC"; // Always ascending for alphabetical order
        }

        // Validate sort field
        sortBy = switch (sortBy.toLowerCase()) {
            case "likes" -> "likes";
            case "acceptancerate" -> "acceptanceRate";
            case "difficulty" -> "difficulty";
            case "title" -> "title";
            case "createdat" -> "createdAt";
            default -> "title";
        };

        // Determine direction
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return Sort.by(direction, sortBy);
    }
}
