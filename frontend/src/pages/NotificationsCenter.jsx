import React, { useState, useEffect } from 'react';
import { Bell, Radio, WifiOff } from 'lucide-react';
import GrowthArc from '../components/common/GrowthArc';
import { apiService } from '../services/api';
import { usePulse } from '../context/PulseContext';

const DEFAULT_NOTIFS = [
  { id: 1, title: 'Fee Payment Received', text: 'Alex Rivera completed term fee payment of ₹75,000.', time: '10 mins ago', type: 'info' },
  { id: 2, title: 'Low Attendance Alert', text: 'Vikram Singh attendance dropped to 62% in MECH-BS.', time: '1 hour ago', type: 'warning' },
  { id: 3, title: 'Leave Application Pending', text: 'Prof. Marcus Vance applied for 3 days conference leave.', time: '3 hours ago', type: 'info' }
];

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFS);
  const [isOffline, setIsOffline] = useState(false);
  const { isConnected } = usePulse();

  useEffect(() => {
    async function loadNotifications() {
      const res = await apiService.getAuditLogs();
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map(item => ({
          id: item.id,
          title: item.title || item.action || 'System Event',
          text: item.message || `Audit Event: ${item.action}`,
          time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Recently',
          type: item.type === 'WARNING' ? 'warning' : 'info'
        }));
        setNotifications(mapped);
      }
      setIsOffline(res.offline);
    }
    loadNotifications();
  }, []);

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-3 bg-warning/10 border border-warning/30 text-warning text-xs font-mono rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — displaying cached demo notifications</span>
          </div>
          <span className="px-2 py-0.5 bg-warning/20 rounded text-[10px] font-bold">DEMO MODE</span>
        </div>
      )}

      <div className="command-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cobalt" />
            <h2 className="font-serif text-xl font-bold text-ink">Notifications & Live Pulse Stream</h2>
          </div>
          <span className={`text-xs font-mono flex items-center gap-1 font-semibold ${isConnected ? 'text-success' : 'text-warning'}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            {isConnected ? 'WebSocket STOMP Active' : 'WebSocket STOMP Connecting...'}
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
