package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.entity.Resume;
import com.resumeshortlist.resume_shortlist_backend.service.FileUploadService;
import com.resumeshortlist.resume_shortlist_backend.service.ResumeParsingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final FileUploadService fileUploadService;
    private final ResumeParsingService resumeParsingService;

    @PostMapping("/upload/{userId}/{jobId}")
    public ResponseEntity<?> uploadResumes(
            @PathVariable Long userId,
            @PathVariable Long jobId,
            @RequestPart("files") MultipartFile[] files) {

        try {
            // 1. Files ko local storage/DB mein save karo
            List<Resume> saved = fileUploadService.uploadMultipleResumes(userId, files);

            // 2. 🔥 FIXED LOGIC: Nayi service ke hisaab se call
            // Hum loop chala kar har resume ko parse karne ke liye bhej rahe hain
            for (Resume resume : saved) {
                try {
                    resumeParsingService.parseAndSaveResume(resume.getId());
                } catch (Exception e) {
                    System.err.println("Error parsing resume " + resume.getId() + ": " + e.getMessage());
                }
            }

            // Dynamic Response Message
            String responseMessage = String.format("Upload successful! %d resumes are being processed for Job ID: %d", 
                                                    saved.size(), jobId);

            return ResponseEntity.ok(responseMessage);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Resume>> getResumesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(fileUploadService.getAllResumesByUser(userId));
    }
}