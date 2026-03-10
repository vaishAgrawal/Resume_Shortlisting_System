package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.Candidate;
import com.resumeshortlist.resume_shortlist_backend.entity.Education;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByCandidate(Candidate candidate);
    List<Education> findByCandidateId(Long candidateId);
    List<Education> findByDegree(String degree);

    @Modifying
    @Transactional
    @Query("DELETE FROM Education e WHERE e.candidate.id IN :candidateIds")
    void deleteByCandidateIdIn(@org.springframework.data.repository.query.Param("candidateIds") List<Long> candidateIds);
}