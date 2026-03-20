package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.SubscriptionForUser;
import com.resumeshortlist.resume_shortlist_backend.entity.usercv.UserForCv;
import com.resumeshortlist.resume_shortlist_backend.repository.usercv.SubscriptionForUserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final SubscriptionForUserRepository subRepo;

    // 1. Create the Order
    public String createOrder(int amountInInr, String planType) throws Exception {
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInInr * 100); // Razorpay expects amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
        
        // Storing plan type in notes to know what to upgrade them to upon success
        JSONObject notes = new JSONObject();
        notes.put("planType", planType);
        orderRequest.put("notes", notes);

        Order order = razorpay.orders.create(orderRequest);
        return order.toString();
    }

    // 2. Verify Payment and Upgrade User
    @Transactional
    public boolean verifyPaymentAndUpdatePlan(UserForCv user, String orderId, String paymentId, String signature, String planType) {
        try {
            // Verify Signature to prevent hacking
            String payload = orderId + "|" + paymentId;
            boolean isValid = Utils.verifySignature(payload, signature, keySecret);

            if (isValid) {
                SubscriptionForUser sub = user.getSubscription();
                
                if ("STARTER".equalsIgnoreCase(planType)) {
                    sub.setPlanType(SubscriptionForUser.PlanType.STARTER);
                    sub.setAtsCredits(sub.getAtsCredits() + 10); // Add 10 credits
                } else if ("PRO".equalsIgnoreCase(planType)) {
                    sub.setPlanType(SubscriptionForUser.PlanType.PRO);
                    // PRO has unlimited credits, but we can set a high number or handle via logic
                    sub.setAtsCredits(9999); 
                }
                
                sub.setLastResetDate(LocalDateTime.now());
                subRepo.save(sub);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}