import React, { useState } from 'react';
import { mockFeedback } from '../services/api';
import { Send, CornerDownRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';

export default function FeedbackModule() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState(mockFeedback);
  const [replyText, setReplyText] = useState({});

  const handleAddReply = (id) => {
    if (!replyText[id]) return;
    setFeedbackList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newReplies = [
            ...(item.replies || []),
            { author: user.name, text: replyText[id], date: new Date().toISOString().split('T')[0] }
          ];
          return { ...item, replies: newReplies, status: 'Resolved' };
        }
        return item;
      })
    );
    setReplyText(prev => ({ ...prev, [item.id]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="command-card p-6 space-y-4">
        <div className="border-b border-border pb-4">
          <h2 className="font-serif text-xl font-bold text-ink">Campus Feedback & Support Hub</h2>
          <p className="text-xs text-ink-muted">Threaded communication channel between students/staff and Administration</p>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        <div className="space-y-4">
          {feedbackList.map(item => (
            <div key={item.id} className="p-4 bg-surface-warm/60 border border-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-ink font-semibold">{item.author}</span>
                  <span className="text-[10px] font-mono text-cobalt bg-cobalt/10 px-2.5 py-0.5 rounded-full border border-cobalt/20 font-semibold">{item.role}</span>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${item.status === 'Resolved' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'}`}>
                  {item.status}
                </span>
              </div>

              <h4 className="font-semibold text-xs text-ink">{item.subject}</h4>
              <p className="text-xs text-ink-muted leading-relaxed">{item.content}</p>

              {/* Threaded Replies */}
              {item.replies && item.replies.length > 0 && (
                <div className="pl-4 border-l-2 border-cobalt/40 space-y-2 mt-3 pt-2">
                  {item.replies.map((reply, rIdx) => (
                    <div key={rIdx} className="text-xs space-y-1">
                      <div className="flex items-center gap-2 text-[11px]">
                        <CornerDownRight className="w-3 h-3 text-cobalt" />
                        <span className="font-semibold text-cobalt">{reply.author}</span>
                        <span className="text-[10px] font-mono text-ink-muted">{reply.date}</span>
                      </div>
                      <p className="text-ink pl-5">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type an official admin response..."
                  value={replyText[item.id] || ''}
                  onChange={e => setReplyText({ ...replyText, [item.id]: e.target.value })}
                  className="flex-1 px-3.5 py-2 bg-surface border border-border rounded-xl text-xs text-ink focus:border-cobalt focus:outline-none"
                />
                <button
                  onClick={() => handleAddReply(item.id)}
                  className="px-3.5 py-2 rounded-xl btn-cobalt text-xs font-mono font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
