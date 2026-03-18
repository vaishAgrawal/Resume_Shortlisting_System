package com.resumeshortlist.resume_shortlist_backend.dto;

import lombok.Data;

@Data
public class AnalyzeRequest {
    private Long resumeId;
    private String domain;
}
