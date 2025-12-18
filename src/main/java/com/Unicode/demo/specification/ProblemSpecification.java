package com.Unicode.demo.specification;

import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Tag;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProblemSpecification {

    public static Specification<Problem> withFilters(
            List<String> difficulties,
            List<String> tagSlugs,
            String search,
            Boolean isPremium
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by difficulty
            if (difficulties != null && !difficulties.isEmpty()) {
                predicates.add(root.get("difficulty").in(difficulties));
            }

            // Filter by tags - TEMPORARILY DISABLED to fix ConcurrentModificationException
            // TODO: Fix tag filtering with proper implementation
            if (tagSlugs != null && !tagSlugs.isEmpty()) {
                // TEMPORARILY COMMENTED OUT - causing ConcurrentModificationException
                Join<Problem, Tag> tagJoin = root.join("tags", JoinType.INNER);
                predicates.add(tagJoin.get("slug").in(tagSlugs));
                System.out.println("⚠️  Tag filtering temporarily disabled");
            }

            // Search in title or description
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    searchPattern
                );
                Predicate descriptionMatch = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")),
                    searchPattern
                );
                predicates.add(criteriaBuilder.or(titleMatch, descriptionMatch));
            }

            // Filter by premium status
            if (isPremium != null) {
                predicates.add(criteriaBuilder.equal(root.get("isPremium"), isPremium));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
