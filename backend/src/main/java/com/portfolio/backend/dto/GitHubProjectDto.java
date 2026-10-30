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
public class GitHubProjectDto {
    private String id;
    private String name;
    private String title;
    private String tagline;
    private String description;
    private String githubUrl;
    private String liveUrl;
    private String language;
    private List<String> techStack;
    private int stars;
    private int forks;
    private String updatedAt;
    private List<String> images;
}
