package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String currentPassword; // Now optional
    private String newPassword;
}