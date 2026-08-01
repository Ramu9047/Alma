import React, { useState } from 'react';
import { Bell, Radio } from 'lucide-react';
import GrowthArc from '../components/common/GrowthArc';

export default function NotificationsCenter() {
  const [notifications] = useState([
    { id: 1, title: 'Fee Payment Received', text: 'Alex Rivera completed term fee payment of ₹75,000.', time: '10 mins ago', type: 'info' },
    { id: 2, title: 'Low Attendance Alert', text: 'Vikram Singh attendance dropped to 62% in MECH-BS.', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'Leave Application Pending', text: 'Prof. Marcus Vance applied for 3 days conference leave.', time: '3 hours ago', type: 'info' }
  ]);

  return (
    <div className="space-y-6">
      <div className="command-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cobalt" />
            <h2 className="font-serif text-xl font-bold text-ink">Notifications & Live Pulse Stream</h2>
          </div>
          <span className="text-xs font-mono text-success flex items-center gap-1 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> WebSocket STOMP Active
          </span>
        </div>

        <GrowthArc mode="divider" variant="cobalt" />

        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="p-4 bg-surface-warm/60 border border-border rounded-xl flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-ink">{n.title}</h4>
                <p className="text-xs text-ink-muted">{n.text}</p>
                <span className="text-[10px] font-mono text-cobalt font-semibold">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
