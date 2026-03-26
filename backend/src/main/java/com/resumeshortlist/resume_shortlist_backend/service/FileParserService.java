package com.resumeshortlist.resume_shortlist_backend.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

@Service
public class FileParserService {

    private final Tika tika = new Tika();

    public String extractText(String filePath) {
        try {
            // Check if the path is a Cloudinary URL
            if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
                
                // 🔥 Use Java's native URI class to safely handle spaces and weird characters in URLs
                URL url = new URI(filePath).toURL();
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                
                // Trick Cloudinary into thinking we are a Chrome browser
                connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
                connection.setRequestProperty("Accept", "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, */*");
                connection.setConnectTimeout(15000); 
                connection.setReadTimeout(15000);
                
                // Check if Cloudinary is still blocking the file
                int responseCode = connection.getResponseCode();
                if (responseCode >= 400) {
                    throw new RuntimeException("Cloudinary blocked the download (HTTP " + responseCode + "). Please ensure PDFs are allowed in your Cloudinary Security Settings.");
                }
                
                // Extract text directly from the cloud stream
                try (InputStream inputStream = connection.getInputStream()) {
                    return tika.parseToString(inputStream);
                }
                
            } else {
                // Fallback for local files
                File file = new File(filePath);
                if (!file.exists()) {
                    throw new RuntimeException("File not found locally: " + filePath);
                }
                return tika.parseToString(file);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from file: " + e.getMessage(), e);
        }
    }
}