package com.college.erp.controller;

import com.college.erp.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ResultsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testStudentRoleBlockedFromSubmittingResults() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String payload = """
            {
              "subjectCode": "CS301",
              "records": [
                {
                  "studentId": "CS2024-001",
                  "studentName": "Aarav Sharma",
                  "internal": 25,
                  "external": 65
                }
              ]
            }
            """;

        mockMvc.perform(post("/api/results/bulk")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testStaffCanSubmitBulkResultsAndReadBack() throws Exception {
        String staffToken = jwtService.generateToken("staff_001", "ROLE_STAFF");

        String payload = """
            {
              "subjectCode": "CS301",
              "records": [
                {
                  "studentId": "CS2024-001",
                  "studentName": "Aarav Sharma",
                  "internal": 28,
                  "external": 65
                }
              ]
            }
            """;

        mockMvc.perform(post("/api/results/bulk")
                .header("Authorization", "Bearer " + staffToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count", equalTo(1)))
                .andExpect(jsonPath("$.results[0].total", equalTo(93)))
                .andExpect(jsonPath("$.results[0].grade", equalTo("O")))
                .andExpect(jsonPath("$.results[0].status", equalTo("Pass")));

        mockMvc.perform(get("/api/results?subjectCode=CS301")
                .header("Authorization", "Bearer " + staffToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId", equalTo("CS2024-001")))
                .andExpect(jsonPath("$[0].total", equalTo(93)))
                .andExpect(jsonPath("$[0].grade", equalTo("O")));
    }
}

