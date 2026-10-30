package com.portfolio.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Allows localhost, Vercel deployments, and production domains
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/projects/**")
                .addResourceLocations(
                        "classpath:/static/projects/",
                        "file:./src/main/resources/static/projects/",
                        "file:./projects/",
                        "file:../backend/src/main/resources/static/projects/",
                        "file:../backend/projects/",
                        "file:D:/Programming/Sid_Portfolio/backend/src/main/resources/static/projects/",
                        "file:D:/Programming/Sid_Portfolio/backend/projects/"
                );

        registry.addResourceHandler("/resume/**")
                .addResourceLocations(
                        "classpath:/static/resume/",
                        "file:./resume/",
                        "file:../frontend/public/resume/",
                        "file:D:/Programming/Sid_Portfolio/frontend/public/resume/"
                );
    }
}
