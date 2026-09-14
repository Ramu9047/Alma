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
public class TimetableControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testStudentRoleBlockedFromTimetableMutations() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String payload = """
            {
              "department": "CSE",
              "day": "Monday",
              "timeSlot": "09:00-10:00",
              "subjectCode": "CS301",
              "room": "LAB-1"
            }
            """;

        mockMvc.perform(post("/api/admin/timetable")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testAdminCanCreateReadAndDeleteTimetableEntry() throws Exception {
        String adminToken = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String payload = """
            {
              "department": "CSE",
              "day": "Tuesday",
              "timeSlot": "11:00-12:00",
              "subjectCode": "CS301",
              "facultyId": "EMP-901",
              "room": "LAB-B"
            }
            """;

        MvcResult createResult = mockMvc.perform(post("/api/admin/timetable")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.department", equalTo("CSE")))
                .andExpect(jsonPath("$.day", equalTo("Tuesday")))
                .andExpect(jsonPath("$.timeSlot", equalTo("11:00-12:00")))
                .andExpect(jsonPath("$.room", equalTo("LAB-B")))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Map.class);
        String id = (String) created.get("id");

        mockMvc.perform(get("/api/admin/timetable/department/CSE")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/admin/timetable/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }
}

