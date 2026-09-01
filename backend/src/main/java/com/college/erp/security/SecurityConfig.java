package com.college.erp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import java.util.Arrays;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Value("${cors.allowed-origins:http://localhost:3000,http://localhost:3005,http://localhost:8080,https://*.onrender.com,https://*.vercel.app}")
    private String allowedOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\": \"Session expired or unauthenticated. Please log in.\"}");
            response.getWriter().flush();
        };
    }

    @Bean
    public AccessDeniedHandler customAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\": \"Insufficient permissions for this resource.\"}");
            response.getWriter().flush();
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(customAuthenticationEntryPoint())
                .accessDeniedHandler(customAccessDeniedHandler())
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**", "/ws-pulse/**", "/actuator/**").permitAll()

                // Leave management — requires at minimum Admin/HoD role
                .requestMatchers("/api/leaves/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD")

                // Attendance endpoints
                .requestMatchers("/api/attendance/me/summary", "/api/attendance/student/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD", "STAFF", "STUDENT")
                .requestMatchers("/api/attendance/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD", "STAFF")

                // Feedback endpoints — any authenticated user can read/create; replies checked in controller
                .requestMatchers("/api/feedback/**").authenticated()

                // Copilot action execution — admin only
                .requestMatchers("/api/copilot/execute-action").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD")
                .requestMatchers("/api/copilot/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD", "STAFF")

                // Admin-level data management
                .requestMatchers("/api/admin/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD")

                // Staff/faculty resources
                .requestMatchers("/api/staff/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD", "STAFF")

                // Student resources
                .requestMatchers("/api/student/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD", "STUDENT")

                // Parent resources
                .requestMatchers("/api/parent/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD", "PARENT")

                // Courses are readable by any authenticated user
                .requestMatchers("/api/courses/**").authenticated()

                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        config.setAllowedOriginPatterns(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "X-Claimed-Role"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
