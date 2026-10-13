import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Server, Cpu, CheckCircle } from 'lucide-react';
import { toggleDemoMode } from '../api/client';

interface SettingsPanelProps {
  demoMode: boolean;
  onDemoModeChange: (mode: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ demoMode, onDemoModeChange }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = async () => {
    setSaving(true);
    try {
      const newMode = !demoMode;
      await toggleDemoMode(newMode);
      onDemoModeChange(newMode);
      setMessage('Settings updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">SYSTEM CONFIGURATION & SETTINGS</h3>
          <p className="text-xs text-slate-400">Manage API endpoints, simulation parameters, and hardware telemetry</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Demo Mode Toggle */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Demo & Simulation Mode</p>
            <p className="text-xs text-slate-400">Generate realistic simulated sensor fluctuations and emergency triggers.</p>
          </div>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              demoMode 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {demoMode ? 'Enabled (Active)' : 'Disabled'}
          </button>
        </div>

        {/* Backend API Configuration */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Spring Boot REST API Endpoint</span>
          </div>
          <p className="text-xs text-slate-400">Connected to local or cloud Java backend service.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value="http://localhost:8080/api (Proxied via Express)" 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300"
            />
            <span className="px-3 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shrink-0">
              <CheckCircle className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
