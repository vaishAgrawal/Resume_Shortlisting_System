package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.Data;

@Data
public class UploadRequestDTOUserCv {
    private String resumeText; 
    private String jdText; // Optional: If null, service uses a default JD
    private String targetDomain;
    private String resumeFileName;
}