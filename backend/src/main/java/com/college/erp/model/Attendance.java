package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "attendance")
@CompoundIndex(name = "student_date_subject_idx", def = "{'studentId': 1, 'date': 1, 'sessionSubjectCode': 1}", unique = true)
public class Attendance {
    @Id
    private String id;
    private String studentId;
    private String date; // "YYYY-MM-DD"
    private String sessionSubjectCode;
    private boolean present;
    private String markedBy;

    public Attendance() {}

    public Attendance(String studentId, String date, String sessionSubjectCode, boolean present, String markedBy) {
        this.studentId = studentId;
        this.date = date;
        this.sessionSubjectCode = sessionSubjectCode;
        this.present = present;
        this.markedBy = markedBy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSessionSubjectCode() { return sessionSubjectCode; }
    public void setSessionSubjectCode(String sessionSubjectCode) { this.sessionSubjectCode = sessionSubjectCode; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }

    public String getMarkedBy() { return markedBy; }
    public void setMarkedBy(String markedBy) { this.markedBy = markedBy; }
}
