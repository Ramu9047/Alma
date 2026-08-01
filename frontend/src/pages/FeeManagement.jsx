import React, { useState } from 'react';
import DataTable from '../components/common/DataTable';
import { jsPDF } from 'jspdf';
import { mockFees } from '../services/api';
import { DollarSign, CreditCard, Download, ShieldCheck, AlertTriangle, Lock } from 'lucide-react';
import { usePulse } from '../context/PulseContext';
import { useAuth, ROLES } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';

export default function FeeManagement() {
  const { pushPulseAlert } = usePulse();
  const { user } = useAuth();
  const role = user?.role;

  // Students/Parents see only their own record; Admin/HoD see all
  const MY_ROLL = 'CS2024-042'; // Alex Rivera — matches the demo student
  const isRestricted = (role === ROLES.STUDENT || role === ROLES.PARENT);
  const allFees = mockFees;
  const [feesList, setFeesList] = useState(
    isRestricted ? mockFees.filter(f => f.rollNumber === MY_ROLL) : mockFees
  );
  const [paymentModalStudent, setPaymentModalStudent] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleOpenPayGateway = (student) => {
    setPaymentModalStudent(student);
    setPayAmount(student.totalAmount - student.paidAmount);
  };

  const handleSimulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setFeesList(prev =>
        prev.map(f => {
          if (f.id === paymentModalStudent.id) {
            const updatedPaid = f.paidAmount + Number(payAmount);
            return {
              ...f,
              paidAmount: updatedPaid,
              status: updatedPaid >= f.totalAmount ? 'Paid' : 'Partial'
            };
          }
          return f;
        })
      );

      pushPulseAlert(`Fee Payment of ₹${payAmount} processed via Razorpay Sandbox for ${paymentModalStudent.studentName}`);
      setProcessing(false);
      generateReceiptPDF(paymentModalStudent, payAmount);
      setPaymentModalStudent(null);
    }, 1500);
  };

  const generateReceiptPDF = (student, amount) => {
    const doc = new jsPDF();
    doc.setFillColor(27, 36, 48); // Deep academic navy
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(212, 160, 23); // Gold accent
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('ALMA ACADEMIC COMMAND CENTER — RECEIPT', 14, 22);

    doc.setTextColor(27, 36, 48);
    doc.setFontSize(11);
    doc.text(`Receipt Reference: ALMA-REC-${Date.now()}`, 14, 48);
    doc.text(`Student Name: ${student.studentName}`, 14, 56);
    doc.text(`Roll Number: ${student.rollNumber}`, 14, 64);
    doc.text(`Course: ${student.course}`, 14, 72);
    doc.text(`Amount Paid: ₹${amount}`, 14, 80);
    doc.text(`Payment Gateway Mode: Razorpay Test Mode`, 14, 88);
    doc.text(`Transaction Status: SUCCESSFUL`, 14, 96);

    doc.save(`Alma_Receipt_${student.rollNumber}.pdf`);
  };

  const columns = [
    { header: 'Roll No', render: (r) => <span className="font-mono text-cobalt font-semibold">{r.rollNumber}</span> },
    { header: 'Student Name', render: (r) => <span className="font-medium text-ink">{r.studentName}</span> },
    { header: 'Course', render: (r) => <span className="font-mono text-ink-muted">{r.course}</span> },
    { header: 'Total Fee', render: (r) => <span className="font-mono text-ink">₹{r.totalAmount.toLocaleString()}</span> },
    { header: 'Paid Fee', render: (r) => <span className="font-mono text-success font-semibold">₹{r.paidAmount.toLocaleString()}</span> },
    {
      header: 'Fee Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
          r.status === 'Paid' ? 'bg-success/10 text-success border-success/30' :
          r.status === 'Partial' ? 'bg-warning/10 text-warning border-warning/30' :
          'bg-risk/10 text-risk border-risk/30'
        }`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.paidAmount < r.totalAmount && (
            <button
              onClick={() => handleOpenPayGateway(r)}
              className="px-3 py-1 rounded-xl btn-cobalt text-xs font-mono flex items-center gap-1 font-semibold"
            >
              <CreditCard className="w-3.5 h-3.5" /> Pay Online
            </button>
          )}
          {r.paidAmount > 0 && (
            <button
              onClick={() => generateReceiptPDF(r, r.paidAmount)}
              className="px-2.5 py-1 rounded-xl bg-surface-warm text-ink-muted hover:text-cobalt border border-border transition-all text-xs font-mono flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Receipt
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page title changes per role */}
      <div className="command-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">
            {isRestricted ? 'My Fee Account' : 'Fee & Finance — Collection Ledger'}
          </h2>
          <p className="text-xs text-ink-muted">
            {isRestricted
              ? `Viewing fee statement for ${user?.name} — ${MY_ROLL}`
              : 'Institution-wide fee structure, payment tracking & gateway integration'}
          </p>
        </div>
        {isRestricted && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cobalt/5 border border-cobalt/20 text-cobalt text-xs font-mono">
            <Lock className="w-3 h-3" /> Scoped to your record
          </span>
        )}
      </div>

      {/* KPI cards — admin sees aggregate, student sees own status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isRestricted ? (
          <>
            <div className="command-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-ink-muted uppercase font-semibold">TOTAL FEE</span>
                <h3 className="text-2xl font-serif font-bold text-ink mt-1">₹{feesList[0]?.totalAmount?.toLocaleString() ?? '—'}</h3>
                <span className="text-[10px] font-mono text-ink-muted">This academic year</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="command-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-ink-muted uppercase font-semibold">AMOUNT PAID</span>
                <h3 className="text-2xl font-serif font-bold text-success mt-1">₹{feesList[0]?.paidAmount?.toLocaleString() ?? '—'}</h3>
                <span className="text-[10px] font-mono text-success font-semibold">Cleared</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="command-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-ink-muted uppercase font-semibold">BALANCE DUE</span>
                <h3 className="text-2xl font-serif font-bold text-ink mt-1">
                  ₹{((feesList[0]?.totalAmount ?? 0) - (feesList[0]?.paidAmount ?? 0)).toLocaleString()}
                </h3>
                <span className="text-[10px] font-mono text-ink-muted">{feesList[0]?.status}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-warm border border-border flex items-center justify-center text-ink-muted">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="command-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-ink-muted uppercase font-semibold">TERM COLLECTION</span>
                <h3 className="text-2xl font-serif font-bold text-success mt-1">78%</h3>
                <span className="text-[10px] font-mono text-ink-muted">Target Met</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center text-success">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="command-card p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-ink-muted uppercase font-semibold">OVERDUE ACCOUNTS</span>
                <h3 className="text-2xl font-serif font-bold text-risk mt-1">1 Student</h3>
                <span className="text-[10px] font-mono text-ink-muted">Needs Notice</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-risk/10 border border-risk/30 flex items-center justify-center text-risk">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      <GrowthArc mode="divider" variant="cobalt" />

      <DataTable
        title={isRestricted ? 'My Fee Statement' : 'Fee Management & Collection Ledger'}
        subtitle={isRestricted
          ? `Personal fee account for ${user?.name} — ${MY_ROLL}`
          : 'Course fee structure, payment tracking, PDF receipt generation, and gateway integration'}
        columns={columns}
        data={feesList}
      />

      {/* Razorpay Sandbox Payment Gateway Modal */}
      {paymentModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm">
          <div className="command-card w-full max-w-md bg-surface p-6 shadow-warm-lg space-y-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cobalt" />
                <h3 className="font-serif font-bold text-ink text-lg">Razorpay Test Gateway</h3>
              </div>
              <span className="text-[10px] font-mono bg-cobalt/10 text-cobalt px-2 py-0.5 rounded-full font-semibold">SANDBOX</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-ink-muted">STUDENT:</span>
                <span className="text-ink font-semibold ml-2">{paymentModalStudent.studentName} ({paymentModalStudent.rollNumber})</span>
              </div>
              <div>
                <span className="text-ink-muted">DUE BALANCE:</span>
                <span className="text-risk font-semibold ml-2">₹{(paymentModalStudent.totalAmount - paymentModalStudent.paidAmount).toLocaleString()}</span>
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
                <span>Simulated PCI-DSS Encrypted Gateway Checkout</span>
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
                {processing ? 'Processing Order...' : `Pay ₹${payAmount} Now`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
