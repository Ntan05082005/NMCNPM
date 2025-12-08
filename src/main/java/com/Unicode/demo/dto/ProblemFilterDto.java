package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemFilterDto {
    private List<String> difficulty;  // ["EASY", "MEDIUM", "HARD"]
    private List<String> tags;         // ["array", "string"]
    private String search;             // Search in title or description
    private Boolean isPremium;
    private String sortBy = "createdAt"; // "createdAt", "likes", "acceptanceRate", "difficulty"
    private String sortDirection = "DESC"; // "ASC" or "DESC"
}
