package com.Unicode.demo.service;

import com.Unicode.demo.dto.ProblemDetailDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Submission;
import com.Unicode.demo.entity.User;
import com.Unicode.demo.mapper.ProblemDetailMapper;
import com.Unicode.demo.repository.ProblemRepository;
import com.Unicode.demo.repository.SubmissionRepository;
import com.Unicode.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for getting problem details in coding interface format
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemDetailService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemDetailMapper problemDetailMapper;

    /**
     * Get problem detail with user's last submission status
     */
    public ProblemDetailDto getProblemDetailBySlug(String slug, String preferredLanguage) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Problem not found with slug: " + slug));

        // Get current user's last submission for this problem
        Submission lastSubmission = getCurrentUserLastSubmission(problem.getId());

        // Convert to detail DTO
        return problemDetailMapper.toDetailDto(problem, lastSubmission, preferredLanguage);
    }

    /**
     * Get problem detail by ID with user's last submission status
     */
    public ProblemDetailDto getProblemDetailById(Long id, String preferredLanguage) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));

        // Get current user's last submission for this problem
        Submission lastSubmission = getCurrentUserLastSubmission(problem.getId());

        // Convert to detail DTO
        return problemDetailMapper.toDetailDto(problem, lastSubmission, preferredLanguage);
    }

    /**
     * Get current authenticated user's last submission for a problem
     */
    private Submission getCurrentUserLastSubmission(Long problemId) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            
            // Skip if anonymous
            if ("anonymousUser".equals(username)) {
                return null;
            }

            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return null;
            }

            // Get user's submissions for this problem, ordered by submission time
            List<Submission> submissions = submissionRepository
                    .findByUserIdAndProblemIdOrderBySubmittedAtDesc(user.getId(), problemId);

            return submissions.isEmpty() ? null : submissions.get(0);
        } catch (Exception e) {
            // If any error getting user/submissions, just return null
            return null;
        }
    }
}
