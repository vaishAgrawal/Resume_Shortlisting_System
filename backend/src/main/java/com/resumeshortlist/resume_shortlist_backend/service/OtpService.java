package com.resumeshortlist.resume_shortlist_backend.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

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
        SimpleMailMessage message = new SimpleMailMessage();
        // message.setFrom("ayushdby902@gmail.com"); Use when using bravo email service
        message.setTo(toEmail);
        message.setSubject("Your Login OTP - Resume Shortlist V2");
        message.setText("Your OTP for logging in is: " + otp + "\nThis code will expire in 5 minutes.");
        mailSender.send(message);
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