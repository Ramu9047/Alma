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

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testStudentCannotReplyToFeedbackReturns403() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");

        String replyJson = """
            { "text": "Student trying to resolve ticket" }
            """;

        mockMvc.perform(post("/api/feedback/ticket_123/reply")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(replyJson))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testAdminCanReplyToFeedbackReturns200AndResolves() throws Exception {
        String studentToken = jwtService.generateToken("student_001", "ROLE_STUDENT");
        String adminToken = jwtService.generateToken("admin_hod", "ROLE_ADMIN_HOD");

        String createJson = """
            { "subject": "Test Ticket", "content": "Testing reply" }
            """;

        MvcResult createResult = mockMvc.perform(post("/api/feedback")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(createJson))
                .andExpect(status().isCreated())
                .andReturn();

        String bodyStr = createResult.getResponse().getContentAsString();
        Map<?, ?> map = objectMapper.readValue(bodyStr, Map.class);
        String ticketId = (String) map.get("id");

        String replyJson = """
            { "text": "Admin official resolution" }
            """;

        mockMvc.perform(post("/api/feedback/" + ticketId + "/reply")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(replyJson))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Resolved")));
    }
}
