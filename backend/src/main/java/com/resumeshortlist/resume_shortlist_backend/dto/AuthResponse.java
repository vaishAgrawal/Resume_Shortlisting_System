package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;   
    private String name;
    private String role;
}