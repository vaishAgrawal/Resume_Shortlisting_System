package com.resumeshortlist.resume_shortlist_backend.entity.usercv;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "credit_usage_for_user")
public class CreditUsageForUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserForCv user;

    private Integer creditsDeducted;
    private String actionType; // e.g., "ATS_ANALYSIS", "AI_REWRITE"
    private LocalDateTime usedAt = LocalDateTime.now();
}