package com.portfolio.backend.service;

import com.portfolio.backend.domain.Lead;
import com.portfolio.backend.dto.LeadDto;
import com.portfolio.backend.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public List<LeadDto> getAllLeads() {
        return leadRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LeadDto createLead(LeadDto leadDto) {
        Lead lead = Lead.builder()
                .timestamp(LocalDateTime.now())
                .name(leadDto.getName())
                .email(leadDto.getEmail())
                .contactNumber(leadDto.getContactNumber())
                .query(leadDto.getMessage())
                .build();
                
        Lead savedLead = leadRepository.save(lead);
        return mapToDto(savedLead);
    }

    private LeadDto mapToDto(Lead lead) {
        return LeadDto.builder()
                .id(lead.getId().toString())
                .timestamp(lead.getTimestamp() != null ? lead.getTimestamp().format(formatter) : "")
                .name(lead.getName())
                .email(lead.getEmail())
                .contactNumber(lead.getContactNumber())
                .message(lead.getQuery())
                .build();
    }
}
