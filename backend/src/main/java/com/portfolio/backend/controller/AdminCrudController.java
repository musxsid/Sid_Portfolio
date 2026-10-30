package com.portfolio.backend.controller;

import com.portfolio.backend.dto.ExperienceDto;
import com.portfolio.backend.dto.LeadDto;
import com.portfolio.backend.dto.ProjectDto;
import com.portfolio.backend.dto.ResumeDto;
import com.portfolio.backend.dto.SkillDto;
import com.portfolio.backend.service.ExperienceService;
import com.portfolio.backend.service.LeadService;
import com.portfolio.backend.service.ProjectService;
import com.portfolio.backend.service.ResumeService;
import com.portfolio.backend.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCrudController {

    private final ProjectService projectService;
    private final ExperienceService experienceService;
    private final SkillService skillService;
    private final LeadService leadService;
    private final ResumeService resumeService;

    // --- Projects ---
    
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping("/projects")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto projectDto) {
        return new ResponseEntity<>(projectService.createProject(projectDto), HttpStatus.CREATED);
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDto projectDto) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDto));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // --- Experience ---

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDto>> getExperience() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }

    @PostMapping("/experience")
    public ResponseEntity<ExperienceDto> createExperience(@Valid @RequestBody ExperienceDto experienceDto) {
        return new ResponseEntity<>(experienceService.createExperience(experienceDto), HttpStatus.CREATED);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<ExperienceDto> updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceDto experienceDto) {
        return ResponseEntity.ok(experienceService.updateExperience(id, experienceDto));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }

    // --- Skills ---

    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping("/skills")
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillDto skillDto) {
        return new ResponseEntity<>(skillService.createSkill(skillDto), HttpStatus.CREATED);
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<SkillDto> updateSkill(@PathVariable Long id, @Valid @RequestBody SkillDto skillDto) {
        return ResponseEntity.ok(skillService.updateSkill(id, skillDto));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/skills/category")
    public ResponseEntity<Void> updateCategory(@RequestParam String oldCategory, @RequestParam String newCategory) {
        skillService.updateCategory(oldCategory, newCategory);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/skills/category")
    public ResponseEntity<Void> deleteCategory(@RequestParam String category) {
        skillService.deleteCategory(category);
        return ResponseEntity.noContent().build();
    }

    // --- Resume ---
    
    @GetMapping("/resume")
    public ResponseEntity<ResumeDto> getResume() {
        return ResponseEntity.ok(resumeService.getResume());
    }

    @PutMapping("/resume")
    public ResponseEntity<ResumeDto> updateResume(@Valid @RequestBody ResumeDto resumeDto) {
        return ResponseEntity.ok(resumeService.updateResume(resumeDto));
    }

    // --- Leads (Admin read-only view) ---
    
    @GetMapping("/leads")
    public ResponseEntity<List<LeadDto>> getLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }
}
