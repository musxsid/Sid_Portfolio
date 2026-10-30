package com.portfolio.backend.service;

import com.portfolio.backend.domain.Skill;
import com.portfolio.backend.dto.SkillDto;
import com.portfolio.backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public SkillDto getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
        return mapToDto(skill);
    }

    @Override
    @Transactional
    public SkillDto createSkill(SkillDto skillDto) {
        Skill skill = mapToEntity(skillDto);
        Skill savedSkill = skillRepository.save(skill);
        return mapToDto(savedSkill);
    }

    @Override
    @Transactional
    public SkillDto updateSkill(Long id, SkillDto skillDto) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
        
        skill.setSkillName(skillDto.getSkillName());
        skill.setCategory(skillDto.getCategory());
        
        Skill updatedSkill = skillRepository.save(skill);
        return mapToDto(updatedSkill);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void updateCategory(String oldCategory, String newCategory) {
        List<Skill> skills = skillRepository.findByCategory(oldCategory);
        skills.forEach(skill -> skill.setCategory(newCategory));
        skillRepository.saveAll(skills);
    }

    @Override
    @Transactional
    public void deleteCategory(String category) {
        skillRepository.deleteByCategory(category);
    }

    private SkillDto mapToDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId().toString())
                .skillName(skill.getSkillName())
                .category(skill.getCategory())
                .build();
    }

    private Skill mapToEntity(SkillDto skillDto) {
        return Skill.builder()
                .skillName(skillDto.getSkillName())
                .category(skillDto.getCategory())
                .build();
    }
}
