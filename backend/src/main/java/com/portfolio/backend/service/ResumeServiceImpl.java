package com.portfolio.backend.service;

import com.portfolio.backend.domain.Resume;
import com.portfolio.backend.dto.ResumeDto;
import com.portfolio.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private List<File> resolveResumeDirectories() {
        List<File> dirs = new ArrayList<>();
        if (new File("src/main/resources").exists()) {
            // Launched from 'backend' directory
            dirs.add(new File("resume"));
            dirs.add(new File("src/main/resources/static/resume"));
            dirs.add(new File("../frontend/public/resume"));
            dirs.add(new File("../frontend/resume"));
        } else if (new File("backend").exists()) {
            // Launched from repository root
            dirs.add(new File("backend/resume"));
            dirs.add(new File("backend/src/main/resources/static/resume"));
            dirs.add(new File("frontend/public/resume"));
            dirs.add(new File("frontend/resume"));
        } else {
            dirs.add(new File("resume"));
        }
        return dirs;
    }

    @Override
    public Resource getResumeFileResource() {
        for (File dir : resolveResumeDirectories()) {
            if (dir.exists() && dir.isDirectory()) {
                File[] files = dir.listFiles((d, name) -> name.toLowerCase().endsWith(".pdf"));
                if (files != null && files.length > 0) {
                    // Sort latest modified file first
                    Arrays.sort(files, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
                    return new FileSystemResource(files[0]);
                }
            }
        }
        // Fallback to classpath
        ClassPathResource cpr = new ClassPathResource("static/resume/Siddharth_Shakyawal_Resume.pdf");
        if (cpr.exists()) {
            return cpr;
        }
        return null;
    }

    @Override
    public String getResumeFileName() {
        Resource res = getResumeFileResource();
        if (res != null && res.getFilename() != null) {
            return res.getFilename();
        }
        return "Siddharth_Shakyawal_Resume.pdf";
    }

    @Override
    @Transactional
    public ResumeDto getResume() {
        String filename = getResumeFileName();
        String fileUrl = "/api/public/resume/file";

        List<Resume> resumes = resumeRepository.findAll();
        Resume resume;
        if (resumes.isEmpty()) {
            resume = Resume.builder()
                    .filename(filename)
                    .url(fileUrl)
                    .lastUpdated(LocalDateTime.now().format(formatter))
                    .build();
            resume = resumeRepository.save(resume);
            log.info("[Resume] Created default database resume record pointing to '{}'", fileUrl);
        } else {
            resume = resumes.get(0);
            // If the database has a stale dummy placeholder like example-cloud-storage, sanitize it immediately
            if (resume.getUrl() == null || resume.getUrl().contains("example-cloud-storage.com") || !resume.getUrl().startsWith("/")) {
                resume.setUrl(fileUrl);
                resume.setFilename(filename);
                resume.setLastUpdated(LocalDateTime.now().format(formatter));
                resume = resumeRepository.save(resume);
                log.info("[Resume] Upgraded stale resume record to internal endpoint '{}'", fileUrl);
            }
        }
        return mapToDto(resume);
    }

    @Override
    @Transactional
    public ResumeDto updateResume(ResumeDto resumeDto) {
        List<Resume> resumes = resumeRepository.findAll();
        Resume resume = resumes.isEmpty() ? new Resume() : resumes.get(0);
        
        String filename = resumeDto.getFilename() != null && !resumeDto.getFilename().isBlank()
                ? resumeDto.getFilename()
                : getResumeFileName();

        String url = resumeDto.getUrl();
        if (url == null || url.isBlank() || url.contains("example-cloud-storage.com")) {
            url = "/api/public/resume/file";
        }

        resume.setFilename(filename);
        resume.setUrl(url);
        resume.setLastUpdated(LocalDateTime.now().format(formatter));
        
        Resume savedResume = resumeRepository.save(resume);
        return mapToDto(savedResume);
    }

    private ResumeDto mapToDto(Resume resume) {
        return ResumeDto.builder()
                .id(resume.getId() != null ? resume.getId().toString() : "1")
                .filename(resume.getFilename())
                .url(resume.getUrl())
                .lastUpdated(resume.getLastUpdated())
                .build();
    }
}
