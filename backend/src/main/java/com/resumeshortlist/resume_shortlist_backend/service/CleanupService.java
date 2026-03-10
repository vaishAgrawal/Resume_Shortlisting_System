package com.resumeshortlist.resume_shortlist_backend.service;


import com.resumeshortlist.resume_shortlist_backend.entity.Candidate;
import com.resumeshortlist.resume_shortlist_backend.entity.JobPosting;
import com.resumeshortlist.resume_shortlist_backend.entity.Resume;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.CandidateRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.CandidateScoreRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.CertificationRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.EducationRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.ExtractedSkillRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.JobPostingRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.ProjectRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.RequiredSkillRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.ResumeRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.ScoreBreakdownRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.WorkExperienceRepository;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class CleanupService {

    // Inject all your repositories here
    @Autowired private UserRepository userRepository;
    @Autowired private JobPostingRepository jobPostingRepository;
    @Autowired private ResumeRepository resumeRepository;
    @Autowired private CandidateRepository candidateRepository;
    @Autowired private CandidateScoreRepository candidateScoreRepository;
    @Autowired private ScoreBreakdownRepository scoreBreakdownRepository;
    @Autowired private RequiredSkillRepository requiredSkillRepository;
    @Autowired private ExtractedSkillRepository extractedSkillRepository;
    @Autowired private EducationRepository educationRepository;
    @Autowired private WorkExperienceRepository workExperienceRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private CertificationRepository certificationRepository;

    @Transactional
    public void flushUserData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 1. Fetch the parent records to identify what needs to be deleted
        List<JobPosting> jobs = jobPostingRepository.findByCreatedBy(user);
        List<Resume> resumes = resumeRepository.findByUploadedBy(user);
        
        if (resumes.isEmpty() && jobs.isEmpty()) {
            System.out.println("Nothing to flush for User ID: " + userId);
            return;
        }

        // 2. Extract IDs for bulk deletion
        List<Long> jobIds = jobs.stream().map(JobPosting::getId).collect(Collectors.toList());
        List<Long> resumeIds = resumes.stream().map(Resume::getId).collect(Collectors.toList());

        // 3. Find candidates associated with these resumes
        List<Candidate> candidates = candidateRepository.findByResumeIdIn(resumeIds); // You may need to add this method to CandidateRepo: List<Candidate> findByResumeIdIn(List<Long> resumeIds);
        List<Long> candidateIds = candidates.stream().map(Candidate::getId).collect(Collectors.toList());

        // 4. BULK DELETE CHILD RECORDS FIRST (Extremely fast)
        if (!candidateIds.isEmpty()) {
            scoreBreakdownRepository.deleteByCandidateScoreCandidateIdIn(candidateIds); // You may need to add: void deleteByCandidateScoreCandidateIdIn(List<Long> ids);
            candidateScoreRepository.deleteByCandidateIdIn(candidateIds); // Add: void deleteByCandidateIdIn(List<Long> ids);
            extractedSkillRepository.deleteByCandidateIdIn(candidateIds); // Add: void deleteByCandidateIdIn(List<Long> ids);
            educationRepository.deleteByCandidateIdIn(candidateIds);
            workExperienceRepository.deleteByCandidateIdIn(candidateIds);
            projectRepository.deleteByCandidateIdIn(candidateIds);
            certificationRepository.deleteByCandidateIdIn(candidateIds);
            
            // Delete candidates in batch
            candidateRepository.deleteAllInBatch(candidates);
        }

        // 5. BULK DELETE JOB ASSOCIATIONS
        if (!jobIds.isEmpty()) {
            requiredSkillRepository.deleteByJobPostingIdIn(jobIds); // Add: void deleteByJobPostingIdIn(List<Long> ids);
        }

        // 6. FINALLY, BULK DELETE PARENTS
        if (!resumes.isEmpty()) resumeRepository.deleteAllInBatch(resumes);
        if (!jobs.isEmpty()) jobPostingRepository.deleteAllInBatch(jobs);

        System.out.println("✅ All data flushed for User ID: " + userId + " in record time!");
    }
}