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
public class StaffControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testStudentRoleBlockedFromStaffMutations() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String payload = """
            {
              "staffId": "EMP-999",
              "name": "Unauthorized Staff",
              "department": "CSE",
              "email": "unauth@alma.edu"
            }
            """;

        mockMvc.perform(post("/api/staff")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testAdminCanCreateReadAndUpdateStaff() throws Exception {
        String adminToken = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String payload = """
            {
              "staffId": "EMP-TEST-001",
              "name": "Dr. Test Professor",
              "department": "CSE",
              "email": "test.prof@alma.edu",
              "designation": "Associate Professor",
              "phone": "9876543210"
            }
            """;

        MvcResult createResult = mockMvc.perform(post("/api/staff")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.staffId", equalTo("EMP-TEST-001")))
                .andExpect(jsonPath("$.name", equalTo("Dr. Test Professor")))
                .andExpect(jsonPath("$.department", equalTo("CSE")))
                .andExpect(jsonPath("$.email", equalTo("test.prof@alma.edu")))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Map.class);
        String id = (String) created.get("id");

        mockMvc.perform(get("/api/staff/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("Dr. Test Professor")));

        mockMvc.perform(delete("/api/staff/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }
}

