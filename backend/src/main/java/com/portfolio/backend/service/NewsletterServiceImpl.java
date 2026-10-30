package com.portfolio.backend.service;

import com.portfolio.backend.domain.Newsletter;
import com.portfolio.backend.dto.NewsletterDto;
import com.portfolio.backend.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsletterServiceImpl implements NewsletterService {

    private final NewsletterRepository newsletterRepository;

    @Override
    @Transactional
    public NewsletterDto subscribe(NewsletterDto dto) {
        String cleanEmail = dto.getEmail().trim().toLowerCase();

        return newsletterRepository.findByEmailIgnoreCase(cleanEmail)
                .map(existing -> {
                    if (!existing.isActive()) {
                        existing.setActive(true);
                        existing.setSubscribedAt(LocalDateTime.now());
                        newsletterRepository.save(existing);
                        log.info("Re-activated newsletter subscription for: {}", cleanEmail);
                    }
                    return NewsletterDto.builder().email(existing.getEmail()).build();
                })
                .orElseGet(() -> {
                    Newsletter subscriber = Newsletter.builder()
                            .email(cleanEmail)
                            .subscribedAt(LocalDateTime.now())
                            .active(true)
                            .build();
                    newsletterRepository.save(subscriber);
                    log.info("Created new newsletter subscription for: {}", cleanEmail);
                    return NewsletterDto.builder().email(subscriber.getEmail()).build();
                });
    }
}
