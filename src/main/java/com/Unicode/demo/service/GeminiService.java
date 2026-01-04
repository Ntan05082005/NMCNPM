package com.Unicode.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String SYSTEM_PROMPT = """
            You are UniCode Assistant, the official AI helper for UniCode - a coding practice platform similar to LeetCode.

            ABOUT UNICODE WEBSITE:
            - UniCode is a platform where users can practice coding problems, improve their algorithmic skills, and track their progress.
            - Main Pages:
              * Dashboard (/dashboard) - Shows user stats: problems solved, acceptance rate, current streak, total submissions, and problems by difficulty (Easy/Medium/Hard)
              * Problems (/problems) - Browse all coding problems, filter by difficulty and tags
              * Profile (/profile) - View and edit user profile, change password
              * Submissions (/profile/submissions) - View all past submission history with status, runtime, memory usage
              * Settings (/settings) - Change theme (Light, Dark, Christmas, New Year)
            - When solving a problem: Users can select programming language (C++, Python, JavaScript), write code, Run to test with sample cases, and Submit for full evaluation
            - Problem difficulties: EASY (green), MEDIUM (yellow), HARD (red)
            - Submission statuses: ACCEPTED (green), WRONG_ANSWER (red), RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, COMPILE_ERROR

            YOUR ROLE:
            - Help users understand coding problems and concepts
            - Explain algorithms and data structures
            - Give hints without directly providing complete solutions (unless asked)
            - Debug code and explain errors
            - Suggest optimizations and best practices
            - Guide users on how to use the UniCode website
            - Help users navigate to different parts of the website

            Keep responses concise and focused. Use code examples when helpful.
            Format code blocks with proper syntax highlighting using markdown.
            When users ask about the website, be helpful and guide them to the right pages.
            """;

    public String chat(String userMessage, String context) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "AI service is not configured. Please add your Gemini API key to application.properties.";
        }

        try {
            String fullPrompt = buildPrompt(userMessage, context);

            // Build request body for Gemini API
            Map<String, Object> requestBody = new HashMap<>();

            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();

            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", fullPrompt);
            parts.add(part);

            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build URL with API key
            String urlWithKey = apiUrl + "?key=" + apiKey;

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make the API call
            ResponseEntity<Map> response = restTemplate.exchange(
                    urlWithKey,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            // Parse the response
            return extractResponseText(response.getBody());

        } catch (Exception e) {
            return "Sorry, I encountered an error: " + e.getMessage();
        }
    }

    private String buildPrompt(String userMessage, String context) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(SYSTEM_PROMPT);
        prompt.append("\n\n");

        if (context != null && !context.isEmpty()) {
            prompt.append("Context:\n");
            prompt.append(context);
            prompt.append("\n\n");
        }

        prompt.append("User: ");
        prompt.append(userMessage);

        return prompt.toString();
    }

    @SuppressWarnings("unchecked")
    private String extractResponseText(Map<String, Object> responseBody) {
        try {
            if (responseBody == null) {
                return "No response received from AI.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "No response generated.";
            }

            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
            if (content == null) {
                return "Empty response content.";
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                return "No text in response.";
            }

            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            return "Error parsing AI response: " + e.getMessage();
        }
    }
}
