package com.college.erp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "timetables")
public class Timetable {
    @Id private String id;
    private String department;
    private String day;         // "Monday" … "Saturday"
    private String timeSlot;    // "09:00-10:00"
    private String subjectCode;
    private String facultyId;
    private String room;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
}
