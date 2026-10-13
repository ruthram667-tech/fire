import React, { useState } from 'react';
import { Video, Eye, ShieldAlert, Thermometer, Droplets, Wind, Gauge, Cpu } from 'lucide-react';

interface LiveMonitoringProps {
  sensorData: {
    temperature: number;
    humidity: number;
    smokeLevel: number;
    gasSensor: string;
    obstacleDistance: number;
    battery: number;
    location: string;
  };
  fireData: {
    fireDetected: boolean;
    confidence: number;
    detectionType: string;
    severity: string;
  };
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ sensorData, fireData }) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [cameraMode, setCameraMode] = useState<'rgb' | 'thermal' | 'infrared'>('rgb');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Central Live Camera Stream Panel */}
      <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-base font-semibold text-white">LIVE ENVIRONMENT MONITORING</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button 
                onClick={() => setCameraMode('rgb')}
                className={`px-3 py-1 rounded-md transition-colors ${cameraMode === 'rgb' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                RGB Feed
              </button>
              <button 
                onClick={() => setCameraMode('thermal')}
                className={`px-3 py-1 rounded-md transition-colors ${cameraMode === 'thermal' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Thermal
              </button>
              <button 
                onClick={() => setCameraMode('infrared')}
                className={`px-3 py-1 rounded-md transition-colors ${cameraMode === 'infrared' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                IR Night
              </button>
            </div>
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                showBoundingBoxes ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              {showBoundingBoxes ? 'Hide AI Bounding' : 'Show AI Bounding'}
            </button>
          </div>
        </div>

        {/* Camera Feed Placeholder Box */}
        <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
          {/* Simulated Camera Video Background */}
          <div className={`absolute inset-0 transition-all duration-700 ${
            cameraMode === 'thermal' 
              ? 'bg-gradient-to-tr from-purple-950 via-red-950 to-amber-900 opacity-90'
              : cameraMode === 'infrared'
              ? 'bg-gradient-to-tr from-emerald-950 via-emerald-900 to-black opacity-90'
              : 'bg-gradient-to-tr from-slate-900 via-slate-950 to-neutral-900'
          }`}>
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
          </div>

          {/* Simulated scene content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
            {fireData.fireDetected ? (
              <div className="space-y-3 z-10 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center mx-auto animate-ping">
                  <ShieldAlert className="w-8 h-8 text-red-500 animate-bounce" />
                </div>
                <div className="bg-red-950/80 border border-red-500/50 px-4 py-2 rounded-xl backdrop-blur-md">
                  <p className="text-sm font-bold text-red-400 tracking-wider">🔥 FLAME HAZARD DETECTED</p>
                  <p className="text-xs text-red-200 mt-0.5">Confidence: {fireData.confidence}% · Temp: {sensorData.temperature}°C</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Eye className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-sm font-mono tracking-wider font-semibold text-slate-300">LIVE CAMERA FEED — {sensorData.location}</p>
                <p className="text-xs text-slate-500">AI Vision Surveillance Active · 30 FPS · 1080p Stream</p>
              </div>
            )}
          </div>

          {/* AI Bounding Box Overlay */}
          {showBoundingBoxes && (
            <div className="absolute inset-0 pointer-events-none p-6">
              {/* Bounding box for detected fire or normal inspection zone */}
              <div className={`absolute top-1/4 left-1/3 w-40 h-32 border-2 rounded-lg flex flex-col justify-between p-2 transition-all ${
                fireData.fireDetected ? 'border-red-500 bg-red-500/10' : 'border-emerald-500/60 bg-emerald-500/5'
              }`}>
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    fireData.fireDetected ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {fireData.fireDetected ? 'FIRE (99.2%)' : 'ZONE CLEAR (98.4%)'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">ID: #CAM-01</span>
                </div>
                <div className="text-[9px] font-mono text-slate-300">
                  {fireData.fireDetected ? 'Thermal: 68.4°C' : `Temp: ${sensorData.temperature}°C`}
                </div>
              </div>
            </div>
          )}

          {/* Camera HUD Details */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-mono text-red-400 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              REC
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-mono text-slate-300 border border-slate-800">
              {cameraMode.toUpperCase()}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-20">
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-mono text-slate-400 border border-slate-800">
              Lat: 34.0522° N, Lon: 118.2437° W
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Sensor Metrics Panel */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">ENVIRONMENT SENSORS</h3>
          </div>

          <div className="space-y-4">
            {/* Temperature */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Temperature</p>
                  <p className="text-lg font-bold font-mono text-white">{sensorData.temperature}°C</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${sensorData.temperature > 45 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {sensorData.temperature > 45 ? 'HIGH' : 'NORMAL'}
              </span>
            </div>

            {/* Humidity */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-lg font-bold font-mono text-white">{sensorData.humidity}%</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                OPTIMAL
              </span>
            </div>

            {/* Smoke / Gas Level */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Smoke / Gas Level</p>
                  <p className="text-lg font-bold font-mono text-white">{sensorData.smokeLevel} ppm</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${sensorData.smokeLevel > 50 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {sensorData.smokeLevel > 50 ? 'ALERT' : 'NORMAL'}
              </span>
            </div>

            {/* Obstacle Distance */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Obstacle Distance</p>
                  <p className="text-lg font-bold font-mono text-white">{sensorData.obstacleDistance} m</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                CLEAR
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Sensor ID: #FS-SEN-902</span>
          <span className="text-emerald-400">● Real-time stream</span>
        </div>
      </div>
    </div>
  );
};
