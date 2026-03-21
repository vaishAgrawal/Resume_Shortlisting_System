package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.dto.DashboardResponse;
import com.resumeshortlist.resume_shortlist_backend.entity.ScoreBreakdown;
import com.resumeshortlist.resume_shortlist_backend.repository.CandidateScoreRepository;
import com.resumeshortlist.resume_shortlist_backend.service.ScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ScoringController {

    private final ScoringService scoringService;
    private final CandidateScoreRepository scoreRepo;

    public ScoringController(ScoringService scoringService, CandidateScoreRepository scoreRepo) {
        this.scoringService = scoringService;
        this.scoreRepo = scoreRepo;
    }

    @PostMapping("/score/{jobId}")
    public ResponseEntity<?> triggerScoring(@PathVariable Long jobId, @RequestBody List<Long> candidateIds) { 
        try {
            System.out.println("API HIT: triggerScoring for JobID: " + jobId);

            if (candidateIds == null || candidateIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Candidate IDs list is empty"));
            }

            // Runs synchronously to free up Async threads for Gemini parsing. 
            // DB operations are fast enough that this won't block the UI noticeably.
            for (Long candId : candidateIds) {
                scoringService.calculateAndSaveScore(candId, jobId);
            }

            return ResponseEntity.accepted().body(Map.of(
                    "message", "Scoring completed for " + candidateIds.size() + " candidates",
                    "jobId", jobId
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to trigger scoring"));
        }
    }

    @GetMapping("/dashboard/{jobId}")
    public ResponseEntity<List<DashboardResponse>> getDashboard(@PathVariable Long jobId) {
        var scores = scoreRepo.findByJobPostingIdOrderByTotalScoreDesc(jobId);
        List<DashboardResponse> response = new ArrayList<>();
        int rank = 1;

        for (var s : scores) {
            try {
                var c = s.getCandidate();
                if (c == null) continue; 

                var r = c.getResume();
                String fileName = (r != null) ? r.getFileName() : "Unknown File";

                List<ScoreBreakdown> breakdowns = s.getScoreBreakdowns();
                if(breakdowns == null) breakdowns = new ArrayList<>();

                response.add(new DashboardResponse(
                        c.getId(),
                        c.getName() != null ? c.getName() : "Unknown Name",
                        c.getEmail() != null ? c.getEmail() : "No Email",
                        fileName,
                        s.getTotalScore(),
                        rank++,
                        s.getStatus(),
                        s.getScoredAt(),
                        breakdowns 
                ));
            } catch (Exception e) {
                System.err.println("Skipping corrupted record ID " + s.getId());
            }
        }
        return ResponseEntity.ok(response);
    }
}