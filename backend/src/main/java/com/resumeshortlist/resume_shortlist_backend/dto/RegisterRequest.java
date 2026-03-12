package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "USER" or "RECRUITER"
    
    // Fields for USER role
    private String username;
    private String phoneNumber;
    private String location;
    private String collegeName;
    private String degree;
    private Integer graduationYear;

    // Field for RECRUITER role
    private String recruiterSecretKey; 
}