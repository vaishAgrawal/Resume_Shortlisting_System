package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.entity.Resume;
import com.resumeshortlist.resume_shortlist_backend.service.FileUploadService;
import com.resumeshortlist.resume_shortlist_backend.service.ResumeParsingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final FileUploadService fileUploadService;
    private final ResumeParsingService resumeParsingService;

    // 1. Dashboard User Upload (No Job ID needed)
    @PostMapping("/upload/{userId}")
public ResponseEntity<?> uploadResumesForUser(
        @PathVariable Long userId,
        @RequestPart("files") MultipartFile[] files) {
    try {
        List<Resume> saved = fileUploadService.uploadMultipleResumes(userId, files);
        
        // Trigger parallel parsing for ALL uploaded resumes
        List<CompletableFuture<String>> futures = new ArrayList<>();
        for (Resume resume : saved) {
            futures.add(resumeParsingService.parseAndSaveResume(resume.getId()));
        }
        
        // Wait for all Async threads to finish extraction before returning to Frontend
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        return ResponseEntity.ok(saved); 
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Upload/Parsing failed: " + e.getMessage());
    }
}

    // 2. Recruiter Job-Specific Upload
    @PostMapping("/upload/{userId}/{jobId}")
    public ResponseEntity<?> uploadResumesForJob(
            @PathVariable Long userId,
            @PathVariable Long jobId,
            @RequestPart("files") MultipartFile[] files) {

        try {
            List<Resume> saved = fileUploadService.uploadMultipleResumes(userId, files);

            // Parsing handle karna (Optional: dashboard uses separate /analyze step)
            for (Resume resume : saved) {
                try {
                    resumeParsingService.parseAndSaveResume(resume.getId());
                } catch (Exception e) {
                    System.err.println("Error parsing resume " + resume.getId() + ": " + e.getMessage());
                }
            }

            return ResponseEntity.ok(saved); // Consistently return the objects
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Resume>> getResumesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(fileUploadService.getAllResumesByUser(userId));
    }
}