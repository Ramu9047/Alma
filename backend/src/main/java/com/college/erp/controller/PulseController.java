package com.college.erp.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class PulseController {

    @MessageMapping("/pulse/ping")
    @SendTo("/topic/pulse")
    public Map<String, Object> handlePing(Map<String, String> payload) {
        return Map.of(
            "id", "ping_" + System.currentTimeMillis(),
            "action", "PULSE_PING",
            "message", payload.getOrDefault("message", "Client STOMP Pulse Ping"),
            "timestamp", LocalDateTime.now().toString()
        );
    }
}
