import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, AlertTriangle, Shield, Cpu, Flame } from 'lucide-react';
import { triggerFire } from '../api/client';

interface HeaderProps {
  backendConnected: boolean;
  fireDetected: boolean;
  onRefresh: () => void;
  onFireStateChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  backendConnected,
  fireDetected,
  onRefresh,
  onFireStateChange
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleEmergency = async () => {
    setIsTriggering(true);
    try {
      await triggerFire(!fireDetected);
      onFireStateChange();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-white">FIRE SCOUT</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
            v2.4 Command Console
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Smart Emergency Fire Detection & AI Autonomous Response System
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Emergency Simulation Button */}
        <button
          onClick={handleToggleEmergency}
          disabled={isTriggering}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg ${
            fireDetected
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 animate-pulse'
          }`}
        >
          <Flame className="w-4 h-4" />
          {fireDetected ? 'Clear Emergency' : 'Simulate Fire Emergency'}
        </button>

        {/* System Status Indicators */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span>{backendConnected ? 'BACKEND CONNECTED' : 'BACKEND OFFLINE'}</span>
          </div>
        </div>

        {/* Current Time Clock */}
        <div className="px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          {currentTime}
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
