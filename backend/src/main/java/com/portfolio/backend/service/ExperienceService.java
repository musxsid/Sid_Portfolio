package com.portfolio.backend.service;

import com.portfolio.backend.dto.ExperienceDto;
import java.util.List;

public interface ExperienceService {
    List<ExperienceDto> getAllExperiences();
    ExperienceDto getExperienceById(Long id);
    ExperienceDto createExperience(ExperienceDto experienceDto);
    ExperienceDto updateExperience(Long id, ExperienceDto experienceDto);
    void deleteExperience(Long id);
}
