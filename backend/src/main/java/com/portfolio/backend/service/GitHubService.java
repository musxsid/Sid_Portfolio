package com.portfolio.backend.service;

import com.portfolio.backend.dto.GitHubContributionDataDto;
import com.portfolio.backend.dto.GitHubProjectDto;

import java.util.List;

public interface GitHubService {
    List<GitHubProjectDto> getProjects();
    GitHubContributionDataDto getContributions();
}

