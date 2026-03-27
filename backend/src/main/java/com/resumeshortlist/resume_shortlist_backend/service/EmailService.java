package com.resumeshortlist.resume_shortlist_backend.service;

import com.resumeshortlist.resume_shortlist_backend.entity.SupportTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // This grabs the receiver email we set in application.properties
    @Value("${support.email.receiver}")
    private String receiverEmail;

    // 🔥 NEW: Grab the email address you use to log into Brevo
    @Value("${app.mail.from}")
    private String fromEmail;

    public void sendSupportNotification(SupportTicket ticket) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            
            // 🔥 NEW: You MUST set the "From" address for Brevo
            message.setFrom(fromEmail); 
            
            // Set who gets the email
            message.setTo(receiverEmail);
            
            // Set the subject
            message.setSubject("New Support Ticket: " + ticket.getFirstName() + " " + ticket.getLastName());
            
            // Format the email body
            message.setText(
                "Hello Admin,\n\n" +
                "You have received a new support ticket from the Graphura Dashboard.\n\n" +
                "--------------------------------------------------\n" +
                "Name: " + ticket.getFirstName() + " " + ticket.getLastName() + "\n" +
                "Email: " + ticket.getEmail() + "\n" +
                "Time: " + ticket.getSubmittedAt() + "\n" +
                "--------------------------------------------------\n\n" +
                "Message:\n" + 
                ticket.getMessage() + "\n\n" +
                "--------------------------------------------------\n" +
                "Please reply to the user at their email address: " + ticket.getEmail()
            );

            // Send it!
            mailSender.send(message);
            System.out.println("✅ Support email successfully sent to " + receiverEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send support email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}