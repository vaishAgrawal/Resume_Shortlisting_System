package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.Candidate;
import com.resumeshortlist.resume_shortlist_backend.entity.Project;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCandidate(Candidate candidate);
    List<Project> findByCandidateId(Long candidateId);
    List<Project> findByTitleContainingIgnoreCase(String title);

    @Modifying
    @Transactional
    @Query("DELETE FROM Project p WHERE p.candidate.id IN :candidateIds")
    void deleteByCandidateIdIn(@org.springframework.data.repository.query.Param("candidateIds") List<Long> candidateIds);
}