package com.portfolio.backend.controller;

import com.portfolio.backend.dto.*;
import com.portfolio.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicPortfolioController {

    private final ProjectService projectService;
    private final ExperienceService experienceService;
    private final SkillService skillService;
    private final LeadService leadService;
    private final ResumeService resumeService;
    private final GitHubService gitHubService;
    private final NewsletterService newsletterService;

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDto>> getExperience() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/resume")
    public ResponseEntity<ResumeDto> getResume() {
        return ResponseEntity.ok(resumeService.getResume());
    }

    @PostMapping("/leads")
    public ResponseEntity<LeadDto> submitLead(@Valid @RequestBody LeadDto leadDto) {
        LeadDto savedLead = leadService.createLead(leadDto);
        return new ResponseEntity<>(savedLead, HttpStatus.CREATED);
    }

    // Dynamic GitHub Repositories
    @GetMapping("/github/projects")
    public ResponseEntity<List<GitHubProjectDto>> getGitHubProjects() {
        return ResponseEntity.ok(gitHubService.getProjects());
    }

    // Dynamic GitHub Contribution Heatmap Widget Data
    @GetMapping("/github/contributions")
    public ResponseEntity<GitHubContributionDataDto> getGitHubContributions() {
        return ResponseEntity.ok(gitHubService.getContributions());
    }

    // Newsletter Subscription
    @PostMapping("/newsletter/subscribe")
    public ResponseEntity<NewsletterDto> subscribeNewsletter(@Valid @RequestBody NewsletterDto newsletterDto) {
        NewsletterDto subscribed = newsletterService.subscribe(newsletterDto);
        return new ResponseEntity<>(subscribed, HttpStatus.CREATED);
    }
}
