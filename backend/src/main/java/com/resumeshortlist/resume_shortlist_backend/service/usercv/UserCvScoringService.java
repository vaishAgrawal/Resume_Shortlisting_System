package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.resumeshortlist.resume_shortlist_backend.dto.usercv.AnalysisResponseDTOUserCv;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.ScoreBreakdownDTOUserCv;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCvScoringService {

    public AnalysisResponseDTOUserCv calculateScore(List<String> resumeSkills, List<String> jdSkills, int yearsExp, int requiredExp, int projectCount, boolean hasCertifications) {
        List<ScoreBreakdownDTOUserCv> breakdowns = new ArrayList<>();
        int totalScore = 0;

        // SMART CASE-INSENSITIVE KEYWORD MATCHING
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        
        // Null checks and lowercase formatting
        List<String> safeResumeSkills = resumeSkills == null ? new ArrayList<>() : resumeSkills;
        List<String> safeJdSkills = jdSkills == null ? new ArrayList<>() : jdSkills;

        List<String> resumeSkillsLower = safeResumeSkills.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toList());

        for (String reqSkill : safeJdSkills) {
            if (reqSkill == null || reqSkill.isBlank()) continue;
            
            if (resumeSkillsLower.contains(reqSkill.toLowerCase().trim())) {
                matched.add(reqSkill); // Keep original casing for display
            } else {
                missing.add(reqSkill);
            }
        }

        // 1. Skills Match (40 marks)
        int skillScore = safeJdSkills.isEmpty() ? 0 : (int) (((double) matched.size() / safeJdSkills.size()) * 40);
        totalScore += skillScore;
        breakdowns.add(new ScoreBreakdownDTOUserCv("Skills Match", skillScore, 40));

        // 2. Experience Match (20 marks)
        int expScore = (yearsExp >= requiredExp) ? 20 : (requiredExp == 0 ? 20 : (int) (((double) yearsExp / requiredExp) * 20));
        totalScore += expScore;
        breakdowns.add(new ScoreBreakdownDTOUserCv("Experience", expScore, 20));

        // 3. Education Match (10 marks)
        int eduScore = 10; 
        totalScore += eduScore;
        breakdowns.add(new ScoreBreakdownDTOUserCv("Education", eduScore, 10));

        // 4. Projects (15 marks)
        int projScore = Math.min(projectCount * 7, 15);
        totalScore += projScore;
        breakdowns.add(new ScoreBreakdownDTOUserCv("Projects", projScore, 15));

        // 5. Certifications (10 marks)
        int certScore = hasCertifications ? 10 : 0;
        totalScore += certScore;
        breakdowns.add(new ScoreBreakdownDTOUserCv("Certifications", certScore, 10));

        // 6. Completeness (5 marks)
        int completeScore = 5;
        totalScore += completeScore;
        breakdowns.add(new ScoreBreakdownDTOUserCv("Completeness", completeScore, 5));

        return AnalysisResponseDTOUserCv.builder()
                .totalScore(totalScore)
                .sectionScores(breakdowns)
                .matchedKeywords(matched)
                .missingKeywords(missing)
                .suggestions(List.of(
                        "Ensure your job descriptions highlight impactful metrics (e.g., 'Increased efficiency by 20%').",
                        missing.isEmpty() ? "Your keywords align perfectly with the JD!" : "Try adding this missing skill contextually to your experience: " + missing.get(0)
                ))
                .build();
    }
}