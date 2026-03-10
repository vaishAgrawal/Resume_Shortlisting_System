package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.Data;

@Data
public class SupportRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String message;
}