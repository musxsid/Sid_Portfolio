package com.portfolio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitHubContributionDataDto {
    private String username;
    private int totalContributions;
    private int currentStreak;
    private int longestStreak;
    private List<Day> days;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Day {
        private String date;
        private int count;
        private int level; // 0, 1, 2, 3, 4
    }
}

