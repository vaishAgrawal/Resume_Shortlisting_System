package com.resumeshortlist.resume_shortlist_backend.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import java.io.File;

@Service
public class FileParserService {

    private final Tika tika = new Tika();

    public String extractText(String filePath) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                throw new RuntimeException("File not found at: " + filePath);
            }
            return tika.parseToString(file);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text from file: " + e.getMessage(), e);
        }
    }
}
