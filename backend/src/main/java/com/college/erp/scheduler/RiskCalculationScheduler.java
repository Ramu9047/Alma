package com.college.erp.scheduler;

import com.college.erp.model.Fee;
import com.college.erp.model.RiskScore;
import com.college.erp.model.Student;
import com.college.erp.repository.FeeRepository;
import com.college.erp.repository.RiskScoreRepository;
import com.college.erp.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class RiskCalculationScheduler {

    private static final Logger log = LoggerFactory.getLogger(RiskCalculationScheduler.class);

    private final StudentRepository studentRepo;
    private final FeeRepository feeRepo;
    private final RiskScoreRepository riskScoreRepo;

    public RiskCalculationScheduler(StudentRepository studentRepo, FeeRepository feeRepo, RiskScoreRepository riskScoreRepo) {
        this.studentRepo = studentRepo;
        this.feeRepo = feeRepo;
        this.riskScoreRepo = riskScoreRepo;
    }

    // Run on startup ready AND scheduled nightly at midnight
    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 0 0 * * ?")
    public void recalculateStudentRiskScores() {
        log.info("Executing risk score recalculation from real Mongo Student and Fee data...");
        List<Student> students = studentRepo.findAll();

        for (Student s : students) {
            int dropoutRisk = 0;
            int feeDefaultRisk = 0;
            List<RiskScore.RiskFactor> factors = new ArrayList<>();

            // Attendance factor
            if (s.getAttendancePercent() < 70) {
                dropoutRisk += 50;
                factors.add(new RiskScore.RiskFactor("Critical Attendance", "HIGH", s.getAttendancePercent() + "%"));
            } else if (s.getAttendancePercent() < 75) {
                dropoutRisk += 30;
                factors.add(new RiskScore.RiskFactor("Low Attendance", "MEDIUM", s.getAttendancePercent() + "%"));
            }

            // GPA factor
            if (s.getGpa() < 2.5) {
                dropoutRisk += 30;
                factors.add(new RiskScore.RiskFactor("Low Academic GPA", "HIGH", String.valueOf(s.getGpa())));
            } else if (s.getGpa() < 3.0) {
                dropoutRisk += 15;
                factors.add(new RiskScore.RiskFactor("Below Avg GPA", "LOW", String.valueOf(s.getGpa())));
            }

            // Backlog factor
            if (s.getBacklogs() > 0) {
                dropoutRisk += s.getBacklogs() * 10;
                factors.add(new RiskScore.RiskFactor("Active Backlogs", "MEDIUM", s.getBacklogs() + " subjects"));
            }

            // Fee factor
            List<Fee> sFees = feeRepo.findByStudentId(s.getStudentId());
            for (Fee f : sFees) {
                if ("Overdue".equalsIgnoreCase(f.getPaymentStatus()) || f.getOverdueDays() > 0) {
                    feeDefaultRisk += Math.min(85, 20 + f.getOverdueDays() * 2);
                    factors.add(new RiskScore.RiskFactor("Overdue Fees", "HIGH", f.getOverdueDays() + " days overdue"));
                }
            }

            dropoutRisk = Math.min(100, dropoutRisk);
            feeDefaultRisk = Math.min(100, feeDefaultRisk);

            RiskScore risk = riskScoreRepo.findByStudentId(s.getStudentId()).orElseGet(RiskScore::new);
            risk.setStudentId(s.getStudentId());
            risk.setStudentName(s.getName());
            risk.setRollNumber(s.getStudentId());
            risk.setDropoutRisk(dropoutRisk);
            risk.setFeeDefaultRisk(feeDefaultRisk);
            risk.setFactors(factors);
            risk.setCalculatedAt(LocalDateTime.now());

            riskScoreRepo.save(risk);
        }
        log.info("Risk calculation complete. Updated {} student risk profiles in MongoDB.", students.size());
    }
}
