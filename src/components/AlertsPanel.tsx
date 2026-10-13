import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, AlertTriangle, Info, Check } from 'lucide-react';
import { resolveAlert } from '../api/client';

interface AlertItem {
  id: string;
  time: string;
  alert: string;
  severity: string;
  status: string;
}

interface AlertsPanelProps {
  alerts: AlertItem[];
  onAlertResolved: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAlertResolved }) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      await resolveAlert(id);
      onAlertResolved();
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 w-fit"><ShieldAlert className="w-3.5 h-3.5 animate-bounce" /> CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 w-fit"><AlertTriangle className="w-3.5 h-3.5" /> HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 w-fit"><AlertTriangle className="w-3.5 h-3.5" /> MEDIUM</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit"><Info className="w-3.5 h-3.5" /> LOW</span>;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">RECENT ALERTS & LOGS</h3>
            <p className="text-xs text-slate-400">Emergency dispatch and sensor warning logs</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-slate-950 text-slate-300 rounded-lg border border-slate-800">
          Total: {alerts.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-4">Time</th>
              <th className="pb-3 px-4">Alert Description</th>
              <th className="pb-3 px-4">Severity</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No emergency alerts recorded. All systems secure.
                </td>
              </tr>
            ) : (
              alerts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs text-slate-400">{item.time}</td>
                  <td className="py-4 px-4 font-medium text-white">{item.alert}</td>
                  <td className="py-4 px-4">{getSeverityBadge(item.severity)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {item.status === 'Active' ? (
                      <button
                        onClick={() => handleResolve(item.id)}
                        disabled={resolvingId === item.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm disabled:opacity-50"
                      >
                        {resolvingId === item.id ? 'Resolving...' : 'Resolve'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center justify-end gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
