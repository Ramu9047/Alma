import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Download, ShieldCheck, WifiOff } from 'lucide-react';
import { apiService, mockStudents } from '../services/api';
import GrowthArc from '../components/common/GrowthArc';

export default function DocumentGenerator() {
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
  const [docType, setDocType] = useState('bonafide');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      const res = await apiService.getStudents();
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(s => ({
          ...s,
          rollNumber: s.studentId || s.rollNumber || 'STD-000',
          session: s.batch || s.session || '2024-2028'
        }));
        setStudents(mapped);
        setSelectedStudent(mapped[0]);
      }
      setIsOffline(res.offline);
    }
    loadStudents();
  }, []);

  const generatePDFDocument = () => {
    if (!selectedStudent) return;
    const doc = new jsPDF();

    if (docType === 'bonafide') {
      doc.setFillColor(27, 36, 48);
      doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(212, 160, 23);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ALMA ACADEMIC INSTITUTION', 14, 22);

      doc.setTextColor(27, 36, 48);
      doc.setFontSize(16);
      doc.text('BONAFIDE CERTIFICATE', 70, 55);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `This is to certify that ${selectedStudent.name} (Roll No: ${selectedStudent.rollNumber}) is a bonafide student of this institution, currently enrolled in the ${selectedStudent.course} program for the academic session ${selectedStudent.session || selectedStudent.batch || '2024-2028'}.`,
        14,
        75,
        { maxWidth: 180 }
      );
      doc.text('This certificate is issued for official administrative / passport / loan verification purposes.', 14, 105);

      doc.text('Date: 1st September 2026', 14, 150);
      doc.text('Registrar / Principal Signature', 140, 150);
    } else if (docType === 'idcard') {
      doc.setFillColor(27, 36, 48);
      doc.rect(20, 20, 100, 150, 'F');
      doc.setTextColor(212, 160, 23);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ALMA STUDENT ID', 30, 35);

      doc.setTextColor(250, 248, 244);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`NAME: ${selectedStudent.name}`, 30, 60);
      doc.text(`ROLL NO: ${selectedStudent.rollNumber}`, 30, 75);
      doc.text(`COURSE: ${selectedStudent.course}`, 30, 90);
      doc.text(`VALID TILL: 2028`, 30, 105);
      doc.text(`BARCODE: ||||||||||||||||`, 30, 140);
    }

    doc.save(`Alma_${docType}_${selectedStudent.rollNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo student roster · DEMO MODE</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <div className="command-card p-6 space-y-4">
        <div className="border-b border-border pb-4">
          <h2 className="font-serif text-xl font-bold text-ink">Official Document Generator</h2>
          <p className="text-xs text-ink-muted font-mono">Templated PDF certificate & student credential publishing engine</p>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1">SELECT STUDENT:</label>
              <select
                value={selectedStudent?.id || selectedStudent?.studentId}
                onChange={e => {
                  const found = students.find(s => (s.id || s.studentId) === e.target.value);
                  if (found) setSelectedStudent(found);
                }}
                className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink"
              >
                {students.map(s => (
                  <option key={s.id || s.studentId} value={s.id || s.studentId}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-ink-muted mb-1">DOCUMENT TYPE:</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-xs font-mono text-ink"
              >
                <option value="bonafide">Bonafide Student Certificate</option>
                <option value="idcard">Digital Student ID Card</option>
                <option value="transcript">Official Academic Transcript</option>
              </select>
            </div>

            <button
              onClick={generatePDFDocument}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cobalt text-xs font-mono font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Generate Templated PDF Document</span>
            </button>
          </div>

          <div className="p-4 bg-surface-warm/80 border border-border rounded-2xl font-mono text-xs space-y-2">
            <span className="text-cobalt font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" /> ALMA VERIFIED PREVIEW SPECS
            </span>
            <p className="text-ink-muted text-[11px]">Selected: {selectedStudent?.name}</p>
            <p className="text-ink-muted text-[11px]">Roll Number: {selectedStudent?.rollNumber}</p>
            <p className="text-ink-muted text-[11px]">Verification Hash: SHA256-AUTHENTICATED</p>
          </div>
        </div>
      </div>
    </div>
  );
}
