package com.resumeshortlist.resume_shortlist_backend.entity.usercv;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "subscription_for_user")
public class SubscriptionForUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserForCv user;

    @Enumerated(EnumType.STRING)
    private PlanType planType = PlanType.FREE; // FREE, STARTER, PRO

    private Integer atsCredits = 5; // Default for FREE
    private Integer aiRewritesUsed = 0;
    private Integer sectionImprovementsUsed = 0;
    
    private LocalDateTime validUntil;
    private LocalDateTime lastResetDate = LocalDateTime.now();

    public enum PlanType { FREE, STARTER, PRO }
}