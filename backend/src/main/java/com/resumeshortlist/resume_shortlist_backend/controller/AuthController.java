package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.dto.AuthResponse;
import com.resumeshortlist.resume_shortlist_backend.dto.LoginRequest;
import com.resumeshortlist.resume_shortlist_backend.dto.RegisterRequest;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import com.resumeshortlist.resume_shortlist_backend.service.AuthService;
import com.resumeshortlist.resume_shortlist_backend.service.OtpService;

import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(new AuthResponse(
                token, 
                user.getId(), 
                user.getName(), 
                user.getRole().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login Failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // In JWT, logout is primarily done by the client-side (deleting the token).
        // On server-side, we return a success message.
        return ResponseEntity.ok("Logged out successfully. Clear your token on frontend.");
    }

    // Add these to AuthController.java

    @Autowired
    private OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            String otp = otpService.generateOtp(email);
            otpService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("OTP sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send OTP.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otpService.validateOtp(email, otp)) {
            return ResponseEntity.ok("OTP Verified");
        } else {
            return ResponseEntity.status(HttpStatus.SC_UNAUTHORIZED).body("Invalid or expired OTP");
        }
    }
}