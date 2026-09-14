package com.college.erp.controller;

import com.college.erp.model.Staff;
import com.college.erp.model.Student;
import com.college.erp.repository.StaffRepository;
import com.college.erp.repository.StudentRepository;
import com.college.erp.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * AuthController — issues signed JWTs for demo credentials and dynamic users.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final StaffRepository staffRepo;
    private final StudentRepository studentRepo;

    // Demo user store: username → { password, springRole, displayName }
    private static final Map<String, String[]> DEMO_USERS = Map.of(
        "admin_hod",       new String[]{"hod123",     "ROLE_ADMIN_HOD",   "Dr. Sarah Jenkins"},
        "super_admin",     new String[]{"super123",   "ROLE_SUPER_ADMIN", "System Administrator"},
        "staff_001",       new String[]{"staff123",   "ROLE_STAFF",       "Prof. Marcus Vance"},
        "student_001",     new String[]{"student123", "ROLE_STUDENT",     "Alex Rivera (CS2024-042)"},
        "student_999",     new String[]{"student123", "ROLE_STUDENT",     "Unlinked Student"},
        "parent_001",      new String[]{"parent123",  "ROLE_PARENT",      "Elena Rivera (Parent of Alex)"},
        "parent_002",      new String[]{"parent123",  "ROLE_PARENT",      "Sophia Patel (Unlinked Parent)"}
    );

    public AuthController(JwtService jwtService, StaffRepository staffRepo, StudentRepository studentRepo) {
        this.jwtService = jwtService;
        this.staffRepo = staffRepo;
        this.studentRepo = studentRepo;
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "alma-backend"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "").trim();

        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Username and password required"));
        }

        String uLower = username.toLowerCase();

        // 1. Check hardcoded static demo users
        String[] userRecord = DEMO_USERS.get(username);
        if (userRecord == null) {
            userRecord = DEMO_USERS.get(uLower);
        }

        if (userRecord != null) {
            if (userRecord[0].equals(password) || password.equals("change123")) {
                String token = jwtService.generateToken(username, userRecord[1]);
                return ResponseEntity.ok(Map.of(
                    "token",       token,
                    "username",    username,
                    "role",        userRecord[1],
                    "displayName", userRecord[2]
                ));
            }
        }

        // 2. Check Staff Repository (by staffId or email)
        Optional<Staff> staffOpt = staffRepo.findByStaffId(username);
        if (staffOpt.isEmpty()) staffOpt = staffRepo.findByEmail(username);
        if (staffOpt.isEmpty()) staffOpt = staffRepo.findByStaffId(uLower);
        if (staffOpt.isEmpty()) staffOpt = staffRepo.findByEmail(uLower);

        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            if (password.equals("staff123") || password.equals("change123") || password.equalsIgnoreCase(staff.getStaffId()) || password.equalsIgnoreCase(username)) {
                String springRole = "ROLE_STAFF";
                String displayName = staff.getName() != null ? staff.getName() : "Faculty Member";
                String token = jwtService.generateToken(username, springRole);
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", username,
                    "role", springRole,
                    "displayName", displayName
                ));
            }
        }

        // 3. Check Student Repository (by studentId, email, parentUsername)
        Optional<Student> studentOpt = studentRepo.findByStudentId(username);
        if (studentOpt.isEmpty()) studentOpt = studentRepo.findByEmail(username);
        if (studentOpt.isEmpty()) studentOpt = studentRepo.findByStudentId(uLower);
        if (studentOpt.isEmpty()) studentOpt = studentRepo.findByEmail(uLower);

        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (password.equals("student123") || password.equals("change123") || password.equalsIgnoreCase(student.getStudentId()) || password.equalsIgnoreCase(username)) {
                String springRole = "ROLE_STUDENT";
                String displayName = student.getName() != null ? student.getName() + " (" + student.getStudentId() + ")" : "Student";
                String token = jwtService.generateToken(username, springRole);
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", username,
                    "role", springRole,
                    "displayName", displayName
                ));
            }
        }

        // Check Parent lookup via Student Repository
        Optional<Student> parentStudentOpt = studentRepo.findByParentUsername(username);
        if (parentStudentOpt.isEmpty()) parentStudentOpt = studentRepo.findByParentUsername(uLower);

        if (parentStudentOpt.isPresent()) {
            Student student = parentStudentOpt.get();
            if (password.equals("parent123") || password.equals("change123") || password.equalsIgnoreCase(username)) {
                String springRole = "ROLE_PARENT";
                String displayName = "Parent of " + (student.getName() != null ? student.getName() : "Student");
                String token = jwtService.generateToken(username, springRole);
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", username,
                    "role", springRole,
                    "displayName", displayName
                ));
            }
        }

        // 4. Dynamic Fallback for newly enrolled users, email logins, or standard credentials
        boolean isValidPassword = password.equals("change123") || password.equals("staff123") || 
                                  password.equals("student123") || password.equals("parent123") || 
                                  password.equals("hod123") || password.equals("super123") || 
                                  password.equalsIgnoreCase(username);

        if (isValidPassword) {
            String springRole;
            String displayName;

            if (uLower.startsWith("stf") || uLower.startsWith("emp") || uLower.contains("staff") || uLower.contains("faculty") || uLower.contains("prof") || password.equals("staff123")) {
                springRole = "ROLE_STAFF";
                displayName = "Faculty / Staff (" + username + ")";
            } else if (uLower.startsWith("parent") || uLower.startsWith("prt") || uLower.contains("parent") || password.equals("parent123")) {
                springRole = "ROLE_PARENT";
                displayName = "Parent Account (" + username + ")";
            } else if (uLower.contains("admin") || uLower.contains("hod") || password.equals("hod123")) {
                springRole = "ROLE_ADMIN_HOD";
                displayName = "Admin / HoD (" + username + ")";
            } else if (uLower.contains("super") || password.equals("super123")) {
                springRole = "ROLE_SUPER_ADMIN";
                displayName = "Super Administrator (" + username + ")";
            } else {
                springRole = "ROLE_STUDENT";
                displayName = "Enrolled Student (" + username + ")";
            }

            String token = jwtService.generateToken(username, springRole);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", username,
                "role", springRole,
                "displayName", displayName
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
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

