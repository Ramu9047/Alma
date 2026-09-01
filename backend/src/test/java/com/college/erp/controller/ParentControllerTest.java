package com.college.erp.controller;

import com.college.erp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ParentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    public void testUnlinkedParentGetMyChildReturns404AndNoDataLeak() throws Exception {
        // Authenticated parent with no linked student record
        String token = jwtService.generateToken("parent_002", "ROLE_PARENT");

        mockMvc.perform(get("/api/parent/me/child")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(content().string(not(containsString("CS2024-042"))))
                .andExpect(content().string(not(containsString("Alex Rivera"))));
    }

    @Test
    public void testLinkedParentGetMyChildReturns200WithStudentData() throws Exception {
        // Authenticated parent linked to CS2024-042
        String token = jwtService.generateToken("parent_001", "ROLE_PARENT");

        mockMvc.perform(get("/api/parent/me/child")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("CS2024-042")))
                .andExpect(content().string(containsString("Alex Rivera")));
    }
}
