package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String college;
    private String degree;
    private Integer passingYear;
    private String location;
    private String imageUrl;
}