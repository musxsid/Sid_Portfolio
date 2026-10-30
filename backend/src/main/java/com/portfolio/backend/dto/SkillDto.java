package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDto {
    private String id;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotBlank(message = "Category is required")
    private String category;
}
