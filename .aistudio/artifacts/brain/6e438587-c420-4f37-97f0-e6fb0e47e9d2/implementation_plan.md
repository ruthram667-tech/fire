# Fire Scout - Project Renaming & Branding Plan

Update the application branding, title tags, and header lockups to prominently feature "FIRE SCOUT" while maintaining the Light Fire theme and 3D thermal hazard telemetry dashboard.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Confirmed Project Name**: Fire Scout
> - **Confirmed Theme**: Light Fire theme with warm ash-paper background, soot-brown panels, ember red severity indicators, and ash-grain texture.

## 1. Overview & Core Concept

- **What It Does**: Formalizes the project identity under the name **FIRE SCOUT**, updating all top navigation headers, metadata, titles, and UI branding.
- **Target Audience / Persona**: Plant safety officers and industrial fire monitoring engineers.

## 2. User Experience & Visual Design

- **Branding Update**: Update page titles (`index.html`), header wordmarks (`metadata.json`, `App.tsx`), and subtitles to reflect "FIRE SCOUT".
- **Visual Theme**: Preserve the Light Fire theme (`#F6F0EA` ash-paper background, `#FCF9F6` cards, `#C42B12` ember red, `#2A1B15` soot-brown panel, ash-grain texture).

## 3. Key Product Decisions & Trade-Offs

- **Decision 1**: Centralized branding update across HTML metadata, React headers, and state manifests to ensure consistency.

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│               App.tsx (Fire Scout Root)                │
├────────────────────────────┬───────────────────────────┤
│ Header Branding            │ Main Dashboard Workspace  │
│ - "FIRE SCOUT" Wordmark    │ - 3D Thermal Canvas       │
│ - Test State Switcher      │ - Telemetry Matrix        │
│ - Light/Dark Theme Toggle  │ - Hazard Summary Panel    │
└────────────────────────────┴───────────────────────────┘
```
