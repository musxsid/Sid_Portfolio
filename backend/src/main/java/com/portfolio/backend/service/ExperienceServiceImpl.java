package com.portfolio.backend.service;

import com.portfolio.backend.domain.Experience;
import com.portfolio.backend.dto.ExperienceDto;
import com.portfolio.backend.repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;

    @Override
    public List<ExperienceDto> getAllExperiences() {
        return experienceRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ExperienceDto getExperienceById(Long id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
        return mapToDto(experience);
    }

    @Override
    @Transactional
    public ExperienceDto createExperience(ExperienceDto experienceDto) {
        Experience experience = mapToEntity(experienceDto);
        Experience savedExperience = experienceRepository.save(experience);
        return mapToDto(savedExperience);
    }

    @Override
    @Transactional
    public ExperienceDto updateExperience(Long id, ExperienceDto experienceDto) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
        
        experience.setRoleTitle(experienceDto.getRoleTitle());
        experience.setCompany(experienceDto.getCompany());
        experience.setDuration(experienceDto.getDuration());
        experience.setLocation(experienceDto.getLocation());
        experience.setProjectName(experienceDto.getProjectName());
        experience.setDescription(experienceDto.getDescription());
        
        Experience updatedExperience = experienceRepository.save(experience);
        return mapToDto(updatedExperience);
    }

    @Override
    @Transactional
    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }

    private ExperienceDto mapToDto(Experience experience) {
        return ExperienceDto.builder()
                .id(experience.getId().toString())
                .roleTitle(experience.getRoleTitle())
                .company(experience.getCompany())
                .duration(experience.getDuration())
                .location(experience.getLocation())
                .projectName(experience.getProjectName())
                .description(experience.getDescription())
                .build();
    }

    private Experience mapToEntity(ExperienceDto experienceDto) {
        return Experience.builder()
                .roleTitle(experienceDto.getRoleTitle())
                .company(experienceDto.getCompany())
                .duration(experienceDto.getDuration())
                .location(experienceDto.getLocation())
                .projectName(experienceDto.getProjectName())
                .description(experienceDto.getDescription())
                .build();
    }
}
