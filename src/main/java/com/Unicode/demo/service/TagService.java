package com.Unicode.demo.service;

import com.Unicode.demo.dto.TagDto;
import com.Unicode.demo.entity.Tag;
import com.Unicode.demo.mapper.ProblemMapper;
import com.Unicode.demo.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;
    private final ProblemMapper problemMapper;

    public List<TagDto> getAllTags() {
        return tagRepository.findAll().stream()
                .map(problemMapper::tagToDto)
                .collect(Collectors.toList());
    }

    public TagDto getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Tag not found with slug: " + slug));
        return problemMapper.tagToDto(tag);
    }
}
