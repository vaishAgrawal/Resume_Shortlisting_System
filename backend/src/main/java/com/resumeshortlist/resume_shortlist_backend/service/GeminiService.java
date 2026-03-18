package com.resumeshortlist.resume_shortlist_backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeshortlist.resume_shortlist_backend.dto.AnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private final Client geminiClient;
    private final ObjectMapper objectMapper;

    public AnalysisResponse analyzeResume(String resumeText, String jobDescription) {
        System.out.println("GeminiService: Sending request to Gemini...");
        System.out.println("GeminiService: Job Description length: " + (jobDescription != null ? jobDescription.length() : "NULL"));
        System.out.println("GeminiService: Resume Text length: " + (resumeText != null ? resumeText.length() : "NULL"));

        String prompt = String.format(
            "Analyze the following resume against the job description provided. " +
            "Return the analysis as a JSON object matching the scoring criteria and schema below.\n\n" +
            "### Job Description:\n%s\n\n" +
            "### Resume Text:\n%s\n\n" +
            "### Scoring Criteria:\n" +
            "1. Resume Format & Presentation (Total: 15)\n" +
            "   - Clean layout & structure (5)\n" +
            "   - Proper headings (3)\n" +
            "   - Consistent fonts, spacing, alignment (3)\n" +
            "   - Professional formatting (4)\n" +
            "2. Contact & Basic Information (Total: 5)\n" +
            "   - Full name, phone, email (3)\n" +
            "   - LinkedIn / Portfolio / GitHub link (2)\n" +
            "3. Resume Summary / Objective (Total: 10)\n" +
            "   - Clear objective or professional summary (5)\n" +
            "   - Relevant to job role (3)\n" +
            "   - Short & meaningful (2)\n" +
            "4. Skills Section (Total: 15)\n" +
            "   - Relevant technical skills (7)\n" +
            "   - Relevant soft skills (3)\n" +
            "   - Categorized (Tech / Tools / Soft skills) (3)\n" +
            "   - No irrelevant or spam skills (2)\n" +
            "5. Experience Section (Total: 20)\n" +
            "   - Job titles + company names (5)\n" +
            "   - Proper timeline (3)\n" +
            "   - Clear descriptions of responsibilities (5)\n" +
            "   - Achievements using numbers (5)\n" +
            "   - Relevance to job (2)\n" +
            "6. Projects Section (Total: 15)\n" +
            "   - At least 2 technical or relevant projects (5)\n" +
            "   - Project description is clear (3)\n" +
            "   - Responsibilities + tools used mentioned (5)\n" +
            "   - Live link / GitHub link provided (2)\n" +
            "7. Education Section (Total: 10)\n" +
            "   - Degree + college name (4)\n" +
            "   - Passing year (2)\n" +
            "   - Score/CGPA (1)\n" +
            "   - Relevant courses (3)\n" +
            "8. Certifications / Trainings (Total: 5)\n" +
            "   - Relevant certifications (3)\n" +
            "   - Verified certificate links (2)\n" +
            "9. Additional Sections (Total: 3)\n" +
            "   - Awards / Achievements (1)\n" +
            "   - Volunteering / Extra activities (1)\n" +
            "   - Languages or Interests (1)\n" +
            "10. Grammar, Spelling & Professional Tone (Total: 2)\n" +
            "   - No spelling mistakes (1)\n" +
            "   - Professional writing tone (1)\n\n" +
            "### JSON Format Requirement:\n" +
            "{\n" +
            "  \"overallScore\": number,\n" +
            "  \"professionalSummary\": \"string\",\n" +
            "  \"breakdown\": [\n" +
            "    { \"category\": \"string\", \"score\": number, \"total\": number, \"feedback\": \"string\", \"subCategories\": { \"name\": number } }\n" +
            "  ],\n" +
            "  \"details\": { \"name\": \"string\", \"email\": \"string\", \"phone\": \"string\", \"linkedin\": \"string\" },\n" +
            "  \"education\": [\n" +
            "    { \"degree\": \"string\", \"institution\": \"string\", \"fieldOfStudy\": \"string\", \"startYear\": number, \"endYear\": number, \"gpa\": number }\n" +
            "  ],\n" +
            "  \"experience\": [\n" +
            "    { \"jobTitle\": \"string\", \"company\": \"string\", \"description\": \"string\", \"startDate\": \"string\", \"endDate\": \"string\", \"isCurrent\": boolean }\n" +
            "  ],\n" +
            "  \"projects\": [\n" +
            "    { \"title\": \"string\", \"description\": \"string\", \"tools\": \"string\", \"url\": \"string\" }\n" +
            "  ],\n" +
            "  \"extractedSkills\": [\"string\"]\n" +
            "}\n",
            jobDescription, resumeText
        );

        try {
            System.out.println("GeminiService: Calling generateContent...");
            GenerateContentResponse response = geminiClient.models.generateContent("gemini-2.5-flash", prompt, null);
            String jsonResponse = response.text();
            System.out.println("GeminiService: Raw response received. Length: " + (jsonResponse != null ? jsonResponse.length() : "NULL"));
            
            if (jsonResponse == null || jsonResponse.isBlank()) {
                throw new RuntimeException("Gemini returned an empty response");
            }

            if (jsonResponse.contains("```json")) {
                jsonResponse = jsonResponse.substring(jsonResponse.indexOf("```json") + 7);
                jsonResponse = jsonResponse.substring(0, jsonResponse.lastIndexOf("```"));
            } else if (jsonResponse.contains("```")) {
                jsonResponse = jsonResponse.substring(jsonResponse.indexOf("```") + 3);
                jsonResponse = jsonResponse.substring(0, jsonResponse.lastIndexOf("```"));
            }

            System.out.println("GeminiService: Extracted JSON: " + jsonResponse);
            return objectMapper.readValue(jsonResponse, AnalysisResponse.class);
        } catch (Exception e) {
            System.err.println("GeminiService ERROR: " + e.getMessage());
            e.printStackTrace();
            logger.error("Error analyzing resume with Gemini: ", e);
            throw new RuntimeException("Failed to analyze resume: " + e.getMessage(), e);
        }
    }
}
