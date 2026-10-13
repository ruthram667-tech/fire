import React from 'react';
import { Flame, ShieldAlert, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

interface FireDetectionPanelProps {
  fireData: {
    fireDetected: boolean;
    confidence: number;
    temperature: number;
    smokeLevel: number;
    detectionType: string;
    severity: string;
  };
}

export const FireDetectionPanel: React.FC<FireDetectionPanelProps> = ({ fireData }) => {
  return (
    <div className={`rounded-2xl border p-6 shadow-xl transition-all ${
      fireData.fireDetected 
        ? 'bg-red-950/20 border-red-500/50 shadow-red-900/20' 
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${fireData.fireDetected ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <Flame className={`w-6 h-6 ${fireData.fireDetected ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AI FIRE DETECTION</h3>
            <p className="text-xs text-slate-400">Deep Learning Vision & Smoke Neural Network</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
          fireData.fireDetected 
            ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {fireData.severity}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detection Status Box */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Detection Status</p>
            <p className={`text-lg font-bold font-mono tracking-wide ${fireData.fireDetected ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {fireData.fireDetected ? '🔴 FIRE DETECTED' : '🟢 NO FIRE DETECTED'}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            {fireData.fireDetected ? 'Immediate automated response triggered.' : 'Environment is secure and stable.'}
          </p>
        </div>

        {/* AI Confidence Box */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">AI Confidence Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{fireData.confidence}%</span>
              <span className="text-xs text-emerald-400 font-mono">High Precision</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${fireData.fireDetected ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${fireData.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Detection Type Box */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Classification Type</p>
            <p className="text-lg font-semibold text-white truncate">{fireData.detectionType}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Model: YOLOv8-FireSense v4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
