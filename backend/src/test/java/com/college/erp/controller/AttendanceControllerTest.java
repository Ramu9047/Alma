package com.college.erp.controller;

import com.college.erp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    public void testUnlinkedStudentGetMySummaryReturns404AndNoDataLeak() throws Exception {
        // Authenticated user with no linked student record
        String token = jwtService.generateToken("student_999", "ROLE_STUDENT");

        mockMvc.perform(get("/api/attendance/me/summary")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(content().string(not(containsString("CS2024-042"))))
                .andExpect(content().string(not(containsString("Alex Rivera"))));
    }

    @Test
    public void testBulkAttendanceSubmissionAndStudentSummary() throws Exception {
        String token = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String bulkJson = """
            {
              "date": "2026-09-01",
              "subjectCode": "CS301",
              "records": [
                { "studentId": "CS2024-042", "present": true },
                { "studentId": "EC2023-017", "present": false }
              ]
            }
            """;

        mockMvc.perform(post("/api/attendance/bulk")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(bulkJson))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/attendance/student/CS2024-042/summary")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("CS2024-042")));
    }
}
