package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.repository.usercv.AnalysisResultForUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCvAnalysisService {

    private final UserSubscriptionService subscriptionService;
    private final UserCvScoringService scoringService;
    private final UserResumeParserService resumeParserService;       // <--- NEW
    private final UserJobDescriptionParserService jdParserService;   // <--- NEW
    private final AnalysisResultForUserRepository resultRepo;
    private final ObjectMapper objectMapper;

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

        // 4. Apply Subscription Limits (Locking advanced data for Free/Starter users)
        subscriptionService.filterResponseByPlan(response, userPlan);

        // 5. Save Results to Database for History
        try {
            AnalysisResultForUser entity = new AnalysisResultForUser();
            entity.setUser(user);
            entity.setTotalScore(response.getTotalScore());
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
}