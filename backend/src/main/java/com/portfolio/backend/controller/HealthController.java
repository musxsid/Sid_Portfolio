package com.portfolio.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

/**
 * Zero-overhead health check endpoint for cloud container lifecycle and pre-warming
 * (Render, Koyeb, UptimeRobot, Vercel frontend client pre-warm).
 * Returns HTTP 200 with {"status":"UP"} without executing database or external API calls.
 */
@RestController
public class HealthController {

    @GetMapping({"/health", "/api/public/health"})
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Collections.singletonMap("status", "UP"));
    }
}
