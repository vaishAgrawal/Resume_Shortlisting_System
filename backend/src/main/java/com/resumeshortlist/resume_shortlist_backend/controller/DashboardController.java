package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.dto.AnalysisResponse;
import com.resumeshortlist.resume_shortlist_backend.dto.AnalyzeRequest;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import com.resumeshortlist.resume_shortlist_backend.service.ResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ResumeAnalysisService resumeAnalysisService;
    private final UserRepository userRepository;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody AnalyzeRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        try {
            String email = authentication.getName();
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            AnalysisResponse response = resumeAnalysisService.analyzeAndSave(
                    request.getResumeId(),
                    request.getDomain(),
                    currentUser
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Analysis failed: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestAnalysis(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        try {
            String email = authentication.getName();
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            AnalysisResponse response = resumeAnalysisService.getLatestAnalysis(currentUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch latest analysis: " + e.getMessage());
        }
    }

    @GetMapping("/domains")
    public ResponseEntity<?> getAvailableDomains() {
        try {
            return ResponseEntity.ok(resumeAnalysisService.getAvailableDomains());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch domains: " + e.getMessage());
        }
    }
}
