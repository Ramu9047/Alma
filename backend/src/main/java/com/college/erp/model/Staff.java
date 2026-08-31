package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;

@Document(collection = "staff")
public class Staff {
    @Id private String id;
    @Indexed(unique = true) private String staffId;
    private String name;
    @Indexed(unique = true) private String email;
    private String department;
    private String designation;
    private List<String> assignedCourses;
    private String phone;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public List<String> getAssignedCourses() { return assignedCourses; }
    public void setAssignedCourses(List<String> assignedCourses) { this.assignedCourses = assignedCourses; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
