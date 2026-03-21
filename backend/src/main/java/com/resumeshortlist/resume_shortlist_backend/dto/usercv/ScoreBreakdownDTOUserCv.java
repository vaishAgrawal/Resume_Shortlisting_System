package com.resumeshortlist.resume_shortlist_backend.dto.usercv;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScoreBreakdownDTOUserCv {
    private String category;
    private Integer score;
    private Integer maxScore;
}