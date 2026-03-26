package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.RewriteRequestDTO;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.SubscriptionForUser;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.UserForCv;
import com.resumeshortlist.resume_shortlist_backend.repository.usercv.SubscriptionForUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserCvRewriteService {

    private final Client geminiClient;
    private final SubscriptionForUserRepository subRepo;

    public String improveSection(UserForCv user, RewriteRequestDTO request) {
        SubscriptionForUser sub = user.getSubscription();
        
        // 1. Tier Check
        if (sub.getPlanType() == SubscriptionForUser.PlanType.FREE) {
            throw new RuntimeException("AI Rewrites are exclusive to the PRO plan. Please upgrade.");
        }

        // 2. Credit Usage Tracking
        sub.setSectionImprovementsUsed(sub.getSectionImprovementsUsed() + 1);
        subRepo.save(sub);

        // 3. AI Generation
        GenerateContentConfig config = GenerateContentConfig.builder()
                .temperature(0.7f) // Creative yet professional
                .build();

        String prompt = String.format(
            "You are a professional resume writer. Rewrite the following '%s' section of a resume to be more impactful, ATS-friendly, and professional.\n" +
            "JD CONTEXT: %s\n" +
            "ORIGINAL TEXT: %s\n" +
            "GOAL: Use strong action verbs, quantify achievements where possible, and align with the Job Description provided. Return ONLY the improved text.",
            request.getCategory(), 
            request.getJdContext() != null ? request.getJdContext() : "None provided", 
            request.getOriginalText()
        );

        try {
            GenerateContentResponse response = geminiClient.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    config
            );
            return response.text().trim();
        } catch (Exception e) {
            throw new RuntimeException("AI Rewrite failed: " + e.getMessage());
        }
    }
}
