package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

@Document(collection = "results")
@CompoundIndex(name = "std_subject_idx", def = "{'studentId': 1, 'subjectCode': 1}", unique = true)
public class Result {
    @Id private String id;
    private String studentId;
    private String studentName;
    private String subjectCode;
    private int internal;
    private int external;
    private int total;
    private String grade;
    private String status;
    private String semester = "Spring 2026";
    private String enteredBy;
    private String updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public int getInternal() { return internal; }
    public void setInternal(int internal) { this.internal = internal; }

    public int getExternal() { return external; }
    public void setExternal(int external) { this.external = external; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getEnteredBy() { return enteredBy; }
    public void setEnteredBy(String enteredBy) { this.enteredBy = enteredBy; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
