package com.resumeshortlist.resume_shortlist_backend.service.usercv;

import com.resumeshortlist.resume_shortlist_backend.entity.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.repository.usercv.*;
import com.resumeshortlist.resume_shortlist_backend.dto.usercv.AnalysisResponseDTOUserCv;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserSubscriptionService {

    private final SubscriptionForUserRepository subRepo;
    private final CreditUsageForUserRepository creditRepo;
    private final UserForCvRepository userForCvRepository;

    // --- NEW: JUST-IN-TIME INITIALIZATION ---
    @Transactional
    public UserForCv getOrCreateUserForCv(String email) {
        return userForCvRepository.findByEmail(email).orElseGet(() -> {
            // 1. Create the isolated CV User
            UserForCv newUser = new UserForCv();
            newUser.setEmail(email);
            newUser = userForCvRepository.save(newUser);

            // 2. Grant them the default FREE plan with 5 credits
            SubscriptionForUser sub = new SubscriptionForUser();
            sub.setUser(newUser);
            sub.setPlanType(SubscriptionForUser.PlanType.FREE);
            sub.setAtsCredits(5);
            sub.setAiRewritesUsed(0);
            sub.setSectionImprovementsUsed(0);
            sub.setLastResetDate(LocalDateTime.now());
            subRepo.save(sub);

            newUser.setSubscription(sub);
            return newUser;
        });
    }

    @Transactional
    public SubscriptionForUser.PlanType deductAnalysisCredit(UserForCv user) {
        SubscriptionForUser sub = subRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (sub.getPlanType() != SubscriptionForUser.PlanType.PRO) {
            if (sub.getAtsCredits() <= 0) {
                throw new RuntimeException("Insufficient ATS Credits. Please upgrade your plan.");
            }
            sub.setAtsCredits(sub.getAtsCredits() - 1);
            subRepo.save(sub);

            CreditUsageForUser usage = new CreditUsageForUser();
            usage.setUser(user);
            usage.setCreditsDeducted(1);
            usage.setActionType("ATS_ANALYSIS");
            creditRepo.save(usage);
        }
        return sub.getPlanType();
    }

    public void filterResponseByPlan(AnalysisResponseDTOUserCv response, SubscriptionForUser.PlanType plan) {
        if (plan == SubscriptionForUser.PlanType.FREE) {
            if (response.getMatchedKeywords().size() > 5) {
                response.setMatchedKeywords(response.getMatchedKeywords().subList(0, 5));
            }
            response.setMissingKeywords(null);
            response.setSuggestions(null);
            response.setSubscriptionWarning("Upgrade to STARTER or PRO to unlock missing keywords and AI suggestions.");
        
        } else if (plan == SubscriptionForUser.PlanType.STARTER) {
            if (response.getSuggestions().size() > 2) {
                response.setSuggestions(response.getSuggestions().subList(0, 2));
            }
            response.setSubscriptionWarning("Upgrade to PRO for full semantic analysis and Resume Rewrite features.");
        }
    }
}