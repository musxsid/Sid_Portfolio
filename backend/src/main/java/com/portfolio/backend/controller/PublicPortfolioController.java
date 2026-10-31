package com.portfolio.backend.controller;

import com.portfolio.backend.dto.*;
import com.portfolio.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    private final GroqAiService groqAiService;

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

    @GetMapping({"/resume/file", "/resume/download"})
    public ResponseEntity<Resource> downloadResume() {
        Resource resource = resumeService.getResumeFileResource();
        if (resource == null || !resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        String filename = resumeService.getResumeFileName();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .body(resource);
    }

    @PostMapping("/leads")
    public ResponseEntity<LeadDto> submitLead(@Valid @RequestBody LeadDto leadDto) {
        LeadDto savedLead = leadService.createLead(leadDto);
        return new ResponseEntity<>(savedLead, HttpStatus.CREATED);
    }

    // Dynamic GitHub Repositories (real-time sync + backend dynamic image discovery)
    @GetMapping("/github/projects")
    public ResponseEntity<List<GitHubProjectDto>> getGitHubProjects(
            @RequestParam(value = "refresh", defaultValue = "false") boolean refresh) {
        return ResponseEntity.ok(gitHubService.getProjects(refresh));
    }

    // Dynamic Image Discovery for a given project slug
    @GetMapping("/projects/{repoName}/images")
    public ResponseEntity<List<String>> getProjectImages(@PathVariable String repoName) {
        return ResponseEntity.ok(gitHubService.findProjectImages(repoName));
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

    // Groq AI Chatbot Assistant (Grounded on resume, GitHub repos, and system architecture)
    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDto> chatWithAssistant(@Valid @RequestBody ChatRequestDto request) {
        return ResponseEntity.ok(groqAiService.processChat(request));
    }
}
