package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.JobPosting;
import com.resumeshortlist.resume_shortlist_backend.entity.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    //List<JobPosting> findByCreatedById(Long userId);
    List<JobPosting> findAll();
    List<JobPosting> findByCreatedBy(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM JobPosting j WHERE j.createdBy.id = :userId")
    void bulkDeleteByUserId(@Param("userId") Long userId);

    Optional<JobPosting> findFirstByTitleContainingIgnoreCaseOrDepartmentContainingIgnoreCase(String title, String department);

}