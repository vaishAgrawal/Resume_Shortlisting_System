package com.resumeshortlist.resume_shortlist_backend.repository.usercv;

import com.resumeshortlist.resume_shortlist_backend.entity.usercv.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserForCvRepository extends JpaRepository<UserForCv, Long> {
    Optional<UserForCv> findByEmail(String email);
}