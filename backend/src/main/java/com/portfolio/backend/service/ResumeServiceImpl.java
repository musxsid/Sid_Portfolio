package com.portfolio.backend.service;

import com.portfolio.backend.domain.Resume;
import com.portfolio.backend.dto.ResumeDto;
import com.portfolio.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public ResumeDto getResume() {
        List<Resume> resumes = resumeRepository.findAll();
        if (resumes.isEmpty()) {
            return null; // or return a default empty DTO
        }
        return mapToDto(resumes.get(0)); // We only keep one active resume
    }

    @Override
    @Transactional
    public ResumeDto updateResume(ResumeDto resumeDto) {
        List<Resume> resumes = resumeRepository.findAll();
        Resume resume;
        if (resumes.isEmpty()) {
            resume = new Resume();
        } else {
            resume = resumes.get(0);
        }
        
        resume.setFilename(resumeDto.getFilename());
        resume.setUrl(resumeDto.getUrl());
        resume.setLastUpdated(LocalDateTime.now().format(formatter));
        
        Resume savedResume = resumeRepository.save(resume);
        return mapToDto(savedResume);
    }

    private ResumeDto mapToDto(Resume resume) {
        return ResumeDto.builder()
                .id(resume.getId().toString())
                .filename(resume.getFilename())
                .url(resume.getUrl())
                .lastUpdated(resume.getLastUpdated())
                .build();
    }
}
