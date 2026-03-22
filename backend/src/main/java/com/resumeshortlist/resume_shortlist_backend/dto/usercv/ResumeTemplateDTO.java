package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeTemplateDTO {
    private String id;
    private String name;
    private String description;
    private String previewImageUrl;
    private String tier; // BASIC, PREMIUM
    private boolean isLocked;
}
