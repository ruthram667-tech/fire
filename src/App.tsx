/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Flame, 
  Leaf, 
  LayoutDashboard, 
  Map, 
  LineChart, 
  BellRing, 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Radio,
  Thermometer,
  Droplets,
  Wind,
  Battery
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [simulationStatus, setSimulationStatus] = useState<any>({ status: 'RUNNING', scenario: 'NORMAL' });
  const [sensors, setSensors] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [latestSummary, setLatestSummary] = useState<any>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, sensorsRes, zonesRes, summaryRes, alertsRes] = await Promise.all([
        fetch('/api/simulation/status'),
        fetch('/api/sensors'),
        fetch('/api/zones'),
        fetch('/api/readings/latest'),
        fetch('/api/alerts')
      ]);

      const statusData = await statusRes.json();
      const sensorsData = await sensorsRes.json();
      const zonesData = await zonesRes.json();
      const summaryData = await summaryRes.json();
      const alertsData = await alertsRes.json();

      setSimulationStatus(statusData);
      setSensors(sensorsData);
      setZones(zonesData);
      setLatestSummary(summaryData);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Failed to fetch forest telemetry:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSimAction = async (endpoint: string, body?: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/simulation/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Action '${endpoint}' executed successfully.`);
        setTimeout(() => setActionMessage(''), 3000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setActionMessage(`Failed to execute ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  const normalZonesCount = zones.filter(z => z.status === 'NORMAL').length;
  const warningZonesCount = zones.filter(z => z.status === 'WARNING').length;
  const fireZonesCount = zones.filter(z => z.status === 'FIRE').length;

  return (
    <div className="flex h-screen bg-[#0F291E] text-slate-100 font-sans overflow-hidden select-none">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B2117] border-r border-[#1A382B] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center px-6 border-b border-[#1A382B] gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9531E] to-[#4E9F3D] flex items-center justify-center shadow-lg shadow-orange-950/40">
              <div className="relative flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-200 absolute -top-1 animate-pulse" />
                <Leaf className="w-5 h-5 text-emerald-100 absolute top-1" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                FIRE SCOUT
              </h1>
              <p className="text-[11px] text-[#4E9F3D] font-medium uppercase tracking-wider">
                Forest Fire Detection
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'monitoring', label: 'Forest Monitoring', icon: Map },
              { id: 'analytics', label: 'Sensor Analytics', icon: LineChart },
              { id: 'alerts', label: 'Alerts & Events', icon: BellRing, badge: alerts.length },
              { id: 'simulation', label: 'Simulation Controls', icon: Sliders },
            ].map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#1A382B] text-amber-400 border border-amber-500/30 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-[#153024]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#D9531E] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Simulation Mode Badge */}
        <div className="p-4 border-t border-[#1A382B] bg-[#071911]">
          <div className="rounded-xl p-3.5 bg-[#0F291E] border border-[#1A382B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${simulationStatus.status === 'RUNNING' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${simulationStatus.status === 'RUNNING' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Simulation Mode</p>
                <p className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                  {simulationStatus.status} ({simulationStatus.scenario})
                </p>
              </div>
            </div>
            <Radio className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0A1F17]">
        {/* Top Header */}
        <header className="h-20 bg-[#0F291E] border-b border-[#1A382B] px-8 flex items-center justify-between shrink-0 shadow-md">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Forest Fire Detection & Monitoring System</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1A382B] text-amber-300 font-mono border border-amber-500/20">
                Simulated Data
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time sensor telemetry and multi-zone forest hazard tracking.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {actionMessage && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 animate-fade-in font-mono">
                {actionMessage}
              </span>
            )}

            <button
              onClick={() => handleSimAction('trigger-fire')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D9531E] hover:bg-[#C42B12] text-white flex items-center gap-2 transition-all shadow-lg shadow-orange-950/40 animate-pulse"
            >
              <Flame className="w-4 h-4" /> Trigger Test Fire
            </button>

            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-[#1A382B] hover:bg-[#234B39] text-slate-300 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#0D241B]">
          {currentTab === 'overview' && (
            <>
              {/* Metric Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#1A2421] border border-[#2B3B36] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-300">Total Sensors</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Radio className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">{sensors.length}</div>
                  <p className="text-xs text-emerald-400 font-medium">Active telemetry nodes</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1A2421] border border-[#2B3B36] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-300">Normal Zones</span>
                    <div className="p-2.5 rounded-xl bg-[#4E9F3D]/20 text-[#4E9F3D]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold font-mono text-[#4E9F3D] mb-1">{normalZonesCount}</div>
                  <p className="text-xs text-slate-400">Stable forest sectors</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1A2421] border border-[#2B3B36] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-300">Warning Zones</span>
                    <div className="p-2.5 rounded-xl bg-[#D9531E]/20 text-[#D9531E]">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold font-mono text-[#D9531E] mb-1">{warningZonesCount}</div>
                  <p className="text-xs text-[#D9531E]">Elevated temperature/smoke</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1A2421] border border-[#2B3B36] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-300">Fire Detected Zones</span>
                    <div className="p-2.5 rounded-xl bg-[#C42B12]/20 text-[#C42B12]">
                      <Flame className="w-5 h-5 animate-bounce" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold font-mono text-[#C42B12] mb-1">{fireZonesCount}</div>
                  <p className="text-xs text-[#C42B12]">Active fire hazard incidents</p>
                </div>
              </div>

              {/* Forest Zone Grid Map Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-[#1A2421] border border-[#2B3B36] p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Map className="w-5 h-5 text-emerald-400" /> Virtual Forest Map Status
                    </h3>
                    <button 
                      onClick={() => setCurrentTab('monitoring')}
                      className="text-xs text-emerald-400 hover:underline font-medium"
                    >
                      View Full Grid →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {zones.map(zone => {
                      const isFire = zone.status === 'FIRE';
                      const isWarning = zone.status === 'WARNING';
                      return (
                        <div 
                          key={zone.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isFire 
                              ? 'bg-[#C42B12]/15 border-[#C42B12] shadow-lg shadow-red-950/30' 
                              : isWarning 
                              ? 'bg-[#D9531E]/15 border-[#D9381E]' 
                              : 'bg-[#0F291E]/60 border-[#2B3B36]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-slate-300">{zone.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                              isFire ? 'bg-[#C42B12] text-white animate-pulse' :
                              isWarning ? 'bg-[#D9531E] text-white' :
                              'bg-[#4E9F3D]/20 text-[#4E9F3D]'
                            }`}>
                              {zone.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-white text-sm mb-1">{zone.name}</h4>
                          <p className="text-xs text-slate-400">Sensors Deployed: {zone.sensorsCount} nodes</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Alerts Feed */}
                <div className="rounded-2xl bg-[#1A2421] border border-[#2B3B36] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-white flex items-center gap-2">
                        <BellRing className="w-5 h-5 text-amber-400" /> Recent Alerts
                      </h3>
                      <button 
                        onClick={() => setCurrentTab('alerts')}
                        className="text-xs text-emerald-400 hover:underline font-medium"
                      >
                        All ({alerts.length}) →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {alerts.slice(0, 3).map(alert => (
                        <div key={alert.id} className="p-3.5 rounded-xl bg-[#0F291E] border border-[#2B3B36] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold font-mono ${alert.severity === 'CRITICAL' ? 'text-[#C42B12]' : 'text-[#D9531E]'}`}>
                              {alert.severity}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">{alert.timestamp}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-200">{alert.zone}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#2B3B36] text-center">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Simulated Forest Monitoring Framework v1.0
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#1A2421] border border-[#2B3B36] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Forest Sector Zone Grid</h3>
                    <p className="text-xs text-slate-400">Real-time status of all monitored forestry sectors and active sensor nodes.</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#4E9F3D]"></span> Normal</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#D9531E]"></span> Warning</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#C42B12]"></span> Fire Detected</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {zones.map(zone => {
                    const zoneSensors = sensors.filter(s => s.zoneId === zone.id);
                    const isFire = zone.status === 'FIRE';
                    const isWarning = zone.status === 'WARNING';
                    return (
                      <div 
                        key={zone.id}
                        className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                          isFire 
                            ? 'bg-[#C42B12]/15 border-[#C42B12] shadow-xl shadow-red-950/20' 
                            : isWarning 
                            ? 'bg-[#D9531E]/15 border-[#D9531E]' 
                            : 'bg-[#0F291E] border-[#2B3B36]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold text-slate-300">{zone.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                              isFire ? 'bg-[#C42B12] text-white animate-pulse' :
                              isWarning ? 'bg-[#D9531E] text-white' :
                              'bg-[#4E9F3D]/20 text-[#4E9F3D]'
                            }`}>
                              {zone.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-base mb-1">{zone.name}</h4>
                          <p className="text-xs text-slate-400 mb-4">Risk Level: <strong className="text-slate-200">{zone.riskLevel}</strong></p>

                          <div className="space-y-2.5">
                            <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Assigned Sensor Nodes</p>
                            {zoneSensors.map(sensor => (
                              <div key={sensor.id} className="p-3 rounded-xl bg-[#1A2421] border border-[#2B3B36] flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-white font-mono">{sensor.id}</span>
                                  <span className="text-slate-400 ml-2">({sensor.name})</span>
                                </div>
                                <div className="flex items-center gap-3 font-mono text-[11px]">
                                  <span className="text-orange-400">{sensor.temperature}°C</span>
                                  <span className="text-amber-300">{sensor.smoke} ppm</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#2B3B36] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>Simulated Node Feed</span>
                          <span className="text-emerald-400">● Live</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'analytics' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#1A2421] border border-[#2B3B36] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Sensor Telemetry Analytics</h3>
                    <p className="text-xs text-slate-400">Real-time simulated temperature, humidity, and smoke readings across forest nodes.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#0F291E] border border-[#2B3B36] text-xs font-mono text-emerald-400 rounded-lg">
                    Streaming Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sensors.map(sensor => (
                    <div key={sensor.id} className="p-5 rounded-xl bg-[#0F291E] border border-[#2B3B36] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white font-mono">{sensor.id}</h4>
                          <p className="text-xs text-slate-400">{sensor.name}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          sensor.status === 'FIRE' ? 'bg-[#C42B12] text-white animate-pulse' :
                          sensor.status === 'WARNING' ? 'bg-[#D9531E] text-white' :
                          'bg-[#4E9F3D]/20 text-[#4E9F3D]'
                        }`}>
                          {sensor.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A2421]">
                          <span className="text-slate-400 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-orange-400" /> Temperature</span>
                          <span className="font-bold text-orange-400">{sensor.temperature} °C</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A2421]">
                          <span className="text-slate-400 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-sky-400" /> Humidity</span>
                          <span className="font-bold text-sky-400">{sensor.humidity} %</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A2421]">
                          <span className="text-slate-400 flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-amber-400" /> Smoke Density</span>
                          <span className="font-bold text-amber-400">{sensor.smoke} ppm</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A2421]">
                          <span className="text-slate-400 flex items-center gap-1.5"><Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery</span>
                          <span className="font-bold text-emerald-400">{sensor.battery} %</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'alerts' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#1A2421] border border-[#2B3B36] p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Alerts & Event History</h3>
                    <p className="text-xs text-slate-400">Comprehensive log of simulated fire hazards, warnings, and system events.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#0F291E] border border-[#2B3B36] text-xs font-mono text-slate-300 rounded-lg">
                    Total Events: {alerts.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#2B3B36] text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 px-4">Timestamp</th>
                        <th className="pb-3 px-4">Severity</th>
                        <th className="pb-3 px-4">Sensor ID</th>
                        <th className="pb-3 px-4">Affected Zone</th>
                        <th className="pb-3 px-4">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B3B36]">
                      {alerts.map(alert => (
                        <tr key={alert.id} className="hover:bg-[#153024] transition-colors">
                          <td className="py-4 px-4 text-slate-400">{alert.timestamp}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              alert.severity === 'CRITICAL' ? 'bg-[#C42B12] text-white animate-pulse' :
                              alert.severity === 'WARNING' ? 'bg-[#D9531E] text-white' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {alert.severity}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-white">{alert.sensorId}</td>
                          <td className="py-4 px-4 text-slate-300">{alert.zone}</td>
                          <td className="py-4 px-4 text-slate-200">{alert.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'simulation' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="rounded-2xl bg-[#1A2421] border border-[#2B3B36] p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Simulation Controls & Scenarios</h3>
                  <p className="text-xs text-slate-400 mt-1">Control the simulated backend engine, test emergency fire scenarios, and reset state.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleSimAction('start')}
                    className="p-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Play className="w-5 h-5" /> Start Simulation
                  </button>
                  <button
                    onClick={() => handleSimAction('pause')}
                    className="p-4 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Pause className="w-5 h-5" /> Pause Simulation
                  </button>
                  <button
                    onClick={() => handleSimAction('resume')}
                    className="p-4 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Play className="w-5 h-5" /> Resume Simulation
                  </button>
                  <button
                    onClick={() => handleSimAction('reset')}
                    className="p-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset Simulation
                  </button>
                </div>

                <div className="pt-6 border-t border-[#2B3B36] space-y-4">
                  <h4 className="font-bold text-sm text-white">Scenario Selectors</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleSimAction('scenario', { scenario: 'NORMAL' })}
                      className="p-3.5 rounded-xl bg-[#0F291E] border border-[#2B3B36] hover:border-emerald-500 text-emerald-400 font-medium text-xs transition-all"
                    >
                      Normal Environment
                    </button>
                    <button
                      onClick={() => handleSimAction('scenario', { scenario: 'WARNING' })}
                      className="p-3.5 rounded-xl bg-[#0F291E] border border-[#2B3B36] hover:border-orange-500 text-orange-400 font-medium text-xs transition-all"
                    >
                      Warning Environment
                    </button>
                    <button
                      onClick={() => handleSimAction('scenario', { scenario: 'FIRE' })}
                      className="p-3.5 rounded-xl bg-[#0F291E] border border-[#2B3B36] hover:border-red-500 text-red-400 font-medium text-xs transition-all"
                    >
                      Fire Emergency
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#2B3B36]">
                  <button
                    onClick={() => handleSimAction('trigger-fire')}
                    className="w-full py-4 rounded-xl bg-[#D9531E] hover:bg-[#C42B12] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-950/40"
                  >
                    <Flame className="w-5 h-5" /> Trigger Test Fire in Zone C1
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
