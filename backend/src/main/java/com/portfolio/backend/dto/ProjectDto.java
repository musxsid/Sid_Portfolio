package com.portfolio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private String id; // Convert Long to String for frontend compatibility if needed, or keep as String mapped from Long.

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Tags are required")
    private String tags;

    private String githubUrl;
    
    private String liveUrl;
    
    private List<String> images;
    
    private String image; // For backward compatibility with single image if needed
}
