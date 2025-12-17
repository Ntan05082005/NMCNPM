package com.Unicode.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Summary DTO for a problem (lightweight version for stats)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemSummaryDto {

    private Long id;
    private String title;
    private String slug;
    private String difficulty;
    private String category;
}
