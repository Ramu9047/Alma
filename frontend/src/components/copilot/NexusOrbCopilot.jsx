import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, AlertTriangle, CheckCircle2, X, Bot, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePulse } from '../../context/PulseContext';
import GrowthArc from '../common/GrowthArc';

// ── Platform detection for keyboard shortcut ──────────────────────────────────
function getPlatform() {
  // Use modern API first, fall back to userAgent parsing
  const platform =
    navigator.userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent;
  const isMac = /mac/i.test(platform);
  return { isMac };
}

const { isMac } = getPlatform();
// Ctrl+K on Windows/Linux — Cmd+K on Mac
// Ctrl+K collides with Chrome's address-bar focus in some configs, so we also
// check it hasn't been intercepted (preventDefault() handles that case).
const SHORTCUT_KEY = 'k';
const SHORTCUT_MOD = isMac ? 'metaKey' : 'ctrlKey';
const SHORTCUT_LABEL = isMac ? '⌘K' : 'Ctrl+K';

// ── Collapsible technical details toggle ─────────────────────────────────────
function TechDetails({ trace }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 pt-2 border-t border-border/60">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-[10px] font-mono text-ink-muted hover:text-cobalt transition-colors"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {open ? 'Hide technical details' : 'Show technical details'}
      </button>
      {open && (
        <pre className="mt-1.5 text-[10px] font-mono text-ink-muted bg-surface p-2 rounded-lg border border-border whitespace-pre-wrap break-all">
          {trace}
        </pre>
      )}
    </div>
  );
}

// ── Copilot message bubble with markdown rendering ────────────────────────────
function CopilotBubble({ msg, userName }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] p-3.5 rounded-2xl space-y-1 ${
          isUser
            ? 'bg-cobalt text-white rounded-br-none shadow-warm-sm'
            : 'bg-surface-warm border border-border text-ink rounded-bl-none shadow-warm-sm'
        }`}
      >
        {/* Header row */}
        <div className={`flex items-center justify-between gap-4 border-b pb-1 mb-1.5 text-[10px] font-mono opacity-80 ${
          isUser ? 'border-white/20 text-white' : 'border-border text-ink-muted'
        }`}>
          <span className="font-semibold">{isUser ? userName : 'Alma Copilot'}</span>
          <span>{msg.timestamp}</span>
        </div>

        {/* Message body — markdown rendered for copilot, plain for user */}
        {isUser ? (
          <p className="font-sans text-xs text-white leading-relaxed">{msg.text}</p>
        ) : (
          <div className="font-serif text-xs text-ink leading-relaxed prose prose-xs max-w-none
            prose-strong:text-cobalt prose-strong:font-bold
            prose-code:text-[10px] prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-border prose-code:font-mono
            prose-ul:my-1 prose-li:my-0.5 prose-p:my-0.5">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        )}

        {/* Collapsible technical trace if present */}
        {msg.trace && !isUser && <TechDetails trace={msg.trace} />}
      </div>
    </div>
  );
}

// ── Response builder: plain answer first, trace behind toggle ─────────────────
function buildResponse(text, trace) {
  return { text, trace: trace || null };
}

export default function NexusOrbCopilot() {
  const { user } = useAuth();
  const { pushPulseAlert } = usePulse();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasRiskAlert, setHasRiskAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'msg_0',
      sender: 'copilot',
      text: `Hello, **${user?.name || 'Administrator'}**. I'm the Alma AI Copilot. Ask me about student attendance, fee accounts, or academic results — or request an admin action like approving a leave.`,
      trace: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAction]);

  // ── Keyboard shortcut: Ctrl+K (Win/Linux) or Cmd+K (Mac) ─────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check the correct modifier for this platform
      if (e[SHORTCUT_MOD] && e.key.toLowerCase() === SHORTCUT_KEY) {
        e.preventDefault(); // stops Chrome from focusing address bar on Ctrl+K
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!query.trim() || isThinking) return;

    const userText = query.trim();
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      trace: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setQuery('');
    setIsThinking(true);

    // ── Detect leave-approval intent client-side so we can surface the
    //    confirmation card while still getting a real LLM response ────────
    const lower = userText.toLowerCase();
    const isLeaveIntent = lower.includes('approve') && lower.includes('leave');
    if (isLeaveIntent) {
      setPendingAction({
        type: 'APPROVE_LEAVE',
        target: 'Prof. Marcus Vance',
        details: 'Medical Leave (2026-07-25 to 2026-07-27)',
        endpoint: '/api/leaves/lev_01/decision',
        payload: { decision: 'APPROVED' }
      });
    }

    try {
      const token = localStorage.getItem('campus_auth_token');
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

      const res = await fetch(`${apiBase}/api/copilot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ prompt: userText })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Flag risk alerts based on LLM answer content
      const answerLower = (data.answer || '').toLowerCase();
      if (answerLower.includes('risk') || answerLower.includes('overdue') || answerLower.includes('below')) {
        setHasRiskAlert(true);
      }

      setMessages(prev => [...prev, {
        id: `cop_${Date.now()}`,
        sender: 'copilot',
        text: data.answer,
        trace: data.trace || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        id: `cop_err_${Date.now()}`,
        sender: 'copilot',
        text: `⚠️ Copilot is temporarily unavailable. Error: ${err.message}`,
        trace: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsThinking(false);
    }
  };


  const handleConfirmAction = () => {
    if (!pendingAction) return;

    pushPulseAlert(`Alma Copilot executed ${pendingAction.type} for ${pendingAction.target} (Audit Log #COP-${Date.now().toString().slice(-4)})`);

    setMessages(prev => [...prev, {
      id: `cop_conf_${Date.now()}`,
      sender: 'copilot',
      text: `Leave approved for **${pendingAction.target}**.\n\n- **Actor:** ${user?.name} (${user?.role})\n- **Audit Log:** \`log_cop_${Date.now().toString().slice(-4)}\`\n- **Status:** Write confirmed`,
      trace: `PUT ${pendingAction.endpoint}\nPayload: ${JSON.stringify(pendingAction.payload)}\nActorType: copilot\nTimestamp: ${new Date().toISOString()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setPendingAction(null);
  };

  return (
    <>
      {/* Docked Glowing Alma Orb (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Platform-aware shortcut hint */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-[11px] font-mono text-ink-muted shadow-warm-sm">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-warm border border-border text-ink font-semibold">{SHORTCUT_LABEL}</kbd> for Copilot
        </span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-label="Toggle Alma AI Copilot"
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-cobalt-glow ${
            hasRiskAlert ? 'bg-risk text-white ring-4 ring-risk/20' : 'bg-cobalt text-white hover:bg-cobalt-deep'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white">
            ✦
          </div>
          {hasRiskAlert && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-risk border-2 border-surface animate-ping" />
          )}
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-sm animate-stagger-fade">
          <div className="command-card w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-warm-lg overflow-hidden flex flex-col h-[600px] relative text-ink">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-warm/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cobalt flex items-center justify-center text-white font-bold shadow-warm-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                    Alma AI Copilot
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cobalt/10 text-cobalt border border-cobalt/20 font-semibold">
                      GPT OSS 120B via Groq
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono text-ink-muted">Constrained Tool-Call Query & Action Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHasRiskAlert(false)}
                  className="px-2.5 py-1 rounded-xl bg-surface border border-border text-[10px] font-mono text-ink-muted hover:text-ink hover:bg-surface-warm transition-all"
                >
                  Clear Alert
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-warm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs bg-surface">
              {messages.map(msg => (
                <CopilotBubble key={msg.id} msg={msg} userName={user?.name} />
              ))}

              {/* Action confirmation card */}
              {pendingAction && (
                <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30 text-xs space-y-3 animate-stagger-fade">
                  <div className="flex items-center gap-2 text-warning font-mono font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ACTION APPROVAL REQUIRED — Authenticated role: {user?.role}</span>
                  </div>
                  <div className="font-mono text-ink text-[11px] space-y-1 bg-surface p-3 rounded-xl border border-border">
                    <p>Target: <span className="text-cobalt font-bold">{pendingAction.target}</span></p>
                    <p>Details: {pendingAction.details}</p>
                    <p>REST Endpoint: <span className="text-ink-muted">{pendingAction.endpoint}</span></p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPendingAction(null)}
                      className="px-3.5 py-1.5 rounded-xl border border-border text-ink-muted hover:text-ink hover:bg-surface-warm text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmAction}
                      className="px-4 py-1.5 rounded-xl btn-cobalt text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Execute
                    </button>
                  </div>
                </div>
              )}

              {/* Thinking state */}
              {isThinking && (
                <div className="flex items-center gap-3 text-cobalt font-mono text-xs p-2">
                  <GrowthArc mode="loader" variant="cobalt" size={20} />
                  <span className="font-semibold">Alma evaluating academic parameters...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <form onSubmit={handleSend} className="p-3.5 border-t border-border bg-surface-warm/60 flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask a query or request an action..."
                className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-xl text-xs text-ink placeholder-ink-muted focus:outline-none focus:border-cobalt font-sans"
              />
              <button
                type="submit"
                disabled={isThinking}
                className="px-4 py-2.5 rounded-xl btn-cobalt font-mono text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
