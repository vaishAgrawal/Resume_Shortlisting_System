package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.Data;
import java.util.List;

@Data
public class ParsedJdDTO {
    private List<String> requiredSkills;
    private int minYearsExperience;
}