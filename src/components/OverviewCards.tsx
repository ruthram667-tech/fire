import React from 'react';
import { ShieldAlert, Bell, Thermometer, Bot, Flame, CheckCircle2 } from 'lucide-react';

interface OverviewCardsProps {
  fireData: {
    fireDetected: boolean;
    confidence: number;
    temperature: number;
    severity: string;
  };
  activeAlertsCount: number;
  roverStatus: string;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  fireData,
  activeAlertsCount,
  roverStatus
}) => {
  const cards = [
    {
      title: 'Fire Status',
      value: fireData.fireDetected ? 'FIRE DETECTED' : 'SAFE',
      subtext: fireData.fireDetected ? 'Open flame & heat hazard' : 'No Fire Detected',
      isCritical: fireData.fireDetected,
      icon: fireData.fireDetected ? Flame : CheckCircle2,
      accent: fireData.fireDetected ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      iconBg: fireData.fireDetected ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
    },
    {
      title: 'Active Alerts',
      value: String(activeAlertsCount).padStart(2, '0'),
      subtext: activeAlertsCount > 0 ? `${activeAlertsCount} pending resolution` : 'All systems normal',
      isCritical: activeAlertsCount > 0,
      icon: Bell,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400'
    },
    {
      title: 'Temperature',
      value: `${fireData.temperature}°C`,
      subtext: fireData.temperature > 45 ? '⚠️ High thermal anomaly' : 'Normal ambient range',
      isCritical: fireData.temperature > 45,
      icon: Thermometer,
      accent: fireData.temperature > 45 ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' : 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      iconBg: fireData.temperature > 45 ? 'bg-orange-500/20 text-orange-400' : 'bg-sky-500/20 text-sky-400'
    },
    {
      title: 'Rover Status',
      value: roverStatus,
      subtext: roverStatus === 'ACTIVE' ? 'Autonomous patrol active' : 'Stationary / Standby',
      isCritical: roverStatus === 'EMERGENCY',
      icon: Bot,
      accent: roverStatus === 'EMERGENCY' ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      iconBg: roverStatus === 'EMERGENCY' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden transition-all hover:border-slate-700`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.isCritical ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-2xl font-bold tracking-tight font-mono ${card.isCritical ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {card.value}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${card.accent}`}>
                {card.subtext}
              </span>
            </div>

            {/* Subtle bottom glow for critical cards */}
            {card.isCritical && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
