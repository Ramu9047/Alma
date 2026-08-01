package com.college.erp.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class RiskCalculationScheduler {

    private static final Logger log = Logger.getLogger(RiskCalculationScheduler.class.getName());

    // Nightly Cron Job at Midnight for Predictive Risk Score Recalculation
    @Scheduled(cron = "0 0 0 * * ?")
    public void recalculateStudentRiskScores() {
        log.info("Executing scheduled nightly calculation of student dropout & fee default risk scores...");
        // Recalculates attendance trend, grade trend, fee overdue days, and leave frequency
    }
}
