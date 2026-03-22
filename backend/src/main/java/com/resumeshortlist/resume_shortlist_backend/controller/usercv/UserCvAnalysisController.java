package com.resumeshortlist.resume_shortlist_backend.controller.usercv;

import com.resumeshortlist.resume_shortlist_backend.dto.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.AnalysisResultForUser;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.SubscriptionForUser;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.UserForCv;
import com.resumeshortlist.resume_shortlist_backend.repository.usercv.AnalysisResultForUserRepository;
import com.resumeshortlist.resume_shortlist_backend.service.usercv.RazorpayService;
import com.resumeshortlist.resume_shortlist_backend.service.usercv.UserCvAnalysisService;
import com.resumeshortlist.resume_shortlist_backend.service.usercv.UserCvPdfService;
import com.resumeshortlist.resume_shortlist_backend.service.usercv.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/user-cv")
@RequiredArgsConstructor
public class UserCvAnalysisController {

    private final UserCvAnalysisService analysisService;
    private final UserSubscriptionService subscriptionService;
    @Autowired private RazorpayService razorpayService;
    @Autowired private AnalysisResultForUserRepository resultRepo;
    @Autowired private UserCvPdfService pdfService;

    // --- 1. PAYMENT ENDPOINTS ---
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = (Integer) data.get("amount");
            String planType = (String) data.get("planType");
            String orderData = razorpayService.createOrder(amount, planType);
            return ResponseEntity.ok(orderData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(Principal principal, @RequestBody Map<String, String> data) {
        UserForCv user = subscriptionService.getOrCreateUserForCv(principal.getName());
        boolean isSuccess = razorpayService.verifyPaymentAndUpdatePlan(
                user, data.get("razorpay_order_id"), data.get("razorpay_payment_id"), 
                data.get("razorpay_signature"), data.get("planType")
        );

        if (isSuccess) {
            return ResponseEntity.ok(Map.of("message", "Payment successful, plan upgraded!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment verification failed"));
        }
    }

    // --- 2. HISTORY ENDPOINT (GATED) ---
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Principal principal) {
        UserForCv user = subscriptionService.getOrCreateUserForCv(principal.getName());
        
        // Gateway: Only STARTER and PRO get history
        if (user.getSubscription().getPlanType() == SubscriptionForUser.PlanType.FREE) {
            return ResponseEntity.status(403).body(Map.of("error", "History is locked on the FREE plan. Upgrade to STARTER or PRO."));
        }

        return ResponseEntity.ok(resultRepo.findByUserOrderByAnalyzedAtDesc(user));
    }

    @GetMapping("/history/{analysisId}")
    public ResponseEntity<?> getHistoryDetails(Principal principal, @PathVariable Long analysisId) {
        UserForCv user = subscriptionService.getOrCreateUserForCv(principal.getName());
        
        // Safety: Ensure record exists and belongs to user
        AnalysisResultForUser entity = resultRepo.findById(analysisId).orElseThrow();
        if (!entity.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access to this report."));
        }

        return ResponseEntity.ok(analysisService.getHistoryDetails(analysisId));
    }

    // --- 3. DOWNLOAD REPORT ENDPOINT (GATED) ---
    @GetMapping("/download-report/{analysisId}")
    public ResponseEntity<?> downloadReport(Principal principal, @PathVariable Long analysisId) {
        UserForCv user = subscriptionService.getOrCreateUserForCv(principal.getName());

        // Gateway: Only PRO gets the PDF download
        if (user.getSubscription().getPlanType() != SubscriptionForUser.PlanType.PRO) {
            return ResponseEntity.status(403).body(Map.of("error", "PDF Downloads are exclusive to the PRO plan."));
        }

        AnalysisResultForUser result = resultRepo.findById(analysisId).orElseThrow();
        if (!result.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access."));
        }

        ByteArrayInputStream bis = pdfService.generateOptimizedReport(result);
        
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Optimized_Resume_Report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new org.springframework.core.io.InputStreamResource(bis));
    }

    // CHANGED: Now accepts FormData (File + Strings) instead of JSON
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeResume(
            Principal principal,
            @RequestParam("resumeFile") MultipartFile resumeFile,
            @RequestParam("targetDomain") String targetDomain,
            @RequestParam(value = "jdText", defaultValue = "") String jdText) {
        try {
            UserForCv user = subscriptionService.getOrCreateUserForCv(principal.getName());
            
            // 1. EXTRACT REAL TEXT FROM PDF USING TIKA
            Tika tika = new Tika();
            String resumeText = tika.parseToString(resumeFile.getInputStream());

            // 2. Pack into our DTO
            UploadRequestDTOUserCv request = new UploadRequestDTOUserCv();
            request.setResumeText(resumeText);
            request.setTargetDomain(targetDomain);
            request.setJdText(jdText);
            request.setResumeFileName(resumeFile.getOriginalFilename());

            // 3. Analyze
            AnalysisResponseDTOUserCv response = analysisService.analyzeUserCv(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/credits")
    public ResponseEntity<?> getCredits(Principal principal) {
        try {
            UserForCv user = subscriptionService.getOrCreateUserForCv(principal.getName());
            return ResponseEntity.ok(Map.of(
                    "plan", user.getSubscription().getPlanType().name(),
                    "atsCreditsRemaining", user.getSubscription().getAtsCredits()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Could not fetch credits"));
        }
    }

    @GetMapping("/domains")
    public ResponseEntity<?> getAvailableDomains() {
        try {
            return ResponseEntity.ok(analysisService.getAvailableDomains());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch domains"));
        }
    }
}