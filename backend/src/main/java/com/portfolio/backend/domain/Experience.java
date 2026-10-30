package com.portfolio.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roleTitle;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private String location;

    @Column
    private String projectName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
}
