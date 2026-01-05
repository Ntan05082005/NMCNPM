package com.Unicode.demo.controller;

import com.Unicode.demo.dto.TagDto;
import com.Unicode.demo.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    /**
     * Get all tags
     * 
     * Example: GET /api/tags
     */
    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        List<TagDto> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    /**
     * Get tag by slug
     * 
     * Example: GET /api/tags/array
     */
    @GetMapping("/{slug}")
    public ResponseEntity<TagDto> getTagBySlug(@PathVariable String slug) {
        TagDto tag = tagService.getTagBySlug(slug);
        return ResponseEntity.ok(tag);
    }
}
