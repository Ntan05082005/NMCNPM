package com.Unicode.demo.mapper;

import com.Unicode.demo.dto.ProblemDto;
import com.Unicode.demo.dto.TagDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Tag;
import com.Unicode.demo.repository.SubmissionRepository;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProblemMapper {

    private final SubmissionRepository submissionRepository;

    public ProblemDto toDto(Problem problem) {
        return toDto(problem, null);
    }

    public ProblemDto toDto(Problem problem, Long userId) {
        if (problem == null) {
            return null;
        }

        ProblemDto dto = new ProblemDto();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setSlug(problem.getSlug());
        dto.setDifficulty(problem.getDifficulty());
        
        // Check if user has solved this problem
        if (userId != null && submissionRepository.hasUserSolvedProblem(userId, problem.getId())) {
            dto.setStatus("Solved");
        } else {
            dto.setStatus("Unsolved");
        }
        
        dto.setDescription(problem.getDescription());
        dto.setAcceptanceRate(problem.getAcceptanceRate());
        dto.setTotalSubmissions(problem.getTotalSubmissions());
        dto.setTotalAccepted(problem.getTotalAccepted());
        dto.setLikes(problem.getLikes());
        dto.setDislikes(problem.getDislikes());
        dto.setTimeLimitMs(problem.getTimeLimitMs());
        dto.setMemoryLimitMb(problem.getMemoryLimitMb());
        dto.setConstraints(problem.getConstraints());
        dto.setInputFormat(problem.getInputFormat());
        dto.setOutputFormat(problem.getOutputFormat());
        dto.setSampleInput(problem.getSampleInput());
        dto.setSampleOutput(problem.getSampleOutput());
        dto.setExplanation(problem.getExplanation());
        dto.setSummary(problem.getSummary());
        dto.setLearningObjectives(problem.getLearningObjectives());
        dto.setExample1Input(problem.getExample1Input());
        dto.setExample1Output(problem.getExample1Output());
        dto.setExample1Explanation(problem.getExample1Explanation());
        dto.setExample2Input(problem.getExample2Input());
        dto.setExample2Output(problem.getExample2Output());
        dto.setExample2Explanation(problem.getExample2Explanation());
        dto.setIsPremium(problem.getIsPremium());
        dto.setCategory(problem.getCategory());
        dto.setStarterCodeCpp(problem.getStarterCodeCpp());
        dto.setStarterCodePython(problem.getStarterCodePython());
        dto.setStarterCodeJavascript(problem.getStarterCodeJavascript());
        dto.setCreatedAt(problem.getCreatedAt());
        dto.setUpdatedAt(problem.getUpdatedAt());

        // Map tags
        if (problem.getTags() != null) {
            dto.setTags(problem.getTags().stream()
                    .map(this::tagToDto)
                    .collect(Collectors.toSet()));
        }

        // Map author
        if (problem.getAuthor() != null) {
            dto.setAuthorUsername(problem.getAuthor().getUsername());
        }

        return dto;
    }

    public TagDto tagToDto(Tag tag) {
        if (tag == null) {
            return null;
        }

        TagDto dto = new TagDto();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());
        dto.setDescription(tag.getDescription());
        return dto;
    }
}
