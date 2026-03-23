package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.repository.usercv.AnalysisResultForUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Collections;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
@RequiredArgsConstructor
public class UserCvAnalysisService {

    private final UserSubscriptionService subscriptionService;
    private final UserCvScoringService scoringService;
    private final UserResumeParserService resumeParserService;       // <--- NEW
    private final UserJobDescriptionParserService jdParserService;   // <--- NEW
    private final AnalysisResultForUserRepository resultRepo;
    private final ObjectMapper objectMapper;

    public AnalysisResponseDTOUserCv getHistoryDetails(Long analysisId) {
        AnalysisResultForUser entity = resultRepo.findById(analysisId)
                .orElseThrow(() -> new RuntimeException("Analysis report not found."));

        try {
            return AnalysisResponseDTOUserCv.builder()
                    .totalScore(entity.getTotalScore())
                    .sectionScores(objectMapper.readValue(entity.getScoreBreakdowns(), new TypeReference<List<ScoreBreakdownDTOUserCv>>() {}))
                    .matchedKeywords(objectMapper.readValue(entity.getMatchedKeywords(), new TypeReference<List<String>>() {}))
                    .missingKeywords(objectMapper.readValue(entity.getMissingKeywords(), new TypeReference<List<String>>() {}))
                    .suggestions(objectMapper.readValue(entity.getSuggestions(), new TypeReference<List<String>>() {}))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to decode historical report: " + e.getMessage());
        }
    }

    public AnalysisResponseDTOUserCv analyzeUserCv(UserForCv user, UploadRequestDTOUserCv request) {
        
        // 1. Check and Deduct Credits (Throws error if insufficient)
        SubscriptionForUser.PlanType userPlan = subscriptionService.deductAnalysisCredit(user);

        // 2. ACTUAL PARSING USING GEMINI
        ParsedResumeDTO parsedResume = resumeParserService.parseResume(request.getResumeText());
        ParsedJdDTO parsedJd = jdParserService.parseJd(request.getJdText(), request.getTargetDomain());
        
        // 3. Score the CV (Using the parsed data)
        AnalysisResponseDTOUserCv response = scoringService.calculateScore(
                parsedResume.getTechnicalSkills(), 
                parsedJd.getRequiredSkills(), 
                parsedResume.getTotalYearsExperience(), 
                parsedJd.getMinYearsExperience(), 
                parsedResume.getProjectCount(), 
                parsedResume.isHasCertifications()
        );

        // 4. Apply Subscription Limits
        subscriptionService.filterResponseByPlan(response, userPlan);

        // 5. Map Raw Segments for Rewriting
        response.setRawSummary(parsedResume.getRawSummary());
        response.setRawExperience(parsedResume.getRawExperience());
        response.setRawProjects(parsedResume.getRawProjects());

        // 6. Save Results to Database
        try {
            AnalysisResultForUser entity = new AnalysisResultForUser();
            entity.setUser(user);
            entity.setTotalScore(response.getTotalScore());
            entity.setTargetDomain(request.getTargetDomain()); // Store the Job Title
            entity.setResumeFileName(request.getResumeFileName()); // Store original filename
            entity.setScoreBreakdowns(objectMapper.writeValueAsString(response.getSectionScores()));
            entity.setMatchedKeywords(objectMapper.writeValueAsString(response.getMatchedKeywords()));
            
            // Only save if not null (pro plans)
            entity.setMissingKeywords(response.getMissingKeywords() != null 
                    ? objectMapper.writeValueAsString(response.getMissingKeywords()) : "[]");
            entity.setSuggestions(response.getSuggestions() != null 
                    ? objectMapper.writeValueAsString(response.getSuggestions()) : "[]");
                    
            resultRepo.save(entity);
        } catch (Exception e) {
            System.err.println("Failed to save analysis history: " + e.getMessage());
        }

        return response;
    }

    public java.util.Set<String> getAvailableDomains() {
        java.util.Set<String> domains = new java.util.HashSet<>();
        
        // 1. From File System (job_descriptions folder)
        java.io.File folder = new java.io.File("job_descriptions");
        if (folder.exists() && folder.isDirectory()) {
            java.io.File[] files = folder.listFiles((dir, name) -> 
                name.endsWith(".txt") || name.endsWith(".pdf") || name.endsWith(".docx"));
            if (files != null) {
                for (java.io.File file : files) {
                    String name = file.getName();
                    name = name.replace(".txt", "").replace(".pdf", "").replace(".docx", "");
                    
                    String formattedName = java.util.Arrays.stream(name.split("_"))
                            .map(word -> word.isEmpty() ? "" : word.substring(0, 1).toUpperCase() + word.substring(1))
                            .collect(java.util.stream.Collectors.joining(" "));
                    domains.add(formattedName);
                }
            }
        }

        // 2. Default set if empty
        if (domains.isEmpty()) {
            domains.add("Software Engineer");
            domains.add("Backend Developer");
            domains.add("Frontend Developer");
            domains.add("Data Analyst");
            domains.add("Product Manager");
            domains.add("UI/UX Designer");
        }

        return domains;
    }
}