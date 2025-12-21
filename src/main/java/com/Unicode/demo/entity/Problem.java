package com.Unicode.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "problems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false, length = 20)
    private String difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "acceptance_rate", precision = 5, scale = 2)
    private BigDecimal acceptanceRate = BigDecimal.ZERO;

    @Column(name = "total_submissions")
    private Integer totalSubmissions = 0;

    @Column(name = "total_accepted")
    private Integer totalAccepted = 0;

    @Column
    private Integer likes = 0;

    @Column
    private Integer dislikes = 0;

    @Column(name = "time_limit_ms")
    private Integer timeLimitMs = 2000;

    @Column(name = "memory_limit_mb")
    private Integer memoryLimitMb = 256;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    @Column(name = "sample_input", columnDefinition = "TEXT")
    private String sampleInput;

    @Column(name = "sample_output", columnDefinition = "TEXT")
    private String sampleOutput;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "learning_objectives", columnDefinition = "TEXT")
    private String learningObjectives;

    @Column(name = "example1_input", columnDefinition = "TEXT")
    private String example1Input;

    @Column(name = "example1_output", columnDefinition = "TEXT")
    private String example1Output;

    @Column(name = "example1_explanation", columnDefinition = "TEXT")
    private String example1Explanation;

    @Column(name = "example2_input", columnDefinition = "TEXT")
    private String example2Input;

    @Column(name = "example2_output", columnDefinition = "TEXT")
    private String example2Output;

    @Column(name = "example2_explanation", columnDefinition = "TEXT")
    private String example2Explanation;

    @Column(name = "is_premium")
    private Boolean isPremium = false;

    @Column(length = 50)
    private String category;

    @Column(name = "starter_code_cpp", columnDefinition = "TEXT")
    private String starterCodeCpp;

    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;

    @Column(name = "starter_code_javascript", columnDefinition = "TEXT")
    private String starterCodeJavascript;

    // Driver templates for LeetCode-style execution
    // These wrap user's solution function with input parsing and output formatting
    @Column(name = "driver_code_cpp", columnDefinition = "TEXT")
    private String driverCodeCpp;

    @Column(name = "driver_code_python", columnDefinition = "TEXT")
    private String driverCodePython;

    @Column(name = "driver_code_javascript", columnDefinition = "TEXT")
    private String driverCodeJavascript;

    @Column(name = "function_name")
    private String functionName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "problem_tags", joinColumns = @JoinColumn(name = "problem_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TestCase> testCases = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
