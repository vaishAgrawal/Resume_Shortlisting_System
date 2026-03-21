package com.resumeshortlist.resume_shortlist_backend.repository.usercv;

import com.resumeshortlist.resume_shortlist_backend.entity.usercv.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalysisResultForUserRepository extends JpaRepository<AnalysisResultForUser, Long> {
    List<AnalysisResultForUser> findByUserOrderByAnalyzedAtDesc(UserForCv user);
}