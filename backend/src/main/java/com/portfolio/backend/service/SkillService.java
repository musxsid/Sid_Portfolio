package com.portfolio.backend.service;

import com.portfolio.backend.dto.SkillDto;
import java.util.List;

public interface SkillService {
    List<SkillDto> getAllSkills();
    SkillDto getSkillById(Long id);
    SkillDto createSkill(SkillDto skillDto);
    SkillDto updateSkill(Long id, SkillDto skillDto);
    void deleteSkill(Long id);
    void updateCategory(String oldCategory, String newCategory);
    void deleteCategory(String category);
}
