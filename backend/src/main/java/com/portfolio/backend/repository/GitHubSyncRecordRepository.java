package com.portfolio.backend.repository;

import com.portfolio.backend.domain.GitHubSyncRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GitHubSyncRecordRepository extends JpaRepository<GitHubSyncRecord, Long> {
    Optional<GitHubSyncRecord> findBySyncType(String syncType);
}

