package com.portfolio.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${CLIENT_URL:${FRONTEND_URL:}}")
    private String configuredFrontendUrl;

    private List<String> getOriginPatterns() {
        List<String> originPatterns = new ArrayList<>();

        // 1. Local development origins
        originPatterns.add("http://localhost:5173");
        originPatterns.add("http://localhost:3000");
        originPatterns.add("http://127.0.0.1:5173");
        originPatterns.add("http://127.0.0.1:3000");

        // 2. Production frontend origin dynamically read from CLIENT_URL or FRONTEND_URL
        if (configuredFrontendUrl != null && !configuredFrontendUrl.isBlank()) {
            for (String origin : configuredFrontendUrl.split(",")) {
                String cleanOrigin = origin.trim();
                if (!cleanOrigin.isEmpty()) {
                    originPatterns.add(cleanOrigin);
                }
            }
        }

        // 3. Vercel deployment preview domains & general secure fallback
        originPatterns.add("https://*.vercel.app");
        originPatterns.add("https://*.onrender.com");
        originPatterns.add("https://*.koyeb.app");

        // If no explicit frontend URL is configured, also permit wildcard patterns
        if (configuredFrontendUrl == null || configuredFrontendUrl.isBlank()) {
            originPatterns.add("*");
        }

        return originPatterns;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(getOriginPatterns());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(getOriginPatterns().toArray(new String[0]))
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
                        "file:./src/main/resources/static/resume/",
                        "file:../backend/resume/",
                        "file:../backend/src/main/resources/static/resume/",
                        "file:../frontend/public/resume/",
                        "file:D:/Programming/Sid_Portfolio/backend/resume/",
                        "file:D:/Programming/Sid_Portfolio/backend/src/main/resources/static/resume/",
                        "file:D:/Programming/Sid_Portfolio/frontend/public/resume/"
                );
    }
}
