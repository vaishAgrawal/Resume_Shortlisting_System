package com.resumeshortlist.resume_shortlist_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

import java.util.Collections;

import com.resumeshortlist.resume_shortlist_backend.dto.ProfileUpdateRequest;
import com.resumeshortlist.resume_shortlist_backend.service.ProfileService;

import com.resumeshortlist.resume_shortlist_backend.dto.PasswordChangeRequest;
import com.resumeshortlist.resume_shortlist_backend.dto.UserProfileResponse;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getUserProfile(Principal principal) {
        try {
            UserProfileResponse profile = profileService.getUserProfile(principal.getName());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody ProfileUpdateRequest request) {
        try {
            profileService.updateProfile(principal.getName(), request);
            return ResponseEntity.ok(Collections.singletonMap("message", "Profile updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody PasswordChangeRequest request) {
        try {
            profileService.changePassword(principal.getName(), request);
            return ResponseEntity.ok(Collections.singletonMap("message", "Password changed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
