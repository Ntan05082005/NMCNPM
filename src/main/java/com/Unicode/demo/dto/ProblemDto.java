package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDto {
    private Long id;
    private String title;
    private String slug;
    private String difficulty;
    private String status; // "Solved" or "Unsolved" - calculated based on user submissions
    private String description;
    private BigDecimal acceptanceRate;
    private Integer totalSubmissions;
    private Integer totalAccepted;
    private Integer likes;
    private Integer dislikes;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private String sampleInput;
    private String sampleOutput;
    private String explanation;
    private String summary;
    private String learningObjectives;
    private String example1Input;
    private String example1Output;
    private String example1Explanation;
    private String example2Input;
    private String example2Output;
    private String example2Explanation;
    private Boolean isPremium;
    private Set<TagDto> tags;
    private String authorUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
