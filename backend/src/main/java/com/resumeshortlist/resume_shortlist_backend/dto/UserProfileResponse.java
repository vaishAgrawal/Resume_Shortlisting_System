package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String name;
    private String email;
    private String phone;
    private String college;
    private String degree;
    private Integer passingYear;
    private String location;
    private String username;
    private String role;
    private String imageUrl;
}
