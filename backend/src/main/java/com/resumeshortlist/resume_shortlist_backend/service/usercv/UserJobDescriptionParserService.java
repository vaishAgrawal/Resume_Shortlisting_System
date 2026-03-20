package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.ParsedJdDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserJobDescriptionParserService {

    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    public ParsedJdDTO parseJd(String jdText, String targetDomain) {
        
        // IF USER DID NOT UPLOAD A JD, USE A FALLBACK BASED ON DOMAIN
        if (jdText == null || jdText.trim().isEmpty()) {
            return generateFallbackJd(targetDomain);
        }

        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseMimeType("application/json")
                .temperature(0.0f)
                .build();

        String prompt = "You are an expert ATS system. Extract the core requirements from this Job Description into STRICT JSON.\n" +
                "JSON Structure MUST be exactly:\n" +
                "{\n" +
                "  \"requiredSkills\": [\"skill1\", \"skill2\"],\n" +
                "  \"minYearsExperience\": (integer, minimum years required. If not stated, return 0)\n" +
                "}\n\n" +
                "JOB DESCRIPTION TEXT:\n" + jdText;

        try {
            GenerateContentResponse response = geminiClient.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    config
            );

            String rawJson = response.text().replaceAll("(?i)^\\s*```json\\s*", "")
                    .replaceAll("\\s*```\\s*$", "")
                    .trim();

            return objectMapper.readValue(rawJson, ParsedJdDTO.class);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Job Description: " + e.getMessage());
        }
    }

    // Fallback if the user just selects "Software Engineer" but doesn't have a specific JD to upload
    private ParsedJdDTO generateFallbackJd(String domain) {
        ParsedJdDTO defaultJd = new ParsedJdDTO();
        defaultJd.setMinYearsExperience(2); // Assume 2 years for standard ATS check

        if (domain != null && domain.toLowerCase().contains("data")) {
            defaultJd.setRequiredSkills(List.of("Python", "SQL", "Machine Learning", "Data Analysis", "Tableau"));
        } else if (domain != null && domain.toLowerCase().contains("frontend")) {
            defaultJd.setRequiredSkills(List.of("JavaScript", "React", "HTML", "CSS", "TypeScript"));
        } else {
            // Generic Developer
            defaultJd.setRequiredSkills(List.of("Java", "Spring Boot", "SQL", "REST APIs", "Git"));
        }
        return defaultJd;
    }
}