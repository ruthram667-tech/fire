/**
 * Fire Scout API Client for communicating with the backend (Spring Boot REST API simulation)
 */

const API_BASE = '/api';

export async function fetchSystemStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function fetchSensorData() {
  const res = await fetch(`${API_BASE}/sensors`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function fetchFireStatus() {
  const res = await fetch(`${API_BASE}/fire`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function fetchRoverStatus() {
  const res = await fetch(`${API_BASE}/rover`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function fetchLogs() {
  const res = await fetch(`${API_BASE}/logs`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function startRover() {
  const res = await fetch(`${API_BASE}/rover/start`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start rover');
  return res.json();
}

export async function stopRover() {
  const res = await fetch(`${API_BASE}/rover/stop`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop rover');
  return res.json();
}

export async function resolveAlert(id: string) {
  const res = await fetch(`${API_BASE}/alerts/${id}/resolve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to resolve alert');
  return res.json();
}

export async function triggerFire(active: boolean) {
  const res = await fetch(`${API_BASE}/trigger-fire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active })
  });
  if (!res.ok) throw new Error('Failed to trigger fire simulation');
  return res.json();
}

export async function toggleDemoMode(demoMode: boolean) {
  const res = await fetch(`${API_BASE}/settings/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demoMode })
  });
  if (!res.ok) throw new Error('Failed to update demo mode');
  return res.json();
}
