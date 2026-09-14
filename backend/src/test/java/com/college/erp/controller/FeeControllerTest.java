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
public class FeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testStudentRoleBlockedFromFeeMutations() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String payload = """
            {
              "studentId": "CS2024-999",
              "studentName": "Unauthorized Student",
              "amount": 100000.0,
              "paid": 0.0,
              "paymentStatus": "Overdue"
            }
            """;

        mockMvc.perform(post("/api/admin/fees")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testAdminCanCreateReadAndUpdateFeeRecord() throws Exception {
        String adminToken = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String payload = """
            {
              "studentId": "CS2024-001",
              "studentName": "Aarav Sharma",
              "amount": 120000.0,
              "paid": 60000.0,
              "paymentStatus": "Partial",
              "dueDate": "2026-09-01",
              "overdueDays": 0,
              "semester": "Spring 2026"
            }
            """;

        MvcResult createResult = mockMvc.perform(post("/api/admin/fees")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentId", equalTo("CS2024-001")))
                .andExpect(jsonPath("$.amount", equalTo(120000.0)))
                .andExpect(jsonPath("$.paid", equalTo(60000.0)))
                .andExpect(jsonPath("$.paymentStatus", equalTo("Partial")))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Map.class);
        String id = (String) created.get("id");

        mockMvc.perform(get("/api/admin/fees/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentId", equalTo("CS2024-001")));

        mockMvc.perform(delete("/api/admin/fees/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }
}

