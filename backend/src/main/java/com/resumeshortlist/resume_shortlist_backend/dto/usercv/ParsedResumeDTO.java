package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.Data;
import java.util.List;

@Data
public class ParsedResumeDTO {
    private List<String> technicalSkills;
    private int totalYearsExperience;
    private int projectCount;
    private boolean hasCertifications;
}