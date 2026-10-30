package com.portfolio.backend.service;

import com.portfolio.backend.dto.LeadDto;
import java.util.List;

public interface LeadService {
    List<LeadDto> getAllLeads();
    LeadDto createLead(LeadDto leadDto);
}
