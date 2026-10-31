package com.portfolio.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri:}")
    private String issuerUri;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
            .cors(org.springframework.security.config.Customizer.withDefaults()) // Enable CORS (handled by CorsConfig)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless sessions
            .authorizeHttpRequests(auth -> auth
                // Allow CORS preflight requests
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // Public Domain, Health Monitoring & Static Assets
                .requestMatchers("/health", "/healthz", "/api/public/**", "/projects/**", "/resume/**", "/static/**", "/error").permitAll()
                // Admin Domain
                .requestMatchers("/api/admin/**").authenticated()
                // Any other request
                .anyRequest().authenticated()
            );

        // Only enforce OAuth2 Resource Server if an issuer URI is explicitly provided (e.g. Keycloak)
        if (issuerUri != null && !issuerUri.isBlank() && !issuerUri.contains("localhost")) {
            http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));
        }

        return http.build();
    }
}
