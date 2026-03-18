package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private Integer overallScore;
    private Integer remainingCredits;
    private String professionalSummary;
    private List<CategoryScore> breakdown;
    private CandidateDetails details;
    private List<EducationDetails> education;
    private List<ExperienceDetails> experience;
    private List<ProjectDetails> projects;
    private List<String> extractedSkills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryScore {
        private String category;
        private Integer score;
        private Integer total;
        private String feedback;
        private Map<String, Integer> subCategories;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateDetails {
        private String name;
        private String email;
        private String phone;
        private String linkedin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationDetails {
        private String degree;
        private String institution;
        private String fieldOfStudy;
        private Integer startYear;
        private Integer endYear;
        private Float gpa;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceDetails {
        private String jobTitle;
        private String company;
        private String description;
        private String startDate; // Using string because AI might return various formats
        private String endDate;
        private Boolean isCurrent;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectDetails {
        private String title;
        private String description;
        private String tools;
        private String url;
    }
}
