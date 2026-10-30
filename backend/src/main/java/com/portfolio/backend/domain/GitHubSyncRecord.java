package com.portfolio.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "github_sync_records")
public class GitHubSyncRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String syncType; // "REPOSITORIES" or "CONTRIBUTIONS"

    private LocalDateTime lastSyncTime;

    private String status; // "SUCCESS", "FAILED"

    @Column(columnDefinition = "TEXT")
    private String payloadJson; // Full cached JSON payload

    private int itemCount;
}

