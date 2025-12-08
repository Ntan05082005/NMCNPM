package com.Unicode.demo.mapper;

import com.Unicode.demo.dto.ProblemDto;
import com.Unicode.demo.dto.TagDto;
import com.Unicode.demo.entity.Problem;
import com.Unicode.demo.entity.Tag;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProblemMapper {

    public ProblemDto toDto(Problem problem) {
        if (problem == null) {
            return null;
        }

        ProblemDto dto = new ProblemDto();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setSlug(problem.getSlug());
        dto.setDifficulty(problem.getDifficulty());
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
        dto.setIsPremium(problem.getIsPremium());
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
