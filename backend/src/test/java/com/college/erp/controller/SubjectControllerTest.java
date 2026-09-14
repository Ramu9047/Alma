package com.college.erp.controller;

import com.college.erp.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SubjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testStudentRoleBlockedFromSubjectMutations() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String payload = """
            {
              "subjectCode": "TEST999",
              "name": "Unauthorized Subject",
              "department": "CSE",
              "credits": 4
            }
            """;

        mockMvc.perform(post("/api/admin/subjects")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testAdminCanCreateReadAndDeleteSubject() throws Exception {
        String adminToken = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String payload = """
            {
              "subjectCode": "CS901",
              "name": "Advanced Neural Architectures",
              "department": "CSE",
              "credits": 4,
              "assignedFacultyId": "EMP-901"
            }
            """;

        MvcResult createResult = mockMvc.perform(post("/api/admin/subjects")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.subjectCode", equalTo("CS901")))
                .andExpect(jsonPath("$.name", equalTo("Advanced Neural Architectures")))
                .andExpect(jsonPath("$.credits", equalTo(4)))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Map.class);
        String id = (String) created.get("id");

        mockMvc.perform(get("/api/admin/subjects/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subjectCode", equalTo("CS901")));

        mockMvc.perform(delete("/api/admin/subjects/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }
}

