package com.college.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {
    UserDetailsServiceAutoConfiguration.class
})
public class CollegeErpApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollegeErpApplication.class, args);
    }
}
