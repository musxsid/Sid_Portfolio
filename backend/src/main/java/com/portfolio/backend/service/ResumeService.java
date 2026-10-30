package com.portfolio.backend.service;

import com.portfolio.backend.dto.ResumeDto;

public interface ResumeService {
    ResumeDto getResume();
    ResumeDto updateResume(ResumeDto resumeDto);
}
