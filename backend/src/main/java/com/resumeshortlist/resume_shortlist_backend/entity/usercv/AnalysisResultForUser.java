package com.resumeshortlist.resume_shortlist_backend.entity.usercv;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "analysis_result_for_user")
public class AnalysisResultForUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserForCv user;

    private Integer totalScore;
    
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