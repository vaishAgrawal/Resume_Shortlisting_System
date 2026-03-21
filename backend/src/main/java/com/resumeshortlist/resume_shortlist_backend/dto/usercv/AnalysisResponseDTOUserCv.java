package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AnalysisResponseDTOUserCv {
    private Integer totalScore;
    private List<ScoreBreakdownDTOUserCv> sectionScores;
    private List<String> matchedKeywords;
    private List<String> missingKeywords; // Locked in FREE
    private List<String> suggestions;     // Locked/Limited based on plan
    private String subscriptionWarning;   // e.g., "Upgrade to PRO to see missing skills"
}