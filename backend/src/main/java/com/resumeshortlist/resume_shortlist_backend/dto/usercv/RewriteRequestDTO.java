package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.Data;

@Data
public class RewriteRequestDTO {
    private String originalText;
    private String category; // e.g., "Experience", "Skills"
    private String jdContext; // Optional JD text for better matching
    private String templateName; // Optional template style
}
