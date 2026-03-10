package com.resumeshortlist.resume_shortlist_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;

@Service
public class ProfileService {
    @Autowired
    private UserRepository userRepository;

    public void updateUserName(Long userId, String newName) {
        // Find the user by the ID passed from the frontend
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Update the name and save back to the database
        user.setName(newName);
        userRepository.save(user);
    }
}
