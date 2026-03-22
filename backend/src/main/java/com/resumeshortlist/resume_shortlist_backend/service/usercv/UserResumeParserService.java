package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.ParsedResumeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserResumeParserService {

    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    public ParsedResumeDTO parseResume(String resumeText) {
        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseMimeType("application/json")
                .temperature(0.0f)
                .build();

        String prompt = "You are an expert ATS system. Extract the following information from the resume text into STRICT JSON.\n" +
                "JSON Structure MUST be exactly:\n" +
                "{\n" +
                "  \"technicalSkills\": [\"skill1\", \"skill2\"],\n" +
                "  \"totalYearsExperience\": (integer),\n" +
                "  \"projectCount\": (integer),\n" +
                "  \"hasCertifications\": (boolean),\n" +
                "  \"rawSummary\": \"(the professional summary text if present, else empty string)\",\n" +
                "  \"rawExperience\": [\"raw job 1 description\", \"raw job 2 description\"],\n" +
                "  \"rawProjects\": [\"raw project 1 description\", \"raw project 2 description\"]\n" +
                "}\n\n" +
                "RESUME TEXT:\n" + resumeText;

        try {
            GenerateContentResponse response = geminiClient.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    config
            );

            // Clean Markdown wrapping if Gemini returns ```json ... ```
            String rawJson = response.text().replaceAll("(?i)^\\s*```json\\s*", "")
                    .replaceAll("\\s*```\\s*$", "")
                    .trim();

            return objectMapper.readValue(rawJson, ParsedResumeDTO.class);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse User Resume: " + e.getMessage());
        }
    }
}