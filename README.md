# Alma — The Academic Command Center

> *"The academic ERP that actually feels like your campus."*

Alma is a full-stack, role-aware academic administration platform built for higher-education institutions. It combines a warm, daylight-first UI with real JWT-based RBAC enforcement, MongoDB persistence, a predictive student risk engine, and an AI Copilot interface — all in a single coherent system.

---

## What Alma Is

Alma is designed as the operational hub an HoD, faculty member, student, and parent each encounter differently — the same product, but scoped to exactly what each role is authorized to see and do.

- **Admin/HoD** sees institution-wide analytics, fee recovery totals, all student risk profiles, and can approve leaves and trigger advisor alerts
- **Staff/Faculty** see their assigned sections, at-risk students in their courses, and their own leave workflow
- **Student** sees their own attendance, GPA, fee statement, and academic risk summary — no aggregate data visible
- **Parent** sees their linked child's academic record and fee account only (returns 404 for unlinked accounts)

This role differentiation runs through navigation, dashboard KPIs, chart data, export controls, and backend endpoint enforcement — not just label changes.

---

## Key Features

| Feature | Details |
|---|---|
| **Warm Academic UI** | Fraunces serif headings, cobalt/gold accents, daylight-first palette — *Alma* identity, not a generic dark command center |
| **Real JWT Auth** | Spring Security + HMAC-SHA256 JWTs issued by `/api/auth/login`; `JwtAuthenticationFilter` validates on every request |
| **4-Role RBAC** | Super Admin, Admin/HoD, Staff, Student, Parent — enforced backend (`hasAnyRole`) and frontend (nav, data scoping) |
| **MongoDB Persistence** | Active MongoRepositories across 10 collections (Students, Staff, Subjects, Fees, Timetable, Courses, Leaves, RiskScores, CopilotLogs, AuditLogs) |
| **Predictive Risk Radar** | Rule-based predictive risk engine: dynamic dropout & fee default risk calculated on startup and schedule from live attendance, GPA, backlog, and fee arrears data |
| **AI Copilot** | Natural language dispatcher (`/api/copilot/chat`); plain-language answer first, technical trace behind collapsible toggle; `react-markdown` rendering |
| **Live Campus Pulse** | WebSocket (STOMP) real-time alert ticker at `/ws-pulse` broadcasting system mutations (attendance submissions, leave approvals, fee payments) to header strip |
| **Simulated Fee Payment** | Simulated payment gateway (Demo Mode) with client-side PDF receipt generation (`jsPDF`) |
| **Platform-aware Shortcuts** | `Ctrl+K` on Windows/Linux, `⌘K` on Mac — computed from `navigator.userAgentData?.platform` at load time |

---

## Tech Stack

### Frontend
- **React 19** + **Vite** (port 3000)
- **React Router v6** — client-side routing
- **Recharts** — analytics charts
- **react-markdown** — Copilot response rendering
- **Lucide React** — icons
- **jsPDF** — fee receipt & certificate PDF generation
- **Fraunces** (Google Fonts) — serif display typeface
- Vanilla CSS with custom design tokens

### Backend
- **Spring Boot 3** + **Spring Security 6**
- **Spring Data MongoDB** — persistent document storage (`alma_db`)
- **JJWT 0.11.5** — HMAC-SHA256 JWT issuance and validation
- **Spring WebSocket (STOMP)** — live pulse event broadcasting
- **Maven** build system

---

## Project Structure

```
Alma/
├── backend/
│   ├── src/main/java/com/college/erp/
│   │   ├── config/            DataSeeder, WebSocketConfig
│   │   ├── controller/        AttendanceController, AuthController, CopilotController, CourseController,
│   │   │                      FeedbackController, FeeController, LeaveController, ParentController,
│   │   │                      PulseController, ResultsController, RiskController, StaffController,
│   │   │                      StudentController, SubjectController, TimetableController
│   │   ├── model/             Attendance, AuditLog, CopilotLog, Course, Feedback, Fee, Leave, RiskScore,
│   │   │                      Staff, Student, Subject, Timetable
│   │   ├── repository/        10 MongoRepositories
│   │   ├── scheduler/         RiskCalculationScheduler
│   │   ├── security/          JwtService, JwtAuthenticationFilter, SecurityConfig
│   │   └── service/           AuditService
│   ├── src/main/resources/
│   │   └── application.properties   (reads secrets from env — no hardcoded values)
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── copilot/       NexusOrbCopilot.jsx
│   │   │   ├── common/        DataTable, GrowthArc, ...
│   │   │   └── layout/        CommandRail, Layout, TopBar, CampusPulseBar
│   │   ├── context/           AuthContext, PulseContext
│   │   ├── pages/             AnalyticsDashboard, AttendanceModule, AuditLogView, DocumentGenerator,
│   │   │                      FeedbackModule, FeeManagement, LeaveManagement, LiveOccupancy,
│   │   │                      ManageCourses, ManageStaff, ManageStudents, ManageSubjects,
│   │   │                      NotificationsCenter, ParentPortal, ResultsModule, RiskRadar, TimetableGenerator
│   │   └── services/          api.js (REST wrapper with mock fallback guard)
│   └── .env.example
├── docker-compose.yml
└── .gitignore
```

---

## Setup

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- Java 17+, Maven 3.8+
- MongoDB ≥ 6.0 running on `localhost:27017`

### 1. Backend

```bash
cd backend

# Copy and fill in your secrets
cp .env.example .env

# Build
mvn clean package -DskipTests

# Run (Windows PowerShell example)
$env:ALMA_JWT_SECRET="AlmaCampusCommandCenter2025SecretKeyForHMACSHA256MustBe32Bytes!"; java -jar target/erp-backend-2.0.0-SNAPSHOT.jar
```

Backend starts on **http://localhost:8080**

### 2. Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend starts on **http://localhost:3000**

---

## Demo Accounts

Seeded in `AuthController.java` and `DataSeeder.java`:

| Username | Role | Linked Record |
|---|---|---|
| `admin_hod` | Admin / Head of Department | Institution-wide |
| `super_admin` | Super Administrator | Institution-wide |
| `staff_001` | Faculty / Staff | Prof. Marcus Vance |
| `student_001` | Student | Alex Rivera (`CS2024-042`) |
| `student_999` | Student | Unlinked (returns 404 on `/me`) |
| `parent_001` | Parent | Linked to Alex Rivera (`CS2024-042`) |
| `parent_002` | Parent | Unlinked (returns 404 on `/me`) |

---

## Security Notes

- JWT tokens are HMAC-SHA256 signed; secret loaded from `ALMA_JWT_SECRET` env var
- Spring Security's `JwtAuthenticationFilter` verifies tokens on every request; roles come from signed JWT claims
- Endpoint matchers strictly enforce RBAC (`/api/leaves/**` HoD/Admin, `POST /api/feedback/*/reply` Staff/Admin, `/api/parent/me/child` Parent/Admin)
- Data isolation: unlinked students or parents querying `/me` endpoints receive explicit HTTP 404 responses rather than silent data fallbacks
- Tested: student JWT calling admin endpoints → **HTTP 403 Forbidden** with JSON error body

---

## Known Limitations

- **Live Occupancy Directory**: Room capacity display is a static catalog; real-time IoT sensor check-in pipeline is planned for future phases.
- **Simulated Payment Gateway**: Fee management uses a simulated payment modal (Demo Mode) with client-side PDF receipt generation (`jsPDF`).
- **Document Generator**: Certificate publishing renders client-side PDF templates (`jsPDF`); server-side PDF generation is scaffolded.
- **Mac ⌘K Shortcut**: Platform detection works across operating systems; key handling is validated on Windows hardware.