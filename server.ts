import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory simulation state for Fire Scout Forest Fire Detection System
  let simulationState = {
    status: 'RUNNING', // RUNNING, PAUSED, STOPPED
    scenario: 'NORMAL', // NORMAL, WARNING, FIRE
    simulationTime: '00:14:32',
    speed: 1
  };

  let zones = [
    { id: 'ZONE-A1', name: 'Pine Ridge North', status: 'NORMAL', sensorsCount: 4, riskLevel: 'Low' },
    { id: 'ZONE-A2', name: 'Oak Valley East', status: 'NORMAL', sensorsCount: 5, riskLevel: 'Low' },
    { id: 'ZONE-B1', name: 'Cedar Canopy Center', status: 'WARNING', sensorsCount: 6, riskLevel: 'Moderate' },
    { id: 'ZONE-B2', name: 'Redwood Basin', status: 'NORMAL', sensorsCount: 4, riskLevel: 'Low' },
    { id: 'ZONE-C1', name: 'Dry Ridge South', status: 'FIRE', sensorsCount: 5, riskLevel: 'Critical' },
    { id: 'ZONE-C2', name: 'Whispering Pines West', status: 'NORMAL', sensorsCount: 4, riskLevel: 'Low' }
  ];

  let sensors = [
    { id: 'SEN-101', zoneId: 'ZONE-A1', name: 'Node A1-Alpha', temperature: 24.5, humidity: 62.0, smoke: 1.2, battery: 94, status: 'NORMAL' },
    { id: 'SEN-102', zoneId: 'ZONE-A1', name: 'Node A1-Beta', temperature: 25.1, humidity: 60.5, smoke: 1.5, battery: 91, status: 'NORMAL' },
    { id: 'SEN-201', zoneId: 'ZONE-A2', name: 'Node A2-Alpha', temperature: 26.0, humidity: 58.2, smoke: 1.8, battery: 88, status: 'NORMAL' },
    { id: 'SEN-301', zoneId: 'ZONE-B1', name: 'Node B1-Canopy', temperature: 38.4, humidity: 32.1, smoke: 14.8, battery: 76, status: 'WARNING' },
    { id: 'SEN-302', zoneId: 'ZONE-B1', name: 'Node B1-Ridge', temperature: 39.2, humidity: 30.5, smoke: 16.2, battery: 72, status: 'WARNING' },
    { id: 'SEN-401', zoneId: 'ZONE-B2', name: 'Node B2-Basin', temperature: 23.8, humidity: 65.0, smoke: 0.9, battery: 95, status: 'NORMAL' },
    { id: 'SEN-501', zoneId: 'ZONE-C1', name: 'Node C1-Summit', temperature: 82.4, humidity: 12.3, smoke: 89.5, battery: 42, status: 'FIRE' },
    { id: 'SEN-502', zoneId: 'ZONE-C1', name: 'Node C1-Gorge', temperature: 79.1, humidity: 14.0, smoke: 84.2, battery: 39, status: 'FIRE' },
    { id: 'SEN-601', zoneId: 'ZONE-C2', name: 'Node C2-West', temperature: 25.2, humidity: 59.0, smoke: 1.1, battery: 90, status: 'NORMAL' }
  ];

  let alerts = [
    { id: 'ALT-901', severity: 'CRITICAL', sensorId: 'SEN-501', zone: 'Dry Ridge South (ZONE-C1)', timestamp: '14:38:12', message: 'Simulated active crown fire detected. Rapid temperature & smoke spike.' },
    { id: 'ALT-902', severity: 'WARNING', sensorId: 'SEN-301', zone: 'Cedar Canopy Center (ZONE-B1)', timestamp: '14:31:04', message: 'Elevated temperature and dry relative humidity threshold reached.' },
    { id: 'ALT-903', severity: 'INFO', sensorId: 'SEN-101', zone: 'Pine Ridge North (ZONE-A1)', timestamp: '14:00:00', message: 'Routine diagnostic telemetry transmission successful.' }
  ];

  // Periodic sensor telemetry fluctuation if simulation is running
  setInterval(() => {
    if (simulationState.status === 'RUNNING') {
      sensors.forEach(sensor => {
        if (sensor.status === 'FIRE') {
          sensor.temperature = Number((78 + Math.random() * 8).toFixed(1));
          sensor.smoke = Number((80 + Math.random() * 15).toFixed(1));
          sensor.humidity = Number((10 + Math.random() * 5).toFixed(1));
        } else if (sensor.status === 'WARNING') {
          sensor.temperature = Number((36 + Math.random() * 5).toFixed(1));
          sensor.smoke = Number((12 + Math.random() * 6).toFixed(1));
          sensor.humidity = Number((28 + Math.random() * 8).toFixed(1));
        } else {
          sensor.temperature = Number((22 + Math.random() * 6).toFixed(1));
          sensor.smoke = Number((0.5 + Math.random() * 2).toFixed(1));
          sensor.humidity = Number((55 + Math.random() * 12).toFixed(1));
        }
      });
    }
  }, 4000);

  // REST API Endpoints for Fire Scout
  app.get('/api/sensors', (req, res) => {
    res.json(sensors);
  });

  app.get('/api/zones', (req, res) => {
    res.json(zones);
  });

  app.get('/api/readings/latest', (req, res) => {
    res.json({
      timestamp: new Date().toISOString(),
      sensorsCount: sensors.length,
      normalCount: sensors.filter(s => s.status === 'NORMAL').length,
      warningCount: sensors.filter(s => s.status === 'WARNING').length,
      fireCount: sensors.filter(s => s.status === 'FIRE').length,
      readings: sensors
    });
  });

  app.get('/api/alerts', (req, res) => {
    res.json(alerts);
  });

  app.get('/api/simulation/status', (req, res) => {
    res.json(simulationState);
  });

  app.post('/api/simulation/start', (req, res) => {
    simulationState.status = 'RUNNING';
    res.json({ success: true, simulationState });
  });

  app.post('/api/simulation/pause', (req, res) => {
    simulationState.status = 'PAUSED';
    res.json({ success: true, simulationState });
  });

  app.post('/api/simulation/resume', (req, res) => {
    simulationState.status = 'RUNNING';
    res.json({ success: true, simulationState });
  });

  app.post('/api/simulation/reset', (req, res) => {
    simulationState.status = 'RUNNING';
    simulationState.scenario = 'NORMAL';
    zones.forEach(z => {
      if (z.id === 'ZONE-C1') z.status = 'NORMAL';
      if (z.id === 'ZONE-B1') z.status = 'NORMAL';
    });
    sensors.forEach(s => {
      s.status = 'NORMAL';
      s.temperature = 24.0;
      s.smoke = 1.0;
      s.humidity = 60.0;
    });
    res.json({ success: true, simulationState, zones, sensors });
  });

  app.post('/api/simulation/trigger-fire', (req, res) => {
    simulationState.scenario = 'FIRE';
    const targetZone = zones.find(z => z.id === 'ZONE-C1');
    if (targetZone) targetZone.status = 'FIRE';
    sensors.filter(s => s.zoneId === 'ZONE-C1').forEach(s => {
      s.status = 'FIRE';
      s.temperature = 84.5;
      s.smoke = 92.0;
      s.humidity = 11.2;
    });

    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-3)}`,
      severity: 'CRITICAL',
      sensorId: 'SEN-501',
      zone: 'Dry Ridge South (ZONE-C1)',
      timestamp: new Date().toLocaleTimeString(),
      message: 'Test Fire Scenario triggered by operator. Simulated crown fire in ZONE-C1.'
    };
    alerts.unshift(newAlert);
    res.json({ success: true, simulationState, zones, sensors, alerts });
  });

  app.post('/api/simulation/scenario', (req, res) => {
    const { scenario } = req.body;
    simulationState.scenario = scenario;
    if (scenario === 'NORMAL') {
      zones.forEach(z => z.status = 'NORMAL');
      sensors.forEach(s => {
        s.status = 'NORMAL';
        s.temperature = 23.5;
        s.smoke = 1.2;
        s.humidity = 62.0;
      });
    } else if (scenario === 'WARNING') {
      const wZone = zones.find(z => z.id === 'ZONE-B1');
      if (wZone) wZone.status = 'WARNING';
      sensors.filter(s => s.zoneId === 'ZONE-B1').forEach(s => {
        s.status = 'WARNING';
        s.temperature = 38.0;
        s.smoke = 15.0;
        s.humidity = 30.0;
      });
    } else if (scenario === 'FIRE') {
      const fZone = zones.find(z => z.id === 'ZONE-C1');
      if (fZone) fZone.status = 'FIRE';
      sensors.filter(s => s.zoneId === 'ZONE-C1').forEach(s => {
        s.status = 'FIRE';
        s.temperature = 82.0;
        s.smoke = 88.0;
        s.humidity = 12.0;
      });
    }
    res.json({ success: true, simulationState, zones, sensors });
  });

  // Setup Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fire Scout Forest Fire Detection backend running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
