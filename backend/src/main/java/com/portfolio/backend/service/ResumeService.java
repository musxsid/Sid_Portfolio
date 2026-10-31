package com.portfolio.backend.service;

import com.portfolio.backend.dto.ResumeDto;
import org.springframework.core.io.Resource;

public interface ResumeService {
    ResumeDto getResume();
    ResumeDto updateResume(ResumeDto resumeDto);
    Resource getResumeFileResource();
    String getResumeFileName();
}
