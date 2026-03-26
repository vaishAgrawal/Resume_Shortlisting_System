package com.resumeshortlist.resume_shortlist_backend.service;

import com.resumeshortlist.resume_shortlist_backend.entity.Resume;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.ResumeRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileUploadService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Inject the CloudinaryService we created
    @Autowired
    private CloudinaryService cloudinaryService;

    public FileUploadService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public List<Resume> uploadMultipleResumes(Long userId, MultipartFile[] files) throws Exception {
        List<Resume> savedResumes = new ArrayList<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Invalid user ID"));

        for (MultipartFile file : files) {

            // 2️⃣ Upload the file directly to Cloudinary
            // This returns a secure URL (e.g., https://res.cloudinary.com/...)
            String cloudinaryUrl = cloudinaryService.uploadFile(file);

            // 3️⃣ Create Resume record
            Resume resume = new Resume();
            resume.setFileName(file.getOriginalFilename());
            
            // 4️⃣ Save the Cloudinary URL in the database instead of the local C:/ path!
            resume.setFilePath(cloudinaryUrl); 
            
            resume.setFileType(file.getContentType());
            resume.setUploadedAt(LocalDateTime.now());
            resume.setUploadedBy(user);

            savedResumes.add(resumeRepository.save(resume));
        }

        return savedResumes;
    }

    public List<Resume> getAllResumesByUser(Long userId) {
        return resumeRepository.findByUploadedById(userId);
    }
}