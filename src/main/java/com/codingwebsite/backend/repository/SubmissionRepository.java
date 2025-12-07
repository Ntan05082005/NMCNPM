package com.codingwebsite.backend.repository;

import com.codingwebsite.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    List<Submission> findByProblemIdOrderBySubmittedAtDesc(Long problemId);
}
