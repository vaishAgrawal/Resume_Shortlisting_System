package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.entity.JobPosting;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.JobPostingRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import com.resumeshortlist.resume_shortlist_backend.service.JobDescriptionParsingService;
import com.resumeshortlist.resume_shortlist_backend.service.JobPostingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/job-postings")
public class JobPostingController {

    @Autowired
    private JobPostingService jobPostingService;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobDescriptionParsingService jobDescriptionParsingService;

    private static final Logger logger = LoggerFactory.getLogger(JobPostingController.class);

    // RECRUITER creates job
    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping("/create")
    public JobPosting createJobPosting(
            @RequestBody JobPosting jobPosting,
            @RequestParam Long userId
    ) {
        return jobPostingService.createJobPosting(jobPosting, userId);
    }

    // ADMIN + RECRUITER can view jobs
    @PreAuthorize("hasAnyRole('ADMIN','RECRUITER')")
    @GetMapping("/all")
    public List<JobPosting> getAllJobPostings() {
        return jobPostingService.getAllJobPostings();
    }

    // RECRUITER saves required skills
    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping("/save-requirements")
    public ResponseEntity<?> saveRequirements(@RequestBody Map<String, Object> payload) {
        try {

            Long jobId = null;
            if (payload.get("jobId") != null) {
                jobId = Long.valueOf(payload.get("jobId").toString());
            }

            if (jobId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Job ID is missing. Please upload a Job Description first."));
            }

            List<String> skills = (List<String>) payload.get("skills");

            if (skills == null || skills.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No skills provided"));
            }

            jobPostingService.saveRequiredSkills(jobId, skills);

            return ResponseEntity.ok(Map.of(
                    "message", "Skills saved successfully",
                    "jobId", jobId
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to save requirements: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping("/domain-skills")
    public ResponseEntity<?> createJobFromDomainAndSkills(
            @RequestParam("userId") Long userId,
            @RequestBody Map<String, Object> payload
    ) {
        try {
            String title = (String) payload.getOrDefault("jobDomain", "Job");
            // NEW: Extract JD Text
            String jdText = (String) payload.getOrDefault("jdText", "Created from recruiter domain/skills selection");
            Object rawSkills = payload.get("skills");

            List<String> skills = new ArrayList<>();
            if (rawSkills instanceof List<?>) {
                for (Object o : (List<?>) rawSkills) {
                    if (o != null) skills.add(o.toString());
                }
            }

            // Pass jdText to the service
            JobPosting job = jobPostingService.createJobPostingWithSkills(title, jdText, userId, skills);

            return ResponseEntity.ok(Map.of(
                    "jobId", job.getId(),
                    "title", job.getTitle(),
                    "skillCount", skills.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create job: " + e.getMessage());
        }
    }

    // ADMIN + RECRUITER can view job
    @PreAuthorize("hasAnyRole('ADMIN','RECRUITER')")
    @GetMapping("/{id}")
    public ResponseEntity<JobPosting> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostingService.getJobById(id));
    }

    // ADMIN deletes jobs
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostingService.deleteJobById(id));
    }

    // RECRUITER uploads job description
    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadJobPosting(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {

        logger.info("=== JD UPLOAD STARTED ===");

        try {

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String uploadDir = "C:/uploads/job_descriptions/";

            File uploadFolder = new File(uploadDir);

            if (!uploadFolder.exists()) {
                boolean created = uploadFolder.mkdirs();

                if (!created) {
                    throw new IOException("Failed to create upload directory");
                }
            }

            String uniqueName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            File dest = new File(uploadDir + uniqueName);

            file.transferTo(dest);

            JobPosting extractedData = jobDescriptionParsingService.parseJobDescription(dest);

            JobPosting jp = new JobPosting();

            jp.setTitle(extractedData.getTitle() != null
                    ? extractedData.getTitle()
                    : file.getOriginalFilename());

            jp.setDepartment(extractedData.getDepartment());
            jp.setDescription(extractedData.getDescription() != null
                    ? extractedData.getDescription()
                    : "Uploaded via File");

            jp.setMinExperienceYears(extractedData.getMinExperienceYears());
            jp.setEducationLevel(extractedData.getEducationLevel());

            jp.setFileName(file.getOriginalFilename());
            jp.setFilePath(dest.getAbsolutePath());
            jp.setFileType(file.getContentType());

            jp.setCreatedBy(user);
            jp.setCreatedAt(LocalDateTime.now());

            JobPosting savedJob = jobPostingRepository.save(jp);

            Map<String, Object> response = new HashMap<>();

            response.put("id", savedJob.getId());
            response.put("title", savedJob.getTitle());
            response.put("department", savedJob.getDepartment());
            response.put("educationLevel", savedJob.getEducationLevel());
            response.put("message", "Upload successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("JD Upload Failed: " + e.getMessage());
        }
    }
}