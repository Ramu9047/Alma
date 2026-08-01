package com.college.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {
    MongoAutoConfiguration.class,
    MongoDataAutoConfiguration.class,
    MongoRepositoriesAutoConfiguration.class,
    UserDetailsServiceAutoConfiguration.class
})
public class CollegeErpApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollegeErpApplication.class, args);
    }
}
