import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const PulseContext = createContext();

const INITIAL_PULSE_METRICS = [
  { id: '1', type: 'attendance', text: '142 students present today (92% turnout)' },
  { id: '2', type: 'leaves', text: '3 leave approvals pending HoD review' },
  { id: '3', type: 'fees', text: 'Fee collection 78% for Spring 2026 term' },
  { id: '4', type: 'timetable', text: 'CS-A Lab 3 relocated to Room 402 for Session 4' },
  { id: '5', type: 'results', text: 'Final Semester Results published for Batch 2022-26' },
  { id: '6', type: 'system', text: 'Automated Audit Logging & Backup Active' }
];

export function PulseProvider({ children }) {
  const [metrics, setMetrics] = useState(INITIAL_PULSE_METRICS);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const client = new Client({
      webSocketFactory: () => new SockJS(`${apiBase}/ws-pulse`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe('/topic/pulse', (message) => {
          try {
            const body = JSON.parse(message.body);
            if (body?.message) {
              setMetrics(prev => [
                { id: body.id || `ws_${Date.now()}`, type: 'system', text: `[STOMP] ${body.message}` },
                ...prev
              ].slice(0, 8)); // Capped at max 8 items
            }
          } catch (e) {
            console.error('Failed to parse STOMP pulse message', e);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.warn('STOMP Error:', frame);
        setIsConnected(false);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const pushPulseAlert = (newAlert) => {
    setMetrics(prev => [
      { id: `alert_${Date.now()}`, type: 'alert', text: newAlert },
      ...prev
    ].slice(0, 8)); // Capped at max 8 items per Item 12 requirement
  };

  return (
    <PulseContext.Provider value={{ metrics, pushPulseAlert, isConnected }}>
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
