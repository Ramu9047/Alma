import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';

export default function ResultsModule() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('CS301 (Data Structures)');
  const [marksData, setMarksData] = useState([
    { rollNumber: 'CS2024-001', name: 'Aarav Sharma', internal: 22, external: 68 },
    { rollNumber: 'CS2024-042', name: 'Alex Rivera', internal: 24, external: 66 },
    { rollNumber: 'EC2024-015', name: 'Ananya Patel', internal: 18, external: 52 },
    { rollNumber: 'AI2024-009', name: 'Rohan Mehta', internal: 23, external: 71 },
    { rollNumber: 'ME2024-003', name: 'Vikram Singh', internal: 14, external: 38 },
  ]);

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

    // Alma Institutional Header
    doc.setFillColor(27, 36, 48); // Deep academic navy
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(212, 160, 23); // Gold accent
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ALMA ACADEMIC COMMAND CENTER', 14, 20);

    doc.setTextColor(250, 248, 244);
    doc.setFontSize(11);
    doc.text('OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD', 14, 30);

    // Student Info Block
    doc.setTextColor(27, 36, 48);
    doc.setFontSize(11);
    doc.text(`Student Name: ${student.name}`, 14, 50);
    doc.text(`Roll Number: ${student.rollNumber}`, 14, 58);
    doc.text(`Department: Computer Science & Engineering`, 14, 66);
    doc.text(`Term: Spring Session 2026`, 14, 74);

    // Table Data
    const total = student.internal + student.external;
    const { grade, gpa } = calculateGrade(total);

    doc.autoTable({
      startY: 85,
      head: [['Subject Code', 'Subject Title', 'Internal (30)', 'External (70)', 'Total (100)', 'Grade', 'GPA']],
      body: [
        ['CS301', 'Data Structures & Algorithms', student.internal, student.external, total, grade, gpa.toFixed(1)],
        ['CS302', 'Operating Systems', 21, 62, 83, 'A+', '9.0'],
        ['EC201', 'Analog Circuits & Systems', 19, 58, 77, 'A', '8.0'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [36, 80, 196], textColor: [255, 255, 255] }
    });

    // Signature Footer
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.text('_______________________', 14, finalY);
    doc.text('Controller of Examinations', 14, finalY + 7);
    doc.text('_______________________', 140, finalY);
    doc.text('Dean / HoD Signature', 140, finalY + 7);

    doc.save(`Alma_Transcript_${student.rollNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="command-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">Faculty Marks Entry & Grade Calculation</h2>
            <p className="text-xs text-ink-muted font-mono">
              Role Scoped: <span className="text-cobalt font-semibold">{user?.name}</span> ({user?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-ink-muted">ASSIGNED SUBJECT:</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink"
            >
              <option value="CS301 (Data Structures)">CS301 (Data Structures)</option>
              <option value="CS302 (Operating Systems)">CS302 (Operating Systems)</option>
            </select>
          </div>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        {/* Marks Entry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-surface-warm text-ink-muted uppercase border-b border-border">
              <tr>
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Internal (30)</th>
                <th className="p-3.5">External (70)</th>
                <th className="p-3.5">Total (100)</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5 text-right">Report Card PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {marksData.map(row => {
                const total = row.internal + row.external;
                const { grade, status } = calculateGrade(total);
                return (
                  <tr key={row.rollNumber} className="hover:bg-surface-warm/60">
                    <td className="p-3.5 text-cobalt font-semibold">{row.rollNumber}</td>
                    <td className="p-3.5 text-ink font-sans font-medium">{row.name}</td>
                    <td className="p-3.5">
                      <input
                        type="number"
                        max="30"
                        min="0"
                        value={row.internal}
                        onChange={e => handleMarkChange(row.rollNumber, 'internal', e.target.value)}
                        className="w-16 px-2 py-1 bg-surface-warm border border-border rounded-md text-ink text-xs font-mono"
                      />
                    </td>
                    <td className="p-3.5">
                      <input
                        type="number"
                        max="70"
                        min="0"
                        value={row.external}
                        onChange={e => handleMarkChange(row.rollNumber, 'external', e.target.value)}
                        className="w-16 px-2 py-1 bg-surface-warm border border-border rounded-md text-ink text-xs font-mono"
                      />
                    </td>
                    <td className="p-3.5 font-bold text-ink">{total} / 100</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        status === 'Pass' ? 'bg-success/10 text-success border-success/30' : 'bg-risk/10 text-risk border-risk/30'
                      }`}>
                        {grade} ({status})
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => generatePDFReportCard(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cobalt/10 text-cobalt hover:bg-cobalt hover:text-white transition-all text-xs font-mono font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Transcript</span>
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
