'use client';

import { Loader2, RefreshCw, Terminal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface TrainViewProps {
  onStartTrain: () => void;
  isTraining: boolean;
}

const TrainView: React.FC<TrainViewProps> = ({ onStartTrain, isTraining }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      socket = new WebSocket('ws://localhost:8080/train');

      socket.onopen = () => {
        console.log("Connected to Training Socket");
        setLogs(prev => [...prev, "--- System: Connected to AI Training Engine ---"]);
      };

      socket.onmessage = (event) => {
        setLogs((prev) => [...prev, event.data]);
      };

      socket.onerror = (error) => {
        // readyState 3 means connection failed/closed
        console.log("WebSocket error:", error);
        setLogs((prev) => [...prev, `[Error]: Connection failed. Is the backend running?`]);
      };

      socket.onclose = () => {
        // Auto-reconnect after 3 seconds
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (log: string) => {
    if (log.includes('THÀNH CÔNG') || log.includes('cập nhật với tri thức mới')) return 'text-emerald-400 font-bold';
    if (log.includes('Lỗi') || log.includes('thất bại')) return 'text-rose-400 font-bold';
    if (log.includes('[Ollama CLI]')) return 'text-emerald-300';
    return 'text-slate-300';
  };

  return (
    <div className="bg-slate-950 rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-emerald-400" />
          <span className="text-slate-200 font-mono text-sm font-semibold">AI Training Console</span>
        </div>
        <button
          onClick={() => { setLogs([]); onStartTrain(); }}
          disabled={isTraining}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isTraining
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95'
            }`}
        >
          {isTraining ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {isTraining ? 'Training...' : 'Rebuild Knowledge Base'}
        </button>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 selection:bg-emerald-500"
      >
        {logs.length === 0 && !isTraining && (
          <div className="text-emerald-800 italic">Console ready. Start training to see logs...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className={`break-words ${getLogStyle(log)}`}>
            <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        {isTraining && (
          <div className="flex items-center gap-2 text-emerald-400 animate-pulse mt-2">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Processing knowledge vectors...
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainView;
