package com.resumeshortlist.resume_shortlist_backend.controller;

import com.resumeshortlist.resume_shortlist_backend.dto.SupportRequestDto;
import com.resumeshortlist.resume_shortlist_backend.entity.SupportTicket;
import com.resumeshortlist.resume_shortlist_backend.repository.SupportTicketRepository;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import com.resumeshortlist.resume_shortlist_backend.service.EmailService; // Import the Email Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private EmailService emailService; // Inject the Email Service

    @PostMapping("/submit")
    public ResponseEntity<?> submitSupportRequest(@RequestBody SupportRequestDto request) {
        
        // 1. Verify if the email exists in the database
        if (!userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Email not found. Please use the email registered with your account."
            ));
        }

        // 2. Create and save the ticket in DB
        SupportTicket ticket = new SupportTicket();
        ticket.setFirstName(request.getFirstName());
        ticket.setLastName(request.getLastName());
        ticket.setEmail(request.getEmail());
        ticket.setMessage(request.getMessage());
        
        SupportTicket savedTicket = supportTicketRepository.save(ticket);

        // 3. Trigger the Email Notification to the Admin/Support Team
        emailService.sendSupportNotification(savedTicket);

        // 4. Return success to the frontend
        return ResponseEntity.ok(Map.of(
            "message", "Support request submitted successfully. Our team will contact you soon."
        ));
    }
}