package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.Data;
import java.util.List;

@Data
public class ParsedResumeDTO {
    private List<String> technicalSkills;
    private int totalYearsExperience;
    private int projectCount;
    private boolean hasCertifications;
    
    // NEW: Raw segments for AI Rewriting
    private String rawSummary;
    private List<String> rawExperience;
    private List<String> rawProjects;
}