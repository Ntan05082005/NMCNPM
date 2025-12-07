package com.codingwebsite.backend.config;

import com.codingwebsite.backend.entity.Problem;
import com.codingwebsite.backend.entity.TestCase;
import com.codingwebsite.backend.repository.ProblemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initialize sample problems on application startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    public DataInitializer(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) {
        // Only initialize if no problems exist
        if (problemRepository.count() > 0) {
            return;
        }

        // Problem 1: Hello World
        Problem problem1 = new Problem(
                "Hello World",
                "Write a program that reads a string from input and prints it back.\n\n" +
                        "Example:\nInput: Hello World\nOutput: Hello World");
        problem1.addTestCase(new TestCase("Hello World", "Hello World"));
        problem1.addTestCase(new TestCase("Coding Website", "Coding Website"));
        problemRepository.save(problem1);

        // Problem 2: Sum of Two Numbers
        Problem problem2 = new Problem(
                "Sum of Two Numbers",
                "Read two integers from input (one per line) and print their sum.\n\n" +
                        "Example:\nInput:\n5\n3\nOutput: 8");
        problem2.addTestCase(new TestCase("5\n3", "8"));
        problem2.addTestCase(new TestCase("10\n20", "30"));
        problem2.addTestCase(new TestCase("-5\n5", "0"));
        problemRepository.save(problem2);

        // Problem 3: Reverse String
        Problem problem3 = new Problem(
                "Reverse String",
                "Read a string from input and print it reversed.\n\n" +
                        "Example:\nInput: hello\nOutput: olleh");
        problem3.addTestCase(new TestCase("hello", "olleh"));
        problem3.addTestCase(new TestCase("coding", "gnidoc"));
        problem3.addTestCase(new TestCase("a", "a"));
        problemRepository.save(problem3);

        System.out.println("✅ Initialized 3 sample problems");
    }
}
