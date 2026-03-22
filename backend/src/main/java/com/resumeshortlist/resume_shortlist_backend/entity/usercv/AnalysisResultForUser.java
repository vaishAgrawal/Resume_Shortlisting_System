package com.resumeshortlist.resume_shortlist_backend.entity.usercv;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "analysis_result_for_user")
public class AnalysisResultForUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserForCv user;

    private Integer totalScore;
    private String targetDomain; // Stores the Job Title scanned for
    
    @Column(columnDefinition = "JSON")
    private String scoreBreakdowns; // Stores Section-wise scores
    
    @Column(columnDefinition = "JSON")
    private String matchedKeywords;
    
    @Column(columnDefinition = "JSON")
    private String missingKeywords;
    
    @Column(columnDefinition = "JSON")
    private String suggestions;

    private LocalDateTime analyzedAt = LocalDateTime.now();
}