package com.portfolio.backend.service;

import com.portfolio.backend.dto.ProjectDto;
import java.util.List;

public interface ProjectService {
    List<ProjectDto> getAllProjects();
    ProjectDto getProjectById(Long id);
    ProjectDto createProject(ProjectDto projectDto);
    ProjectDto updateProject(Long id, ProjectDto projectDto);
    void deleteProject(Long id);
}
