package com.college.erp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**", "/ws-pulse/**", "/actuator/**").permitAll()

                // Leave management — requires at minimum Admin/HoD role
                // Students and Parents cannot approve/reject leaves
                .requestMatchers("/api/leaves/**").hasAnyRole("SUPER_ADMIN", "ADMIN_HOD")

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
            // Register the JWT filter BEFORE Spring's default auth filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow both the Vite dev server (3005) and potential prod origin
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "http://localhost:3005",
            "http://localhost:8080"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "X-Claimed-Role"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
