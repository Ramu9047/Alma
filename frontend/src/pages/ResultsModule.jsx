import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download, WifiOff } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';
import { apiService } from '../services/api';

const DEFAULT_MARKS = [
  { rollNumber: 'CS2024-001', name: 'Aarav Sharma', internal: 22, external: 68 },
  { rollNumber: 'CS2024-042', name: 'Alex Rivera', internal: 24, external: 66 },
  { rollNumber: 'EC2024-015', name: 'Ananya Patel', internal: 18, external: 52 },
  { rollNumber: 'AI2024-009', name: 'Rohan Mehta', internal: 23, external: 71 },
  { rollNumber: 'ME2024-003', name: 'Vikram Singh', internal: 14, external: 38 },
];

export default function ResultsModule() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('CS301 (Data Structures)');
  const [marksData, setMarksData] = useState(DEFAULT_MARKS);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function loadResults() {
      const res = await apiService.getResults();
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(s => ({
          rollNumber: s.studentId || 'STD-000',
          name: s.studentName || s.name || 'Student',
          internal: 22,
          external: Math.round((s.gpa / 4.0) * 80)
        }));
        setMarksData(mapped);
      }
      setIsOffline(res.offline);
    }
    loadResults();
  }, []);

  const calculateGrade = (total) => {
    if (total >= 90) return { grade: 'O', status: 'Pass', gpa: 10.0 };
    if (total >= 80) return { grade: 'A+', status: 'Pass', gpa: 9.0 };
    if (total >= 70) return { grade: 'A', status: 'Pass', gpa: 8.0 };
    if (total >= 60) return { grade: 'B+', status: 'Pass', gpa: 7.0 };
    if (total >= 50) return { grade: 'B', status: 'Pass', gpa: 6.0 };
    return { grade: 'F', status: 'Fail', gpa: 0.0 };
  };

  const handleMarkChange = (roll, field, value) => {
    setMarksData(prev =>
      prev.map(item =>
        item.rollNumber === roll ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  const generatePDFReportCard = (student) => {
    const doc = new jsPDF();
    doc.setFillColor(27, 36, 48);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(212, 160, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ALMA ACADEMIC COMMAND CENTER', 14, 20);

    doc.setTextColor(250, 248, 244);
    doc.setFontSize(11);
    doc.text('OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD', 14, 30);

    doc.setTextColor(27, 36, 48);
    doc.setFontSize(11);
    doc.text(`Student Name: ${student.name}`, 14, 50);
    doc.text(`Roll Number: ${student.rollNumber}`, 14, 58);
    doc.text(`Department: Computer Science & Engineering`, 14, 66);
    doc.text(`Term: Spring Session 2026`, 14, 74);

    const total = student.internal + student.external;
    const { grade, status, gpa } = calculateGrade(total);

    doc.autoTable({
      startY: 85,
      head: [['Subject Code', 'Subject Title', 'Internal (30)', 'End-Sem (70)', 'Total (100)', 'Grade', 'Status']],
      body: [
        [selectedSubject.split(' ')[0], selectedSubject, student.internal, student.external, total, grade, status],
        ['CS302', 'Operating Systems', 24, 62, 86, 'A+', 'Pass'],
        ['EC201', 'Analog Electronics', 21, 58, 79, 'A', 'Pass'],
        ['MA201', 'Discrete Mathematics', 25, 65, 90, 'O', 'Pass'],
      ],
      theme: 'striped',
      headStyles: { fillStyle: 'F', fillColor: [27, 36, 48], textColor: [250, 248, 244] },
    });

    doc.save(`Alma_Transcript_${student.rollNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo academic results</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <div className="command-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">Academic Evaluation & Examinations Engine</h2>
            <p className="text-xs text-ink-muted">Gradebook entries, internal evaluation calculation, and transcript dispatch</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-muted">Course Evaluation:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-surface-warm border border-border rounded-xl text-xs font-mono font-semibold text-ink focus:border-cobalt focus:outline-none"
            >
              <option>CS301 (Data Structures)</option>
              <option>CS302 (Operating Systems)</option>
              <option>EC201 (Analog Electronics)</option>
              <option>AI101 (Machine Learning)</option>
            </select>
          </div>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-surface-warm text-ink-muted uppercase border-b border-border">
              <tr>
                <th className="p-3.5">Roll Number</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Internal (30)</th>
                <th className="p-3.5">End-Sem (70)</th>
                <th className="p-3.5">Total (100)</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {marksData.map((row) => {
                const total = row.internal + row.external;
                const { grade, status } = calculateGrade(total);
                return (
                  <tr key={row.rollNumber} className="hover:bg-surface-warm/60">
                    <td className="p-3.5 font-semibold text-cobalt">{row.rollNumber}</td>
                    <td className="p-3.5 font-medium text-ink">{row.name}</td>
                    <td className="p-3.5">
                      <input
                        type="number"
                        max={30}
                        value={row.internal}
                        onChange={(e) => handleMarkChange(row.rollNumber, 'internal', e.target.value)}
                        className="w-16 px-2 py-1 bg-surface border border-border rounded-lg text-ink focus:border-cobalt focus:outline-none text-xs font-mono font-semibold"
                      />
                    </td>
                    <td className="p-3.5">
                      <input
                        type="number"
                        max={70}
                        value={row.external}
                        onChange={(e) => handleMarkChange(row.rollNumber, 'external', e.target.value)}
                        className="w-16 px-2 py-1 bg-surface border border-border rounded-lg text-ink focus:border-cobalt focus:outline-none text-xs font-mono font-semibold"
                      />
                    </td>
                    <td className="p-3.5 font-bold text-ink">{total}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'Pass' ? 'bg-success/10 text-success' : 'bg-risk/10 text-risk'}`}>
                        {grade}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${status === 'Pass' ? 'bg-success/10 text-success border-success/30' : 'bg-risk/10 text-risk border-risk/30'}`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => generatePDFReportCard(row)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-warm text-ink-muted hover:text-cobalt border border-border transition-all text-xs font-mono font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
