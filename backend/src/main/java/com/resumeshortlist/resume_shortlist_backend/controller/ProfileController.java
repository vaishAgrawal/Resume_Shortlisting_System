package com.resumeshortlist.resume_shortlist_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

import java.util.Collections;

import com.resumeshortlist.resume_shortlist_backend.dto.ProfileUpdateRequest;
import com.resumeshortlist.resume_shortlist_backend.service.ProfileService;

@RestController
@RequestMapping("/api/auth")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/{userId}/name")
    public ResponseEntity<?> updateUserName(@PathVariable Long userId, @RequestBody ProfileUpdateRequest request) {
        try {
            profileService.updateUserName(userId, request.getName());
            return ResponseEntity.ok(Collections.singletonMap("message", "Name updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }



}
