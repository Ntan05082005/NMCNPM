package com.Unicode.demo.repository;

import com.Unicode.demo.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long>, JpaSpecificationExecutor<Problem> {
    
    Optional<Problem> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    @Query("SELECT COUNT(DISTINCT p) FROM Problem p JOIN p.tags t WHERE t.slug = :tagSlug")
    long countByTagSlug(@Param("tagSlug") String tagSlug);
}
