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
public class ExperienceDto {
    private String id;

    @NotBlank(message = "Role title is required")
    private String roleTitle;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotBlank(message = "Location is required")
    private String location;

    private String projectName;

    @NotBlank(message = "Description is required")
    private String description;
}
