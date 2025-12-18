package com.Unicode.demo.repository;

import com.Unicode.demo.entity.Submission;
import com.Unicode.demo.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long>, JpaSpecificationExecutor<Submission> {

    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    List<Submission> findByProblemIdOrderBySubmittedAtDesc(Long problemId);

    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);

    // Count total submissions by user
    Long countByUserId(Long userId);

    // Count submissions by user and status
    Long countByUserIdAndStatus(Long userId, SubmissionStatus status);

    // Count distinct problems attempted by user
    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId")
    Long countDistinctProblemsAttemptedByUserId(@Param("userId") Long userId);

    // Count distinct problems solved (at least one ACCEPTED) by user
    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    Long countDistinctProblemsSolvedByUserId(@Param("userId") Long userId);

    // Count problems solved by difficulty
    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED' AND s.problem.difficulty = :difficulty")
    Long countDistinctProblemsSolvedByUserIdAndDifficulty(@Param("userId") Long userId,
            @Param("difficulty") String difficulty);
}
