# Fire Scout – Forest Fire Detection System

Fire Scout is a complete Forest Fire Detection and Monitoring System featuring a backend telemetry engine and a nature-inspired forest green & fire orange web dashboard.

---

## 🏗️ Project Architecture

- **Backend:** Java Spring Boot equivalent REST API built with Node.js & Express (`server.ts`).
- **Frontend:** React + Vite SPA matching Streamlit & Forest theme requirements (`src/App.tsx`).
- **Communication:** REST APIs using HTTP and JSON (`/api/...`).
- **Storage:** In-memory simulation state for sensors, forest zones, and alerts.

---

## 🎨 Theme & Design

- **Color Theme:** Dark forest green background and sidebar (`#0F291E`), deep charcoal panels (`#1A2421`), fire orange warnings (`#D9531E`), bright red fire alerts (`#C42B12`), light green normal status (`#4E9F3D`), and light grey typography.
- **Logo:** Flame and leaf emblem.
- **Navigation:** Overview, Forest Monitoring, Sensor Analytics, Alerts & Events, and Simulation Controls.

---

## 🔌 REST API Endpoints

- `GET /api/sensors` – Get all sensors.
- `GET /api/zones` – Get forest zone statuses.
- `GET /api/readings/latest` – Get latest sensor telemetry summary.
- `GET /api/alerts` – Get alert history.
- `GET /api/simulation/status` – Get simulation status.
- `POST /api/simulation/start` – Start simulation.
- `POST /api/simulation/pause` – Pause simulation.
- `POST /api/simulation/resume` – Resume simulation.
- `POST /api/simulation/reset` – Reset simulation.
- `POST /api/simulation/trigger-fire` – Trigger test fire in ZONE-C1.
- `POST /api/simulation/scenario` – Switch scenarios (NORMAL, WARNING, FIRE).

---

## 📦 Setup & Execution

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server (backend + frontend):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
