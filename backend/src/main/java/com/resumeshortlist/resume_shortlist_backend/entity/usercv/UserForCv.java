package com.resumeshortlist.resume_shortlist_backend.entity.usercv;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_for_cv")
public class UserForCv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SubscriptionForUser subscription;
}