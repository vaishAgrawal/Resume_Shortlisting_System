package com.resumeshortlist.resume_shortlist_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    public enum Role {
        USER,      // Candidate
        RECRUITER,
        ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // --- Candidate Specific Fields ---
    private String username;
    private String phoneNumber;
    private String location;
    private String collegeName;
    private String degree;
    private Integer graduationYear;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

        // In User.java
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;
}