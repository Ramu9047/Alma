package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

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

    public RiskScore() {}

    public RiskScore(String id, String studentId, String studentName, String rollNumber, int dropoutRisk, int feeDefaultRisk, List<RiskFactor> factors, LocalDateTime calculatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.dropoutRisk = dropoutRisk;
        this.feeDefaultRisk = feeDefaultRisk;
        this.factors = factors;
        this.calculatedAt = calculatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public int getDropoutRisk() { return dropoutRisk; }
    public void setDropoutRisk(int dropoutRisk) { this.dropoutRisk = dropoutRisk; }

    public int getFeeDefaultRisk() { return feeDefaultRisk; }
    public void setFeeDefaultRisk(int feeDefaultRisk) { this.feeDefaultRisk = feeDefaultRisk; }

    public List<RiskFactor> getFactors() { return factors; }
    public void setFactors(List<RiskFactor> factors) { this.factors = factors; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }

    public static class RiskFactor {
        private String label;
        private String weight;
        private String value;

        public RiskFactor() {}

        public RiskFactor(String label, String weight, String value) {
            this.label = label;
            this.weight = weight;
            this.value = value;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getWeight() { return weight; }
        public void setWeight(String weight) { this.weight = weight; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }
}
