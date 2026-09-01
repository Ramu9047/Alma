package com.college.erp.config;

import com.college.erp.model.*;
import com.college.erp.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final StudentRepository studentRepo;
    private final StaffRepository staffRepo;
    private final SubjectRepository subjectRepo;
    private final FeeRepository feeRepo;
    private final CourseRepository courseRepo;
    private final LeaveRepository leaveRepo;
    private final TimetableRepository timetableRepo;

    public DataSeeder(StudentRepository studentRepo, StaffRepository staffRepo,
                      SubjectRepository subjectRepo, FeeRepository feeRepo,
                      CourseRepository courseRepo, LeaveRepository leaveRepo,
                      TimetableRepository timetableRepo) {
        this.studentRepo = studentRepo;
        this.staffRepo = staffRepo;
        this.subjectRepo = subjectRepo;
        this.feeRepo = feeRepo;
        this.courseRepo = courseRepo;
        this.leaveRepo = leaveRepo;
        this.timetableRepo = timetableRepo;
    }

    @Override
    public void run(String... args) {
        seedStudents();
        seedStaff();
        seedSubjects();
        seedFees();
        seedCourses();
        seedLeaves();
        seedTimetable();
    }

    private void seedStudents() {
        if (studentRepo.count() > 0) { log.info("Students already seeded — skipping"); return; }
        Student s1 = student("CS2024-042", "Alex Rivera",      "alex@alma.edu",    "CSE", "B.Tech CSE",          "2024", 88.0, 3.6, "Paid",    0, "9900001111", "parent1@alma.edu", "parent_001");
        studentRepo.saveAll(List.of(
            s1,
            student("EC2023-017", "Ananya Patel",     "ananya@alma.edu",  "ECE", "B.Tech ECE",          "2023", 74.0, 2.9, "Partial", 1, "9900002222", "parent2@alma.edu", "parent_002"),
            student("ME2023-031", "Vikram Singh",     "vikram@alma.edu",  "ME",  "B.Tech Mech",         "2023", 62.0, 2.4, "Overdue", 2, "9900003333", "parent3@alma.edu", "parent_003"),
            student("CS2024-055", "Priya Sharma",     "priya@alma.edu",   "CSE", "B.Tech CSE",          "2024", 91.0, 3.8, "Paid",    0, "9900004444", "parent4@alma.edu", "parent_004"),
            student("EC2024-008", "Rahul Nair",       "rahul@alma.edu",   "ECE", "B.Tech ECE",          "2024", 95.0, 3.9, "Paid",    0, "9900005555", "parent5@alma.edu", "parent_005"),
            student("ME2024-022", "Sneha Iyer",       "sneha@alma.edu",   "ME",  "B.Tech Mech",         "2024", 79.0, 3.1, "Paid",    0, "9900006666", "parent6@alma.edu", "parent_006"),
            student("CS2023-011", "Arjun Mehta",      "arjun@alma.edu",   "CSE", "B.Tech CSE",          "2023", 85.0, 3.5, "Paid",    0, "9900007777", "parent7@alma.edu", "parent_007"),
            student("EC2024-033", "Divya Krishnan",   "divya@alma.edu",   "ECE", "B.Tech ECE",          "2024", 72.0, 2.7, "Overdue", 1, "9900008888", "parent8@alma.edu", "parent_008")
        ));
        log.info("Seeded {} students", studentRepo.count());
    }

    private Student student(String studentId, String name, String email, String dept,
                            String course, String batch, double att, double gpa,
                            String feeStatus, int backlogs, String phone, String parentEmail, String parentUsername) {
        Student s = new Student();
        s.setStudentId(studentId); s.setName(name); s.setEmail(email);
        s.setDepartment(dept); s.setCourse(course); s.setBatch(batch);
        s.setAttendancePercent(att); s.setGpa(gpa); s.setFeeStatus(feeStatus);
        s.setBacklogs(backlogs); s.setPhone(phone); s.setParentEmail(parentEmail);
        s.setParentUsername(parentUsername);
        return s;
    }

    private void seedStaff() {
        if (staffRepo.count() > 0) { log.info("Staff already seeded — skipping"); return; }
        staffRepo.saveAll(List.of(
            staff("FAC-001", "Prof. Marcus Vance",  "marcus@alma.edu",  "CSE", "Associate Professor", List.of("CS301","CS401")),
            staff("FAC-002", "Dr. Lakshmi Narayan", "lakshmi@alma.edu", "ECE", "Professor",           List.of("EC201","EC301")),
            staff("FAC-003", "Mr. Suresh Babu",     "suresh@alma.edu",  "ME",  "Assistant Professor", List.of("ME101","ME201")),
            staff("FAC-004", "Dr. Meena Pillai",    "meena@alma.edu",   "CSE", "Professor",           List.of("CS101","CS201"))
        ));
        log.info("Seeded {} staff", staffRepo.count());
    }

    private Staff staff(String staffId, String name, String email, String dept,
                        String designation, List<String> courses) {
        Staff s = new Staff();
        s.setStaffId(staffId); s.setName(name); s.setEmail(email);
        s.setDepartment(dept); s.setDesignation(designation); s.setAssignedCourses(courses);
        return s;
    }

    private void seedSubjects() {
        if (subjectRepo.count() > 0) { log.info("Subjects already seeded — skipping"); return; }
        subjectRepo.saveAll(List.of(
            subject("CS101", "Introduction to Programming", "CSE", 4, "FAC-004"),
            subject("CS201", "Data Structures",             "CSE", 4, "FAC-004"),
            subject("CS301", "Operating Systems",           "CSE", 3, "FAC-001"),
            subject("CS401", "Computer Networks",           "CSE", 3, "FAC-001"),
            subject("EC201", "Digital Electronics",         "ECE", 4, "FAC-002"),
            subject("EC301", "VLSI Design",                 "ECE", 3, "FAC-002"),
            subject("ME101", "Engineering Drawing",         "ME",  2, "FAC-003"),
            subject("ME201", "Thermodynamics",              "ME",  4, "FAC-003")
        ));
        log.info("Seeded {} subjects", subjectRepo.count());
    }

    private Subject subject(String code, String name, String dept, int credits, String facultyId) {
        Subject s = new Subject();
        s.setSubjectCode(code); s.setName(name); s.setDepartment(dept);
        s.setCredits(credits); s.setAssignedFacultyId(facultyId);
        return s;
    }

    private void seedFees() {
        if (feeRepo.count() > 0) { log.info("Fees already seeded — skipping"); return; }
        feeRepo.saveAll(List.of(
            fee("CS2024-042", "Alex Rivera",    120000, 120000, "2026-01-15", 0,  "Spring 2026", "Paid"),
            fee("EC2023-017", "Ananya Patel",   115000, 57500,  "2026-01-15", 15, "Spring 2026", "Partial"),
            fee("ME2023-031", "Vikram Singh",   118000, 50000,  "2026-01-15", 36, "Spring 2026", "Overdue"),
            fee("CS2024-055", "Priya Sharma",   120000, 120000, "2026-01-15", 0,  "Spring 2026", "Paid"),
            fee("EC2024-008", "Rahul Nair",     115000, 115000, "2026-01-15", 0,  "Spring 2026", "Paid"),
            fee("ME2024-022", "Sneha Iyer",     118000, 118000, "2026-01-15", 0,  "Spring 2026", "Paid"),
            fee("CS2023-011", "Arjun Mehta",    120000, 120000, "2026-01-15", 0,  "Spring 2026", "Paid"),
            fee("EC2024-033", "Divya Krishnan", 115000, 0,      "2026-01-15", 46, "Spring 2026", "Overdue")
        ));
        log.info("Seeded {} fee records", feeRepo.count());
    }

    private Fee fee(String studentId, String name, double amount, double paid,
                    String due, int overdue, String semester, String status) {
        Fee f = new Fee();
        f.setStudentId(studentId); f.setStudentName(name); f.setAmount(amount);
        f.setPaid(paid); f.setDueDate(due); f.setOverdueDays(overdue);
        f.setSemester(semester); f.setPaymentStatus(status);
        return f;
    }

    private void seedCourses() {
        if (courseRepo.count() > 0) { log.info("Courses already seeded — skipping"); return; }
        courseRepo.saveAll(List.of(
            course("BTECH-CSE", "B.Tech Computer Science & Engineering", "CSE", 4, 120, 98),
            course("BTECH-ECE", "B.Tech Electronics & Communication",    "ECE", 4, 90,  72),
            course("BTECH-ME",  "B.Tech Mechanical Engineering",         "ME",  4, 80,  65),
            course("MBA-GEN",   "MBA General Management",                "MBA", 2, 60,  58)
        ));
        log.info("Seeded {} courses", courseRepo.count());
    }

    private Course course(String code, String name, String dept, int duration, int seats, int enrolled) {
        Course c = new Course();
        c.setCourseCode(code); c.setName(name); c.setDepartment(dept);
        c.setDuration(duration); c.setTotalSeats(seats); c.setEnrolledCount(enrolled);
        return c;
    }

    private void seedLeaves() {
        if (leaveRepo.count() > 0) { log.info("Leaves already seeded — skipping"); return; }
        Leave l = new Leave();
        l.setLeaveId("lev_01");
        l.setApplicantUsername("staff_001");
        l.setApplicantName("Prof. Marcus Vance");
        l.setApplicantRole("STAFF");
        l.setLeaveType("Medical Leave");
        l.setStartDate("2026-07-25");
        l.setEndDate("2026-07-27");
        l.setReason("Medical appointment");
        l.setStatus("PENDING");
        leaveRepo.save(l);
        log.info("Seeded {} leave records", leaveRepo.count());
    }

    private void seedTimetable() {
        if (timetableRepo.count() > 0) { log.info("Timetable already seeded — skipping"); return; }
        timetableRepo.saveAll(List.of(
            tt("CSE", "Monday",    "09:00-10:00", "CS301", "FAC-001", "LAB-A"),
            tt("CSE", "Monday",    "10:00-11:00", "CS401", "FAC-001", "LH-101"),
            tt("CSE", "Tuesday",   "09:00-10:00", "CS101", "FAC-004", "LH-102"),
            tt("ECE", "Monday",    "09:00-10:00", "EC201", "FAC-002", "LH-201"),
            tt("ECE", "Wednesday", "11:00-12:00", "EC301", "FAC-002", "LAB-B"),
            tt("ME",  "Thursday",  "09:00-10:00", "ME101", "FAC-003", "DRAW-HALL"),
            tt("ME",  "Friday",    "10:00-11:00", "ME201", "FAC-003", "LH-301")
        ));
        log.info("Seeded {} timetable entries", timetableRepo.count());
    }

    private Timetable tt(String dept, String day, String slot, String subj, String faculty, String room) {
        Timetable t = new Timetable();
        t.setDepartment(dept); t.setDay(day); t.setTimeSlot(slot);
        t.setSubjectCode(subj); t.setFacultyId(faculty); t.setRoom(room);
        return t;
    }
}
