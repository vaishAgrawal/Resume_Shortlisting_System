package com.resumeshortlist.resume_shortlist_backend.controller;
import com.resumeshortlist.resume_shortlist_backend.service.CandidateScoringService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

        @Autowired
        private CandidateScoringService candidateScoreService;

        @GetMapping("/top10/pdf")
        public ResponseEntity<byte[]> downloadTop10Pdf(@RequestParam Long jobId) {

            ByteArrayInputStream pdfStream = candidateScoreService.generateTop10Pdf(jobId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=top10_candidates.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfStream.readAllBytes());
        }
    @GetMapping("/count")
    public ResponseEntity<String> getCandidateCount(@RequestParam Long jobId) {
        if (jobId == null || jobId <= 0) {
            return ResponseEntity.badRequest().body("Invalid jobId");
        }

        Long count = candidateScoreService.getCandidateCount(jobId);

        if (count == null || count == 0) {
            return ResponseEntity.ok("No candidates found for Job ID: " + jobId);
        }

        return ResponseEntity.ok("Total candidates for Job ID " + jobId + ": " + count);
    }
    // ✅ CSV download endpoint
    @GetMapping("/shortlisted/csv")
    public ResponseEntity<byte[]> downloadShortlistedCsv(@RequestParam Long jobId) {

        String csvContent = candidateScoreService.generateShortlistedCsv(jobId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shortlisted_candidates.csv")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(csvContent.getBytes(StandardCharsets.UTF_8));
    }
    }

