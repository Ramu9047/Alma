import React, { useState, useEffect } from 'react';
import DataTable from '../components/common/DataTable';
import { jsPDF } from 'jspdf';
import { apiService, mockFees } from '../services/api';
import { DollarSign, CreditCard, Download, ShieldCheck, AlertTriangle, Lock, WifiOff } from 'lucide-react';
import { usePulse } from '../context/PulseContext';
import { useAuth, ROLES } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';

export default function FeeManagement() {
  const { pushPulseAlert } = usePulse();
  const { user } = useAuth();
  const role = user?.role;

  const isRestricted = (role === ROLES.STUDENT || role === ROLES.PARENT);
  const [feesList, setFeesList] = useState([]);
  const [isOffline, setIsOffline] = useState(false);

  const [paymentModalStudent, setPaymentModalStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadFees = async () => {
    const res = await apiService.getFees();
    const list = res.data || mockFees;
    setFeesList(isRestricted ? list.filter(f => f.studentId === 'CS2024-042') : list);
    setIsOffline(res.offline);
  };

  useEffect(() => {
    loadFees();
  }, [role]);

  const handleOpenPayGateway = (student) => {
    setPaymentModalStudent(student);
    const due = (student.amount || student.totalAmount || 0) - (student.paid || student.paidAmount || 0);
    setPayAmount(due);
  };

  const handleSimulatePayment = async () => {
    setProcessing(true);
    const amountNum = Number(payAmount);

    await apiService.payFee(paymentModalStudent.id || paymentModalStudent.studentId, amountNum);

    pushPulseAlert(`Fee Payment of ₹${payAmount} processed via Simulated Gateway for ${paymentModalStudent.studentName || paymentModalStudent.name}`);
    setProcessing(false);
    generateReceiptPDF(paymentModalStudent, payAmount);
    setPaymentModalStudent(null);
    loadFees();
  };

  const generateReceiptPDF = (student, amount) => {
    const doc = new jsPDF();
    doc.setFillColor(27, 36, 48);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(212, 160, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('ALMA ACADEMIC COMMAND CENTER — RECEIPT', 14, 22);

    doc.setTextColor(27, 36, 48);
    doc.setFontSize(11);
    doc.text(`Receipt Reference: ALMA-REC-${Date.now()}`, 14, 48);
    doc.text(`Student Name: ${student.studentName || student.name}`, 14, 56);
    doc.text(`Roll Number: ${student.studentId || student.rollNumber}`, 14, 64);
    doc.text(`Course: ${student.semester || 'B.Tech CSE'}`, 14, 72);
    doc.text(`Amount Paid: ₹${amount}`, 14, 80);
    doc.text(`Payment Gateway Mode: Simulated Payment (Demo Mode)`, 14, 88);
    doc.text(`Transaction Status: SUCCESSFUL`, 14, 96);

    doc.save(`Alma_Receipt_${student.studentId || student.rollNumber}.pdf`);
  };

  const columns = [
    { header: 'Roll No', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.studentId || r.rollNumber}</span> },
    { header: 'Student Name', render: (r) => <span className="font-medium text-ink">{r.studentName || r.name}</span> },
    { header: 'Semester', render: (r) => <span className="font-mono text-ink-muted">{r.semester || 'Spring 2026'}</span> },
    { header: 'Total Fee', render: (r) => <span className="font-mono text-ink">₹{(r.amount || r.totalAmount || 0).toLocaleString()}</span> },
    { header: 'Paid Fee', render: (r) => <span className="font-mono text-success font-semibold">₹{(r.paid || r.paidAmount || 0).toLocaleString()}</span> },
    {
      header: 'Fee Status',
      render: (r) => {
        const st = r.paymentStatus || r.status || 'Pending';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
            st === 'Paid' ? 'bg-success/10 text-success border-success/30' :
            st === 'Partial' ? 'bg-warning/10 text-warning border-warning/30' :
            'bg-risk/10 text-risk border-risk/30'
          }`}>
            {st}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (r) => {
        const paid = r.paid || r.paidAmount || 0;
        const total = r.amount || r.totalAmount || 0;
        return (
          <div className="flex items-center gap-2">
            {paid < total && (
              <button
                onClick={() => handleOpenPayGateway(r)}
                className="px-3 py-1 rounded-xl btn-cobalt text-xs font-mono flex items-center gap-1 font-semibold"
              >
                <CreditCard className="w-3.5 h-3.5" /> Pay Online
              </button>
            )}
            {paid > 0 && (
              <button
                onClick={() => generateReceiptPDF(r, paid)}
                className="px-2.5 py-1 rounded-xl bg-surface-warm text-ink-muted hover:text-cobalt border border-border transition-all text-xs font-mono flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" /> Receipt
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo fee ledger</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <div className="command-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">
            {isRestricted ? 'My Fee Account' : 'Fee & Finance — Collection Ledger'}
          </h2>
          <p className="text-xs text-ink-muted">
            {isRestricted
              ? `Viewing fee statement for ${user?.name}`
              : 'Institution-wide fee structure, payment tracking & gateway integration'}
          </p>
        </div>
        {isRestricted && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cobalt/5 border border-cobalt/20 text-cobalt text-xs font-mono">
            <Lock className="w-3 h-3" /> Scoped to your record
          </span>
        )}
      </div>

      <GrowthArc mode="divider" variant="cobalt" />

      <DataTable
        title={isRestricted ? 'My Fee Statement' : 'Fee Management & Collection Ledger'}
        subtitle={isRestricted ? `Personal fee account for ${user?.name}` : 'Course fee structure, payment tracking, PDF receipt generation, and payment gateway'}
        columns={columns}
        data={feesList}
      />

      {/* Simulated Payment (Demo Mode) Modal — renamed per Item 11 Option B */}
      {paymentModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
          <div className="command-card w-full max-w-md bg-surface p-6 shadow-warm-lg space-y-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cobalt" />
                <h3 className="font-serif font-bold text-ink text-lg">Simulated Payment (Demo Mode)</h3>
              </div>
              <span className="text-[10px] font-mono bg-cobalt/10 text-cobalt px-2 py-0.5 rounded-full font-semibold">DEMO MODE</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-ink-muted">STUDENT:</span>
                <span className="text-ink font-semibold ml-2">{paymentModalStudent.studentName || paymentModalStudent.name}</span>
              </div>
              <div>
                <span className="text-ink-muted">DUE BALANCE:</span>
                <span className="text-risk font-semibold ml-2">₹{((paymentModalStudent.amount || paymentModalStudent.totalAmount || 0) - (paymentModalStudent.paid || paymentModalStudent.paidAmount || 0)).toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-ink-muted mb-1">ENTER PAYMENT AMOUNT (₹):</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-warm border border-border rounded-xl text-ink font-semibold text-sm focus:border-cobalt focus:outline-none"
                />
              </div>

              <div className="p-3 bg-surface-warm rounded-xl border border-border text-[11px] text-ink-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>Simulated Encrypted Gateway Checkout (Demo Mode)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setPaymentModalStudent(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-ink-muted hover:text-ink hover:bg-surface-warm"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulatePayment}
                disabled={processing}
                className="px-5 py-2 rounded-xl btn-cobalt font-semibold text-xs flex items-center gap-2"
              >
                {processing ? 'Processing Payment...' : `Pay ₹${payAmount} Now`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
