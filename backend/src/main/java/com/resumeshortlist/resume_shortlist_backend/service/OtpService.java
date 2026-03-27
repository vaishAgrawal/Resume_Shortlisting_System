package com.resumeshortlist.resume_shortlist_backend.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // 🔥 Dynamically grab the verified sender email from application.properties
    @Value("${app.mail.from}")
    private String fromEmail;

    // Cache to store OTPs for 5 minutes
    private final LoadingCache<String, String> otpCache = CacheBuilder.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build(new CacheLoader<>() {
                public String load(String key) { return ""; }
            });

    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpCache.put(email, otp);
        return otp;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            
            // 🔥 CRITICAL FOR BREVO: Set the From address!
            message.setFrom(fromEmail); 
            
            message.setTo(toEmail);
            message.setSubject("Your Login OTP - Graphura ATS");
            message.setText("Your OTP for logging in is: " + otp + "\nThis code will expire in 5 minutes.");
            
            mailSender.send(message);
            System.out.println("✅ OTP email successfully sent to " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP.");
        }
    }

    public boolean validateOtp(String email, String otp) {
        String cachedOtp = otpCache.getIfPresent(email);
        if (cachedOtp != null && cachedOtp.equals(otp)) {
            otpCache.invalidate(email); // Clear OTP after successful use
            return true;
        }
        return false;
    }
}