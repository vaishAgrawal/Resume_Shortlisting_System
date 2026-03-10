package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.Resume;
import com.resumeshortlist.resume_shortlist_backend.entity.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUploadedById(Long userId);
    List<Resume> findByUploadedBy(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM Resume r WHERE r.uploadedBy.id = :userId")
    void bulkDeleteByUserId(@Param("userId") Long userId);
}
