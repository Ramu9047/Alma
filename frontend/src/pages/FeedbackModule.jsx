import React, { useState, useEffect } from 'react';
import { apiService, mockFeedback } from '../services/api';
import { Send, CornerDownRight, Plus, WifiOff, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GrowthArc from '../components/common/GrowthArc';

export default function FeedbackModule() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const loadFeedback = async () => {
    const res = await apiService.getFeedback();
    setFeedbackList(res.data || mockFeedback);
    setIsOffline(res.offline);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleAddReply = async (id) => {
    if (!replyText[id]) return;
    await apiService.replyFeedback(id, replyText[id]);
    setReplyText(prev => ({ ...prev, [id]: '' }));
    loadFeedback();
  };

  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) return;
    await apiService.createFeedback({ subject: newSubject, content: newContent });
    setNewSubject('');
    setNewContent('');
    setShowNewForm(false);
    loadFeedback();
  };

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo feedback threads · DEMO MODE</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <div className="command-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">Campus Feedback & Support Hub</h2>
            <p className="text-xs text-ink-muted">Threaded communication channel between students/staff and Administration</p>
          </div>

          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-cobalt text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>{showNewForm ? 'Close Form' : 'Submit Feedback'}</span>
          </button>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        {showNewForm && (
          <form onSubmit={handleCreateFeedback} className="p-4 bg-surface-warm rounded-2xl border border-border space-y-3">
            <h3 className="font-serif font-bold text-sm text-ink flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cobalt" /> New Feedback Request
            </h3>
            <div>
              <input
                type="text"
                placeholder="Subject / Category"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs text-ink focus:border-cobalt focus:outline-none font-mono"
              />
            </div>
            <div>
              <textarea
                placeholder="Describe your feedback or request in detail..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                rows={3}
                className="w-full px-3.5 py-2 bg-surface border border-border rounded-xl text-xs text-ink focus:border-cobalt focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 rounded-xl btn-cobalt text-xs font-semibold flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {feedbackList.map(item => {
            const authorName = item.authorUsername || item.author || 'Anonymous';
            const roleName = item.authorRole || item.role || 'USER';
            const replies = item.replies || [];
            return (
              <div key={item.id} className="p-4 bg-surface-warm/60 border border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-ink font-semibold">{authorName}</span>
                    <span className="text-[10px] font-mono text-cobalt bg-cobalt/10 px-2.5 py-0.5 rounded-full border border-cobalt/20 font-semibold">{roleName}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${item.status === 'Resolved' ? 'bg-success/10 text-success border-success/30' : 'bg-warning/10 text-warning border-warning/30'}`}>
                    {item.status || 'Open'}
                  </span>
                </div>

                <h4 className="font-semibold text-xs text-ink">{item.subject}</h4>
                <p className="text-xs text-ink-muted leading-relaxed">{item.content}</p>

                {/* Threaded Replies */}
                {replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-cobalt/40 space-y-2 mt-3 pt-2">
                    {replies.map((reply, rIdx) => (
                      <div key={rIdx} className="text-xs space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <CornerDownRight className="w-3 h-3 text-cobalt" />
                          <span className="font-semibold text-cobalt">{reply.authorUsername || reply.author}</span>
                          <span className="text-[10px] font-mono text-ink-muted">
                            {reply.timestamp ? new Date(reply.timestamp).toLocaleDateString() : (reply.date || '')}
                          </span>
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
                    placeholder="Type a response..."
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
