package com.portfolio.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadDto {
    private String id;
    
    private String timestamp; // Frontend usually works with formatted String or ISO string

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String contactNumber;

    @NotBlank(message = "Message is required")
    private String message; // the entity uses 'query', we map it to 'message' based on frontend mockData
}
