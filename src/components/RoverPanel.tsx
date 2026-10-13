import React, { useState } from 'react';
import { Bot, Battery, MapPin, Navigation, Video, Thermometer, Wind, ShieldCheck, Play, Square } from 'lucide-react';
import { startRover, stopRover } from '../api/client';

interface RoverPanelProps {
  roverData: {
    connection: string;
    battery: number;
    location: string;
    movement: string;
    camera: string;
    sensors: string;
  };
  onStatusChange: () => void;
}

export const RoverPanel: React.FC<RoverPanelProps> = ({ roverData, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await startRover();
      onStatusChange();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await stopRover();
      onStatusChange();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">FIRE SCOUT ROVER</h3>
            <p className="text-xs text-slate-400">Autonomous Fire Suppression & Inspection Unit</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStart}
            disabled={loading || roverData.movement === 'ACTIVE'}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Start Patrol
          </button>
          <button
            onClick={handleStop}
            disabled={loading || roverData.movement === 'STATIONARY'}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <Square className="w-3.5 h-3.5" /> Stop / Halt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Connection */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Rover Connection</p>
              <p className="text-sm font-bold font-mono text-emerald-400">Connected</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        {/* Battery */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Battery className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Battery Level</p>
              <p className="text-sm font-bold font-mono text-white">{roverData.battery}%</p>
            </div>
          </div>
          <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: `${roverData.battery}%` }}></div>
          </div>
        </div>

        {/* Location */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Current Location</p>
              <p className="text-sm font-bold font-mono text-white truncate max-w-[120px]">{roverData.location}</p>
            </div>
          </div>
        </div>

        {/* Movement Status */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Movement State</p>
              <p className="text-sm font-bold font-mono text-white">{roverData.movement}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Video className="w-4 h-4 text-emerald-400" />
          <span>Camera Status: <strong className="text-emerald-400 font-mono">Active</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Thermometer className="w-4 h-4 text-emerald-400" />
          <span>Temperature Sensor: <strong className="text-emerald-400 font-mono">Normal</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Wind className="w-4 h-4 text-emerald-400" />
          <span>Gas & Smoke Sensor: <strong className="text-emerald-400 font-mono">Normal</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Obstacle Detection: <strong className="text-emerald-400 font-mono">Operational</strong></span>
        </div>
      </div>
    </div>
  );
};
