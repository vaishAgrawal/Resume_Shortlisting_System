package com.resumeshortlist.resume_shortlist_backend.service;

import com.resumeshortlist.resume_shortlist_backend.dto.LoginRequest;
import com.resumeshortlist.resume_shortlist_backend.dto.RegisterRequest;
import com.resumeshortlist.resume_shortlist_backend.entity.User;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email already in use!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User.Role role = User.Role.valueOf(request.getRole().toUpperCase());
        user.setRole(role);

        if (role == User.Role.RECRUITER) {
            if (!"ADMIN_ACCESS_2026".equals(request.getRecruiterSecretKey())) {
                throw new RuntimeException("Error: Invalid Recruiter Secret Key!");
            }
            // Set defaults to avoid NULLs in DB
            user.setCollegeName("N/A");
            user.setDegree("N/A");
            user.setGraduationYear(0);
            user.setLocation("N/A");
            user.setPhoneNumber("N/A");
            user.setUsername("recruiter_" + request.getName().toLowerCase().replace(" ", ""));
        } else {
            user.setUsername(request.getUsername());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setLocation(request.getLocation());
            user.setCollegeName(request.getCollegeName());
            user.setDegree(request.getDegree());
            user.setGraduationYear(request.getGraduationYear());
        }

        userRepository.save(user);
        return "User registered successfully!";
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid credentials!");
        }

        // Optimized: We include the role in the UserDetails
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        return jwtService.generateToken(claims, userDetails);
    }
}