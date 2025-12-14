package com.Unicode.demo.mapper;

import com.Unicode.demo.dto.ProblemDetailDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Submission;
import com.Unicode.demo.enums.SubmissionStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting Problem entity to ProblemDetailDto
 * This format is specifically designed for the coding interface
 */
@Component
public class ProblemDetailMapper {

    /**
     * Convert Problem to ProblemDetailDto with optional last submission
     */
    public ProblemDetailDto toDetailDto(Problem problem, Submission lastSubmission, String preferredLanguage) {
        if (problem == null) {
            return null;
        }

        // Build examples list
        List<ProblemDetailDto.ExampleDto> examples = buildExamples(problem);

        // Parse constraints
        List<String> constraints = parseConstraints(problem.getConstraints());

        // Get default code based on preferred language
        ProblemDetailDto.DefaultCodeDto defaultCode = getDefaultCode(problem, preferredLanguage);

        // Build submission status from last submission
        ProblemDetailDto.SubmissionStatusDto submissionStatus = buildSubmissionStatus(lastSubmission);

        // Format time limit
        String timeLimit = formatTimeLimit(problem.getTimeLimitMs());

        return ProblemDetailDto.builder()
                .id(String.valueOf(problem.getId()))
                .slug(problem.getSlug())
                .title(problem.getTitle())
                .category(problem.getCategory() != null ? problem.getCategory() : "Programming")
                .timeLimit(timeLimit)
                .description(problem.getDescription())
                .examples(examples)
                .constraints(constraints)
                .defaultCode(defaultCode)
                .submissionStatus(submissionStatus)
                .build();
    }

    /**
     * Overload without last submission
     */
    public ProblemDetailDto toDetailDto(Problem problem, String preferredLanguage) {
        return toDetailDto(problem, null, preferredLanguage);
    }

    /**
     * Build examples list from problem entity
     */
    private List<ProblemDetailDto.ExampleDto> buildExamples(Problem problem) {
        List<ProblemDetailDto.ExampleDto> examples = new ArrayList<>();

        // Add example 1 if exists
        if (problem.getExample1Input() != null) {
            examples.add(ProblemDetailDto.ExampleDto.builder()
                    .id(1)
                    .input(problem.getExample1Input())
                    .output(problem.getExample1Output())
                    .explanation(problem.getExample1Explanation())
                    .build());
        }

        // Add example 2 if exists
        if (problem.getExample2Input() != null) {
            examples.add(ProblemDetailDto.ExampleDto.builder()
                    .id(2)
                    .input(problem.getExample2Input())
                    .output(problem.getExample2Output())
                    .explanation(problem.getExample2Explanation())
                    .build());
        }

        return examples;
    }

    /**
     * Parse constraints string into list
     */
    private List<String> parseConstraints(String constraintsStr) {
        if (constraintsStr == null || constraintsStr.trim().isEmpty()) {
            return new ArrayList<>();
        }

        // Split by newline or bullet points
        return Arrays.stream(constraintsStr.split("[\\n•-]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Get default/starter code based on language
     */
    private ProblemDetailDto.DefaultCodeDto getDefaultCode(Problem problem, String language) {
        String code = "";
        String lang = "C++"; // Default

        if (language != null) {
            switch (language.toLowerCase()) {
                case "python", "py":
                    lang = "Python";
                    code = problem.getStarterCodePython() != null ? problem.getStarterCodePython() : getDefaultPythonCode(problem);
                    break;
                case "javascript", "js":
                    lang = "JavaScript";
                    code = problem.getStarterCodeJavascript() != null ? problem.getStarterCodeJavascript() : getDefaultJavaScriptCode(problem);
                    break;
                case "cpp", "c++":
                default:
                    lang = "C++";
                    code = problem.getStarterCodeCpp() != null ? problem.getStarterCodeCpp() : getDefaultCppCode(problem);
                    break;
            }
        } else {
            // Default to C++ if no preference
            lang = "C++";
            code = problem.getStarterCodeCpp() != null ? problem.getStarterCodeCpp() : getDefaultCppCode(problem);
        }

        return ProblemDetailDto.DefaultCodeDto.builder()
                .language(lang)
                .code(code)
                .build();
    }

    /**
     * Generate default C++ code template
     */
    private String getDefaultCppCode(Problem problem) {
        return "#include <iostream>\n#include <vector>\nusing namespace std;\n\n// TODO: Implement your solution here\n\nint main() {\n    // Write your code here\n    return 0;\n}";
    }

    /**
     * Generate default Python code template
     */
    private String getDefaultPythonCode(Problem problem) {
        return "# TODO: Implement your solution here\n\ndef solution():\n    pass\n\nif __name__ == '__main__':\n    # Write your code here\n    pass";
    }

    /**
     * Generate default JavaScript code template
     */
    private String getDefaultJavaScriptCode(Problem problem) {
        return "// TODO: Implement your solution here\n\nfunction solution() {\n    // Write your code here\n}\n\n// Test your solution\nconsole.log(solution());";
    }

    /**
     * Build submission status from last submission
     */
    private ProblemDetailDto.SubmissionStatusDto buildSubmissionStatus(Submission submission) {
        if (submission == null) {
            return null;
        }

        String errorType = null;
        String errorMessage = submission.getErrorMessage();

        if (submission.getStatus() != null) {
            switch (submission.getStatus()) {
                case COMPILATION_ERROR:
                    errorType = "compile";
                    break;
                case RUNTIME_ERROR:
                    errorType = "runtime";
                    break;
                case WRONG_ANSWER:
                    errorType = "wrong_answer";
                    break;
                case ACCEPTED:
                    errorType = "accepted";
                    errorMessage = null; // No error for accepted
                    break;
                case TIME_LIMIT_EXCEEDED:
                    errorType = "timeout";
                    break;
                default:
                    errorType = null;
            }
        }

        return ProblemDetailDto.SubmissionStatusDto.builder()
                .errorType(errorType)
                .errorMessage(errorMessage)
                .build();
    }

    /**
     * Format time limit from milliseconds to HH:MM:SS
     */
    private String formatTimeLimit(Integer timeLimitMs) {
        if (timeLimitMs == null) {
            return "00:05:00"; // Default 5 minutes
        }

        long seconds = timeLimitMs / 1000;
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long secs = seconds % 60;

        return String.format("%02d:%02d:%02d", hours, minutes, secs);
    }
}
