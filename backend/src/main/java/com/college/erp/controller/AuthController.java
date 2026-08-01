package com.college.erp.controller;

import com.college.erp.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController — issues signed JWTs for demo credentials.
 *
 * POST /api/auth/login
 *   Body: { "username": "student_001", "password": "student123" }
 *   200:  { "token": "<signed-jwt>", "role": "ROLE_STUDENT", "name": "..." }
 *   401:  { "error": "Invalid credentials" }
 *
 * Credentials mirror the frontend mock users so the full login flow works
 * end-to-end without a real database.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    // Demo user store: username → { password, springRole, displayName }
    private static final Map<String, String[]> DEMO_USERS = Map.of(
        "admin_hod",    new String[]{"hod123",     "ROLE_ADMIN_HOD",   "Dr. Sarah Jenkins"},
        "super_admin",  new String[]{"super123",   "ROLE_SUPER_ADMIN", "System Administrator"},
        "staff_001",    new String[]{"staff123",   "ROLE_STAFF",       "Prof. Marcus Vance"},
        "student_001",  new String[]{"student123", "ROLE_STUDENT",     "Alex Rivera (CS2024-042)"},
        "parent_001",   new String[]{"parent123",  "ROLE_PARENT",      "Elena Rivera (Parent of Alex)"}
    );

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "alma-backend"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "").trim();

        String[] userRecord = DEMO_USERS.get(username);

        // Credential check — constant-time comparison not required here (demo only)
        if (userRecord == null || !userRecord[0].equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        String springRole  = userRecord[1]; // e.g. "ROLE_STUDENT"
        String displayName = userRecord[2];
        String token = jwtService.generateToken(username, springRole);

        return ResponseEntity.ok(Map.of(
            "token",       token,
            "username",    username,
            "role",        springRole,
            "displayName", displayName
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            org.springframework.security.core.Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        return ResponseEntity.ok(Map.of(
            "username",    authentication.getName(),
            "authorities", authentication.getAuthorities().toString()
        ));
    }
}
