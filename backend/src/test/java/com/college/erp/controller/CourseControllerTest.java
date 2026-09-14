package com.college.erp.controller;

import com.college.erp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAdminCanCreateUpdateDeleteCourseWithPersistedFields() throws Exception {
        String adminToken = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String createJson = """
            {
              "courseCode": "TEST-AI-101",
              "name": "M.Tech AI & Data Science",
              "department": "CSE",
              "duration": 2,
              "totalSeats": 50,
              "enrolledCount": 15,
              "status": "Active"
            }
            """;

        MvcResult createResult = mockMvc.perform(post("/api/courses")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(createJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.duration", is(2)))
                .andExpect(jsonPath("$.totalSeats", is(50)))
                .andExpect(jsonPath("$.enrolledCount", is(15)))
                .andExpect(jsonPath("$.status", equalTo("Active")))
                .andReturn();

        String createResponseBody = createResult.getResponse().getContentAsString();
        Map<?, ?> createdMap = objectMapper.readValue(createResponseBody, Map.class);
        String courseId = (String) createdMap.get("id");

        String updateJson = """
            {
              "courseCode": "TEST-AI-101",
              "name": "M.Tech AI & Data Analytics (Updated)",
              "department": "CSE",
              "duration": 3,
              "totalSeats": 60,
              "enrolledCount": 20,
              "status": "Active"
            }
            """;

        mockMvc.perform(put("/api/courses/" + courseId)
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("M.Tech AI & Data Analytics (Updated)")))
                .andExpect(jsonPath("$.duration", is(3)))
                .andExpect(jsonPath("$.totalSeats", is(60)))
                .andExpect(jsonPath("$.enrolledCount", is(20)));

        mockMvc.perform(delete("/api/courses/" + courseId)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/courses/" + courseId)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testStudentRoleRestrictedFromMutatingCoursesButCanRead() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String payload = """
            {
              "courseCode": "HACK-101",
              "name": "Unauthorized Course",
              "department": "CSE",
              "duration": 4,
              "totalSeats": 100,
              "enrolledCount": 0
            }
            """;

        mockMvc.perform(post("/api/courses")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/courses/crs_101")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/courses/crs_101")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/courses")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk());
    }
}
