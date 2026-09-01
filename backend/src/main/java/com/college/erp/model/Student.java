package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;

@Document(collection = "students")
public class Student {
    @Id private String id;
    @Indexed(unique = true) private String studentId;
    private String name;
    @Indexed(unique = true) private String email;
    private String department;
    private String course;
    private String batch;
    private double attendancePercent;
    private double gpa;
    private String feeStatus;   // "Paid" | "Partial" | "Overdue"
    private int backlogs;
    private String phone;
    private String parentEmail;
    private String parentUsername;
    private List<String> assignedSubjectCodes;

    // ── Getters & Setters ─────────────────────────────────────────────────
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    public double getAttendancePercent() { return attendancePercent; }
    public void setAttendancePercent(double attendancePercent) { this.attendancePercent = attendancePercent; }
    public double getGpa() { return gpa; }
    public void setGpa(double gpa) { this.gpa = gpa; }
    public String getFeeStatus() { return feeStatus; }
    public void setFeeStatus(String feeStatus) { this.feeStatus = feeStatus; }
    public int getBacklogs() { return backlogs; }
    public void setBacklogs(int backlogs) { this.backlogs = backlogs; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public String getParentUsername() { return parentUsername; }
    public void setParentUsername(String parentUsername) { this.parentUsername = parentUsername; }
    public List<String> getAssignedSubjectCodes() { return assignedSubjectCodes; }
    public void setAssignedSubjectCodes(List<String> assignedSubjectCodes) { this.assignedSubjectCodes = assignedSubjectCodes; }
}
