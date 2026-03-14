package com.resumeshortlist.resume_shortlist_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resumeshortlist.resume_shortlist_backend.dto.ProfileUpdateRequest;
import com.resumeshortlist.resume_shortlist_backend.dto.UserProfileResponse;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;

@Service
public class ProfileService {
    @Autowired
    private UserRepository userRepository;

    public void updateProfile(String email, ProfileUpdateRequest request) {
        // Find the user by the email from the security context
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        
        String newName = "";
        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            newName += request.getFirstName().trim();
        }
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            newName += (newName.isEmpty() ? "" : " ") + request.getLastName().trim();
        }
        if (!newName.isEmpty()) {
            user.setName(newName);
        }
        
        if (request.getPhone() != null) user.setPhoneNumber(request.getPhone());
        if (request.getCollege() != null) user.setCollegeName(request.getCollege());
        if (request.getDegree() != null) user.setDegree(request.getDegree());
        if (request.getPassingYear() != null) user.setGraduationYear(request.getPassingYear());
        if (request.getLocation() != null) user.setLocation(request.getLocation());

        if (request.getImageUrl() != null) {
            user.setImageUrl(request.getImageUrl());
        }

        userRepository.save(user);
    }

    public UserProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        
        return UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .college(user.getCollegeName())
                .degree(user.getDegree())
                .passingYear(user.getGraduationYear())
                .location(user.getLocation())
                .username(user.getUsername())
                .role(user.getRole().name())
                .imageUrl(user.getImageUrl())
                .build();
    }

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public void changePassword(String email, com.resumeshortlist.resume_shortlist_backend.dto.PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Encode and set new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
