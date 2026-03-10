package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.Candidate;
import com.resumeshortlist.resume_shortlist_backend.entity.WorkExperience;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    List<WorkExperience> findByCandidate(Candidate candidate);
    List<WorkExperience> findByCandidateId(Long candidateId);
    List<WorkExperience> findByJobTitleContainingIgnoreCase(String jobTitle);

    @Modifying
    @Transactional
    @Query("DELETE FROM WorkExperience w WHERE w.candidate.id IN :candidateIds")
    void deleteByCandidateIdIn(@org.springframework.data.repository.query.Param("candidateIds") List<Long> candidateIds);
}