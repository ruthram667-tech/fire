import React from 'react';
import { Terminal, Shield, AlertCircle, Info } from 'lucide-react';

interface LogItem {
  timestamp: string;
  level: string;
  message: string;
}

interface SystemLogsProps {
  logs: LogItem[];
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ logs }) => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">SYSTEM TELEMETRY LOGS</h3>
            <p className="text-xs text-slate-400">Java Spring Boot Backend Event Stream</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-slate-950 text-slate-300 rounded-lg border border-slate-800 text-xs font-mono">
          Live Feed
        </span>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs space-y-2.5 max-h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No system logs available.</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 py-1 border-b border-slate-900 last:border-0">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-300 break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
