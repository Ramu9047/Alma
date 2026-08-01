import React, { createContext, useContext, useState, useEffect } from 'react';

const PulseContext = createContext();

const INITIAL_PULSE_METRICS = [
  { id: '1', type: 'attendance', text: '142 students present today (92% turnout)' },
  { id: '2', type: 'leaves', text: '3 leave approvals pending HoD review' },
  { id: '3', type: 'fees', text: 'Fee collection 78% for Spring 2026 term' },
  { id: '4', type: 'timetable', text: 'CS-A Lab 3 relocated to Room 402 for Session 4' },
  { id: '5', type: 'results', text: 'Final Semester Results published for Batch 2022-26' },
  { id: '6', type: 'system', text: 'Automated Audit Logging & Backup Active' }
];

export function PulseProvider({ children }) {
  const [metrics, setMetrics] = useState(INITIAL_PULSE_METRICS);

  // Dynamic simulation of incoming real-time operational updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAttendance = 140 + Math.floor(Math.random() * 15);
      const randomFeePct = 78 + Math.floor(Math.random() * 3);
      setMetrics(prev => [
        { id: '1', type: 'attendance', text: `${randomAttendance} students present today (${Math.round((randomAttendance/155)*100)}% turnout)` },
        { id: '2', type: 'leaves', text: `${Math.floor(Math.random() * 4) + 1} leave approvals pending HoD review` },
        { id: '3', type: 'fees', text: `Fee collection ${randomFeePct}% for Spring 2026 term` },
        ...prev.slice(3)
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const pushPulseAlert = (newAlert) => {
    setMetrics(prev => [{ id: `alert_${Date.now()}`, type: 'alert', text: newAlert }, ...prev]);
  };

  return (
    <PulseContext.Provider value={{ metrics, pushPulseAlert }}>
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
