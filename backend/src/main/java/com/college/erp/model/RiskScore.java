package com.college.erp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "riskScores")
public class RiskScore {

    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String rollNumber;
    private int dropoutRisk;
    private int feeDefaultRisk;
    private List<RiskFactor> factors;
    private LocalDateTime calculatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskFactor {
        private String label;
        private String weight;
        private String value;
    }
}
