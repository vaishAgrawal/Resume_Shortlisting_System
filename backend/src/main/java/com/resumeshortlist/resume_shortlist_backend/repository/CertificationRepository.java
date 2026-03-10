package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.Candidate;
import com.resumeshortlist.resume_shortlist_backend.entity.Certification;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByCandidate(Candidate candidate);
    List<Certification> findByCandidateId(Long candidateId);
    List<Certification> findByNameContainingIgnoreCase(String name);

    @Modifying
    @Transactional
    @Query("DELETE FROM Certification c WHERE c.candidate.id IN :candidateIds")
    void deleteByCandidateIdIn(@org.springframework.data.repository.query.Param("candidateIds") List<Long> candidateIds);
}