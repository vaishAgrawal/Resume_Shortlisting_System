package com.resumeshortlist.resume_shortlist_backend.service;

import com.resumeshortlist.resume_shortlist_backend.dto.AnalysisResponse;
import com.resumeshortlist.resume_shortlist_backend.entity.*;
import com.resumeshortlist.resume_shortlist_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.HashSet;
import java.io.File;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ResumeAnalysisService {

    private final ResumeRepository resumeRepository;
    private final JobPostingRepository jobPostingRepository;
    private final CandidateRepository candidateRepository;
    private final CandidateScoreRepository candidateScoreRepository;
    private final FileParserService fileParserService;
    private final GeminiService geminiService;
    private final UserRepository userRepository;

    @Transactional
    public AnalysisResponse analyzeAndSave(Long resumeId, String domain, User currentUser) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Strategy Part 2: Look for local job description if DB is empty
        JobPosting jobPosting = getJobPostingForDomain(domain, currentUser);

        try {
            // Check for credits
            if (currentUser.getCredits() == null || currentUser.getCredits() <= 0) {
                throw new RuntimeException("You have exhausted your free analysis credits. Please contact support to add more.");
            }

            String resumeText = fileParserService.extractText(resume.getFilePath());
            AnalysisResponse analysis = geminiService.analyzeResume(resumeText, jobPosting.getDescription());

            // Decrement and Save Credits
            currentUser.setCredits(currentUser.getCredits() - 1);
            userRepository.save(currentUser);

            // Populate remaining credits in response
            analysis.setRemainingCredits(currentUser.getCredits());

            // 1. Candidate Base Data
            Candidate candidate = resume.getCandidate();
            if (candidate == null) {
                candidate = new Candidate();
                candidate.setResume(resume);
            }
            
            AnalysisResponse.CandidateDetails details = analysis.getDetails();
            candidate.setName(details.getName());
            candidate.setEmail(details.getEmail());
            candidate.setPhone(details.getPhone());
            candidate.setLinkedinUrl(details.getLinkedin());
            candidate.setSummary(analysis.getProfessionalSummary());
            candidate.setExtractedAt(LocalDateTime.now());

            // Clear old data
            candidate.getEducations().clear();
            candidate.getWorkExperiences().clear();
            candidate.getProjects().clear();
            candidate.getExtractedSkills().clear();

            // 2. Map Education
            if (analysis.getEducation() != null) {
                for (AnalysisResponse.EducationDetails eduDto : analysis.getEducation()) {
                    Education edu = new Education();
                    edu.setDegree(eduDto.getDegree());
                    edu.setInstitution(eduDto.getInstitution());
                    edu.setFieldOfStudy(eduDto.getFieldOfStudy());
                    edu.setStartYear(eduDto.getStartYear());
                    edu.setEndYear(eduDto.getEndYear());
                    edu.setGpa(eduDto.getGpa());
                    edu.setCandidate(candidate);
                    candidate.getEducations().add(edu);
                }
            }

            // 3. Map Experience
            if (analysis.getExperience() != null) {
                for (AnalysisResponse.ExperienceDetails expDto : analysis.getExperience()) {
                    WorkExperience exp = new WorkExperience();
                    exp.setJobTitle(expDto.getJobTitle());
                    exp.setCompany(expDto.getCompany());
                    exp.setDescription(expDto.getDescription());
                    exp.setIsCurrent(expDto.getIsCurrent());
                    exp.setStartDate(parseDate(expDto.getStartDate()));
                    exp.setEndDate(parseDate(expDto.getEndDate()));
                    exp.setCandidate(candidate);
                    candidate.getWorkExperiences().add(exp);
                }
            }

            // 4. Map Projects
            if (analysis.getProjects() != null) {
                for (AnalysisResponse.ProjectDetails projDto : analysis.getProjects()) {
                    Project proj = new Project();
                    proj.setTitle(projDto.getTitle());
                    proj.setDescription(projDto.getDescription());
                    proj.setTechStack(projDto.getTools());
                    proj.setGithubLink(projDto.getUrl());
                    proj.setCandidate(candidate);
                    candidate.getProjects().add(proj);
                }
            }

            // 5. Map Skills
            if (analysis.getExtractedSkills() != null) {
                for (String skillName : analysis.getExtractedSkills()) {
                    ExtractedSkill skill = new ExtractedSkill();
                    skill.setSkillName(skillName);
                    skill.setCandidate(candidate);
                    candidate.getExtractedSkills().add(skill);
                }
            }

            candidate = candidateRepository.save(candidate);

            // 6. Save Score
            CandidateScore candidateScore = new CandidateScore();
            candidateScore.setCandidate(candidate);
            candidateScore.setJobPosting(jobPosting);
            candidateScore.setTotalScore(analysis.getOverallScore());
            candidateScore.setScoredAt(LocalDateTime.now());
            candidateScore.setStatus("COMPLETED");

            for (AnalysisResponse.CategoryScore cat : analysis.getBreakdown()) {
                ScoreBreakdown breakdown = new ScoreBreakdown(
                    cat.getCategory(),
                    cat.getScore(),
                    cat.getTotal(),
                    cat.getFeedback()
                );
                breakdown.setCandidateScore(candidateScore);
                candidateScore.getScoreBreakdowns().add(breakdown);
            }

            candidateScoreRepository.save(candidateScore);

            return analysis;
        } catch (Exception e) {
            throw new RuntimeException("Analysis failed: " + e.getMessage(), e);
        }
    }

    public AnalysisResponse getLatestAnalysis(User user) {
        return resumeRepository.findFirstByUploadedByOrderByUploadedAtDesc(user)
                .flatMap(resume -> Optional.ofNullable(resume.getCandidate()))
                .flatMap(candidate -> candidateScoreRepository.findFirstByCandidateOrderByScoredAtDesc(candidate)
                        .map(score -> {
                            AnalysisResponse response = mapToResponse(candidate, score);
                            response.setRemainingCredits(user.getCredits());
                            return response;
                        }))
                .orElse(AnalysisResponse.builder()
                        .remainingCredits(user.getCredits())
                        .build());
    }

    private AnalysisResponse mapToResponse(Candidate candidate, CandidateScore score) {
        return AnalysisResponse.builder()
                .overallScore(score.getTotalScore())
                .professionalSummary(candidate.getSummary())
                .details(AnalysisResponse.CandidateDetails.builder()
                        .name(candidate.getName())
                        .email(candidate.getEmail())
                        .phone(candidate.getPhone())
                        .linkedin(candidate.getLinkedinUrl())
                        .build())
                .extractedSkills(candidate.getExtractedSkills().stream()
                        .map(ExtractedSkill::getSkillName)
                        .collect(Collectors.toList()))
                .education(candidate.getEducations().stream()
                        .map(edu -> AnalysisResponse.EducationDetails.builder()
                                .degree(edu.getDegree())
                                .institution(edu.getInstitution())
                                .fieldOfStudy(edu.getFieldOfStudy())
                                .startYear(edu.getStartYear())
                                .endYear(edu.getEndYear())
                                .gpa(edu.getGpa())
                                .build())
                        .collect(Collectors.toList()))
                .experience(candidate.getWorkExperiences().stream()
                        .map(exp -> AnalysisResponse.ExperienceDetails.builder()
                                .jobTitle(exp.getJobTitle())
                                .company(exp.getCompany())
                                .description(exp.getDescription())
                                .startDate(exp.getStartDate() != null ? exp.getStartDate().toString() : null)
                                .endDate(exp.getEndDate() != null ? exp.getEndDate().toString() : null)
                                .isCurrent(exp.getIsCurrent())
                                .build())
                        .collect(Collectors.toList()))
                .projects(candidate.getProjects().stream()
                        .map(proj -> AnalysisResponse.ProjectDetails.builder()
                                .title(proj.getTitle())
                                .description(proj.getDescription())
                                .tools(proj.getTechStack())
                                .url(proj.getGithubLink())
                                .build())
                        .collect(Collectors.toList()))
                .breakdown(score.getScoreBreakdowns().stream()
                        .map(b -> AnalysisResponse.CategoryScore.builder()
                                .category(b.getCategory())
                                .score(b.getScore())
                                .total(b.getMaxScore())
                                .feedback(b.getFeedback())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    public Set<String> getAvailableDomains() {
        Set<String> domains = new HashSet<>();

        // 1. From Database
        jobPostingRepository.findAll().forEach(jp -> domains.add(jp.getTitle()));

        // 2. From File System
        File folder = new File("job_descriptions");
        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles((dir, name) -> 
                name.endsWith(".txt") || name.endsWith(".pdf") || name.endsWith(".docx"));
            if (files != null) {
                for (File file : files) {
                    String name = file.getName();
                    // Strip extensions
                    name = name.replace(".txt", "").replace(".pdf", "").replace(".docx", "");
                    
                    // Convert "backend_developer" to "Backend Developer" for display
                    String formattedName = Arrays.stream(name.split("_"))
                            .map(word -> word.isEmpty() ? "" : word.substring(0, 1).toUpperCase() + word.substring(1))
                            .collect(Collectors.joining(" "));
                    domains.add(formattedName);
                }
            }
        }
        return domains;
    }

    private JobPosting getJobPostingForDomain(String domain, User currentUser) {
        // 1. Try DB first
        Optional<JobPosting> dbJob = jobPostingRepository.findFirstByTitleContainingIgnoreCaseOrDepartmentContainingIgnoreCase(domain, domain);
        if (dbJob.isPresent()) return dbJob.get();

        // 2. Try file system
        String baseFileName = domain.toLowerCase().replace(" ", "_");
        String[] extensions = {".txt", ".pdf", ".docx"};
        
        for (String ext : extensions) {
            Path path = Paths.get("job_descriptions", baseFileName + ext);
            if (Files.exists(path)) {
                try {
                    String content;
                    if (ext.equals(".txt")) {
                        content = Files.readString(path);
                    } else {
                        // Use Tika for PDF/Docx
                        content = fileParserService.extractText(path.toString());
                    }
                    
                    if (content == null || content.isBlank()) continue;

                    // We need to persist a "System Managed" JD so the score foreign keys work
                    JobPosting systemJob = new JobPosting();
                    systemJob.setTitle(domain + " (Auto-Loaded)");
                    systemJob.setDepartment("System");
                    systemJob.setDescription(content);
                    systemJob.setCreatedBy(currentUser);
                    return jobPostingRepository.save(systemJob);
                } catch (Exception e) {
                    System.err.println("Failed to read local JD file (" + ext + "): " + e.getMessage());
                }
            }
        }

        // 3. Last resort: just take any job from DB
        return jobPostingRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No job postings available in DB or folder for domain: " + domain));
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.toLowerCase().contains("present") || dateStr.isEmpty()) {
            return null;
        }
        try {
            // Rough attempt to parse common AI date strings
            // This could be improved with more robust logic
            String cleaned = dateStr.replaceAll("[^a-zA-Z0-9 ]", " ").trim();
            // Try common formats if needed, otherwise return null to avoid crash
            return null; // For now, return null as robust parsing is complex and AI output varies
        } catch (Exception e) {
            return null; 
        }
    }
}
