package com.portfolio.backend.service;

import com.portfolio.backend.domain.Project;
import com.portfolio.backend.dto.ProjectDto;
import com.portfolio.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return mapToDto(project);
    }

    @Override
    @Transactional
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = mapToEntity(projectDto);
        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }

    @Override
    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        project.setTitle(projectDto.getTitle());
        project.setDescription(projectDto.getDescription());
        project.setTags(projectDto.getTags());
        project.setGithubUrl(projectDto.getGithubUrl());
        project.setLiveUrl(projectDto.getLiveUrl());
        project.setImages(projectDto.getImages());
        
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDto mapToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId().toString())
                .title(project.getTitle())
                .description(project.getDescription())
                .tags(project.getTags())
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getLiveUrl())
                .images(project.getImages())
                .image(project.getImages() != null && !project.getImages().isEmpty() ? project.getImages().get(0) : null)
                .build();
    }

    private Project mapToEntity(ProjectDto projectDto) {
        return Project.builder()
                .title(projectDto.getTitle())
                .description(projectDto.getDescription())
                .tags(projectDto.getTags())
                .githubUrl(projectDto.getGithubUrl())
                .liveUrl(projectDto.getLiveUrl())
                .images(projectDto.getImages())
                .build();
    }
}
