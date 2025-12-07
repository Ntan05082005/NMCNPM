package com.codingwebsite.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Problem entity representing a coding challenge
 */
@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCase> testCases = new ArrayList<>();

    public Problem() {
    }

    public Problem(String title, String description) {
        this.title = title;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TestCase> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCase> testCases) {
        this.testCases = testCases;
    }

    public void addTestCase(TestCase testCase) {
        testCases.add(testCase);
        testCase.setProblem(this);
    }
}
