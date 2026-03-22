package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.resumeshortlist.resume_shortlist_backend.dto.usercv.ResumeTemplateDTO;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.SubscriptionForUser;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.UserForCv;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserCvTemplateService {

    private final List<ResumeTemplateDTO> templates = new ArrayList<>();

    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("DEBUG: UserCvTemplateService Initializing...");
        // 1. BASIC TEMPLATE (Free)
        templates.add(new ResumeTemplateDTO("classic-01", "The Classic", "A clean, standard professional layout.", "/templates/classic-01.png", "BASIC", false));
        
        // 2. PREMIUM TEMPLATES (Pro)
        templates.add(new ResumeTemplateDTO("modern-violet", "Modern Violet", "Vibrant colors for creative roles.", "/templates/modern-violet.png", "PREMIUM", true));
        templates.add(new ResumeTemplateDTO("executive-dark", "Executive Edge", "Monochrome and bold for leadership roles.", "/templates/executive-dark.png", "PREMIUM", true));
        templates.add(new ResumeTemplateDTO("glass-it", "Glass-morphic IT", "A tech-focused layout with transparency effects.", "/templates/glass-it.png", "PREMIUM", true));
        templates.add(new ResumeTemplateDTO("minimalist-gray", "Minimalist Slate", "Clean lines and high readability.", "/templates/minimalist-gray.png", "PREMIUM", true));
        templates.add(new ResumeTemplateDTO("compact-blue", "Compact Efficiency", "Great for those with many years of experience.", "/templates/compact-blue.png", "PREMIUM", true));
        System.out.println("DEBUG: UserCvTemplateService Init Complete. Size: " + templates.size());
    }

    public List<ResumeTemplateDTO> getAvailableTemplates(UserForCv user) {
        System.out.println("DEBUG: Fetching templates for user: " + user.getEmail() + ". Master list size: " + templates.size());
        
        // 1. Determine Plan (Safely)
        String userPlan = "FREE";
        if (user.getSubscription() != null) {
            userPlan = user.getSubscription().getPlanType().name();
        }

        // 2. Load Unlocked IDs
        String rawIds = user.getUnlockedTemplateIds() != null ? user.getUnlockedTemplateIds() : "";
        Set<String> unlockedIds = Arrays.stream(rawIds.split(","))
                .filter(id -> !id.isEmpty())
                .collect(Collectors.toSet());

        final String finalUserPlan = userPlan; 
        return templates.stream().map(t -> {
            boolean isLocked = true;
            
            // Logic: Is it available for this user?
            if (t.getTier().equals("BASIC") || finalUserPlan.equals("PRO") || unlockedIds.contains(t.getId())) {
                isLocked = false;
            }

            return new ResumeTemplateDTO(
                t.getId(), 
                t.getName(), 
                t.getDescription(), 
                t.getPreviewImageUrl(), 
                t.getTier(), 
                isLocked
            );
        }).collect(Collectors.toList());
    }
}
