package com.resumeshortlist.resume_shortlist_backend.repository;

import com.resumeshortlist.resume_shortlist_backend.entity.CandidateScore;
import com.resumeshortlist.resume_shortlist_backend.entity.ScoreBreakdown;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreBreakdownRepository extends JpaRepository<ScoreBreakdown, Long> {
    List<ScoreBreakdown> findByCandidateScore(CandidateScore candidateScore);
    List<ScoreBreakdown> findByCandidateScoreId(Long candidateScoreId);
    List<ScoreBreakdown> findByCategory(String category);

    @Modifying
    @Transactional
    @Query("DELETE FROM ScoreBreakdown s WHERE s.candidateScore.candidate.id IN :candidateIds")
    void deleteByCandidateScoreCandidateIdIn(@org.springframework.data.repository.query.Param("candidateIds") List<Long> candidateIds);
}