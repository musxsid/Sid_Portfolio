package com.portfolio.backend.repository;

import com.portfolio.backend.domain.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    Optional<Newsletter> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}

