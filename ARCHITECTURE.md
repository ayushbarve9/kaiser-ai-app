# 🏗️ KAISER AI Architecture & System Specification

This document provides a technical overview of the architecture, data flow, computer vision pipeline, and API endpoints of KAISER AI.

---

## 1. High-Level Architecture Diagram

```text
 [ Citizen Mobile / Web Browser ]
                 │
                 │ HTTP / REST API (Port 3000)
                 ▼
 ┌─────────────────────────────────────────────────────────┐
 │ Node.js + Express Server (server.ts)                   │
 │                                                         │
 │  ├── /api/ai/verify-image                              │
 │  │    ├── 1. Heuristic Anti-Fraud Filter                 │
 │  │    │      (Detects Code Screenshots, AI Synthetics)  │
 │  │    ├── 2. Gemini 3.6 Flash Multimodal Analysis      │
 │  │    └── 3. YOLOv8 Object Bounding & Sensor Forensics │
 │  │                                                      │
 │  ├── /api/reports (CRUD & Ward Assignment)              │
 │  └── /api/stats (Analytics & Heatmap Clusters)          │
 └─────────────────────────────────────────────────────────┘
                 │
                 ▼
 ┌─────────────────────────────────────────────────────────┐
 │ External AI Engines                                     │
 │  └── Google Gemini 3.6 Flash API (@google/genai)        │
 └─────────────────────────────────────────────────────────┘
```

---

## 2. Computer Vision & Anti-Fraud Verification Pipeline

When an image is submitted (either via file upload or quick sample selector), the request hits `/api/ai/verify-image`. The verification pipeline executes 3 sequential layers:

### Layer 1: Heuristic Forensic Filter
- Inspects Base64 image payload, filenames, and EXIF metadata.
- Immediately blocks known synthetic AI patterns (`ai_generated`, `midjourney`, `dalle`, `fake_repair`), IDE code screenshots (`vscode`, `source_code`, `typescript`), and consumer gadgets (`iphone`, `gadget`).

### Layer 2: Multimodal Deep Analysis (Google Gemini 3.6 Flash)
- Sends the image to `gemini-3.6-flash` using `responseMimeType: "application/json"`.
- Instructs the AI model with strict zero-tolerance rules to inspect for:
  1. **Synthetic / AI-Generated Manipulations**: Identifies unnaturally smooth road surfaces, airbrushed pothole fills, or digital painting over road damage.
  2. **Code & Screen Artifacts**: Identifies syntax highlighting, code blocks, monitor borders, or text documents.
  3. **Municipal Relevance**: Validates whether the image depicts real outdoor infrastructure hazards (potholes, garbage dumps, water pipe leaks, broken streetlights).

### Layer 3: Ultralytics YOLOv8 Bounding & Sensor Telemetry Engine
- Calculates bounding box coordinates `[ymin, xmin, ymax, xmax]` in relative percentages (0-100%).
- Annotates detected hazards (e.g., `YOLOv8: Pothole Cavity Hazard 97.4%`) with emerald bounding boxes or flags fraud (`IDE / Source Code Editor 99.4%`) with pulsing red bounding boxes.
- Generates camera sensor metadata (`isOriginalSensor`, `deviceType`, `hasExifGps`).

---

## 3. Data Flow & Ward Auto-Routing

1. **Location Resolution**:
   - Browser Geolocation API extracts latitude/longitude.
   - Nearest municipal administrative ward (e.g. K-West Vile Parle, H-West Bandra, A-Ward Colaba) is computed using spatial proximity heuristics.
2. **Severity Scoring**:
   - P1 (Critical Urgent): Active water pipe bursts, deep cave-in potholes on major arterial roads, open high-voltage streetlight wires.
   - P2 (High Priority): Large road potholes, overflowing garbage dumps near schools/hospitals.
   - P3 (Medium Priority): Minor pavement cracks, dark streetlights.
   - P4 (Low Priority): Minor littering, cosmetic footpath chips.
3. **Officer Workflow**:
   - Municipal officers view complaints on the Admin Command Center dashboard.
   - Status transitions: `Submitted` ➔ `In Progress` ➔ `Resolved`.
   - Officer must upload a verified camera photo of the completed repair before marking `Resolved`.

---

## 4. API Reference

### `POST /api/ai/verify-image`
Inspects an image for civic issue validity, AI manipulation, and YOLOv8 object detection.

**Request Body**:
```json
{
  "imageUrl": "data:image/jpeg;base64,...",
  "category": "Pothole",
  "title": "Deep pothole on SV Road",
  "description": "Hazardous road cave-in causing traffic jams."
}
```

**Response**:
```json
{
  "isValidCivicIssue": true,
  "isAIGenerated": false,
  "isRealCameraPhoto": true,
  "detectedObject": "Road Pothole Cavity",
  "isCategoryMatch": true,
  "confidenceScore": 96,
  "rejectionReason": null,
  "yoloDetection": {
    "model": "Ultralytics YOLOv8x-Civic (v8.2.0 Vision Engine)",
    "inferenceTimeMs: 16,
    "detectedBoxes": [
      {
        "label": "YOLOv8: Pothole Cavity Hazard",
        "confidence": 97.4,
        "bbox": [26, 20, 78, 80],
        "color": "green",
        "isHazard": true
      }
    ],
    "cameraMetadata": {
      "isOriginalSensor": true,
      "deviceType": "Real Mobile CMOS Camera",
      "hasExifGps": true
    }
  }
}
```

---

## 5. Security & Deployment Best Practices

- **API Keys**: `GEMINI_API_KEY` is kept strictly on the backend server (`server.ts`) and never exposed to the browser client.
- **Production Bundle**: Built using `esbuild` into CommonJS (`dist/server.cjs`) for clean deployment on Node.js / Docker / Cloud Run containers.
