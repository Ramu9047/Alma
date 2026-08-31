package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "subjects")
public class Subject {
    @Id private String id;
    @Indexed(unique = true) private String subjectCode;
    private String name;
    private String department;
    private int credits;
    private String assignedFacultyId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }
    public String getAssignedFacultyId() { return assignedFacultyId; }
    public void setAssignedFacultyId(String assignedFacultyId) { this.assignedFacultyId = assignedFacultyId; }
}
