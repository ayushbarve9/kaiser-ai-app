# 🏙️ KAISER Civic Intelligence Engine (BMC Mumbai)

**AI-Powered Civic Grievance Redressal, YOLO11 Vision, 24-Ward GIS, Gemini Fusion & Municipal Intelligence System**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-8e44ad.svg)](https://ai.google.dev/)
[![YOLO11](https://img.shields.io/badge/YOLO11-Object_Detection_%26_Seg-ff6b6b.svg)](https://ultralytics.com/)
[![GIS](https://img.shields.io/badge/GIS-24_Mumbai_Wards-green.svg)](https://portal.mcgm.gov.in/)

KAISER Civic Intelligence is an end-to-end municipal grievance redressal, smart dispatch, and urban intelligence platform engineered for the **Brihanmumbai Municipal Corporation (BMC)**. Powered by a dual-backend architecture (Node.js Express + Python FastAPI), it integrates **YOLO11 Object Detection**, **YOLO11-Seg Instance Segmentation**, **Gemini 2.5 Flash Multimodal Fusion**, **24-Ward Point-in-Polygon GIS Engine**, **DBSCAN Spatial Clustering**, and **Anti-Fraud Security Shielding**.

---

## 🚀 Architectural Overview & 21-Phase Master Plan

```
                   +---------------------------------------+
                   |    React 19 Frontend (Port 3000)      |
                   |   Lucide + Motion + Recharts + GIS    |
                   +-------------------+-------------------+
                                       |
                                       v
                   +-------------------+-------------------+
                   |    Express Backend (Port 3000)        |
                   |   API Router & Express Proxies        |
                   +-------------------+-------------------+
                                       |
                                       v
                   +-------------------+-------------------+
                   |    Python FastAPI AI Microservice     |
                   |            (Port 5001)                |
                   +-------------------+-------------------+
                                       |
       +-------------------------------+-------------------------------+
       |                               |                               |
       v                               v                               v
+--------------+               +---------------+               +---------------+
| YOLO11 Engine|               | 24-Ward GIS   |               | Gemini Fusion |
| & YOLO11-Seg |               | Point-Polygon |               | & AI Triage   |
+--------------+               +---------------+               +---------------+
       |                               |                               |
       +-------------------------------+-------------------------------+
                                       |
                                       v
                   +-------------------+-------------------+
                   | Smart Dispatch + Hotspots + Health    |
                   |   Security Anti-Fraud Shield Engine   |
                   +---------------------------------------+
```

### 📋 21 Master Execution Phases Completed

1. **Phase 0 — Repository & Structural Audit:** Audited existing React components, Node server, and 24-ward municipal schema.
2. **Phase 1 — FastAPI AI Microservice Foundation:** Configured Python FastAPI microservice daemon on port `5001`.
3. **Phase 2 — YOLO11 Object Detection Engine:** Pothole, garbage dump, water leak, and streetlight failure detection (`/yolo/detect`).
4. **Phase 3 — YOLO11-Seg Instance Segmentation Engine:** Pixel-level defect polygon boundary segmentation (`/segmentation/predict`).
5. **Phase 4 — Gemini + AI Fusion Engine:** Fuses visual telemetry with text context for multi-modal severity scoring (`/fusion/analyze`).
6. **Phase 5 — AI Triage & Priority SLA Engine:** Computes priority tier (P1 Urgent to P4 Low) and SLA target hours (`/triage/evaluate`).
7. **Phase 6 — Duplicate Detection Engine:** Haversine spatial proximity + TF-IDF textual similarity deduplication (`/duplicate/search`).
8. **Phase 7 — OCR Engine:** Tesseract & EasyOCR street sign / vehicle plate text extraction (`/ocr/extract`).
9. **Phase 8 — GPS + 24-Ward GIS Point-in-Polygon Engine:** Ray-casting polygon intersection across all 24 BMC administrative wards (`/gis/resolve_ward`).
10. **Phase 9 — Citizen AI Grievance Flow Integration:** Live AI verification and automated ward resolution in `ReportPage.tsx`.
11. **Phase 10 — Officer Control Room Enhancements:** Multi-signal triage, SLA timers, and field assignment in `AdminHub.tsx`.
12. **Phase 11 — Smart Dispatch Engine:** Nearest AMC ward squad & equipment recommendation (`/dispatch/recommend`).
13. **Phase 12 — Before/After Resolution AI Verification Engine:** SSIM structural similarity comparison for repair sign-off (`/resolution/verify`).
14. **Phase 13 — Ward Analytics & Executive KPI Intelligence:** SLA velocity, contractor quality, and resolution rate analytics (`/analytics/ward_kpis`).
15. **Phase 14 — Ward Hotspots & Spatial Clustering Engine:** DBSCAN spatial clustering of recurring municipal defects (`/hotspots/cluster`).
16. **Phase 15 — Recurring Issue Intelligence & Chronic Defect Engine:** Chronic defect flagging and root-cause analysis (`/recurrence/evaluate`).
17. **Phase 16 — Predictive Analytics & Seasonal Hazard Engine:** Rainfall & high-tide flood vulnerability modeling (`/predictive/monsoon_risk`).
18. **Phase 17 — Ward Civic Health Score & Performance Ranking Engine:** 5-dimension weighted score (0–100) and Grades A+ to C (`/civic_health/calculate`).
19. **Phase 18 — Command Palette Extension:** `Ctrl+K` municipal ward search, shortcuts, and keyboard navigation in `CommandPalette.tsx`.
20. **Phase 19 — AI Assistant Expansion for Municipal Queries:** Real-time municipal Q&A with Gemini 2.5 Flash + BMC Knowledge Base (`/assistant/query`).
21. **Phase 20 — Security, Anti-Fraud Shield & Performance Optimization:** XSS sanitization, spam blocking, rate limiting, and GPS geofencing (`/security/audit`).

---

## 🛠️ Technology Stack

- **Frontend UI:** React 19, TypeScript 5.8, Tailwind CSS v4, Motion (Framer), Recharts, Leaflet / React-Leaflet, Lucide Icons.
- **Backend API:** Node.js Express (`server.ts` on port 3000), TypeScript (`tsx`).
- **AI Microservice:** Python 3.13, FastAPI, Uvicorn (`ai_service/main.py` on port 5001), PyTorch, OpenCV, NumPy.
- **Computer Vision & Multimodal:**
  - Ultralytics **YOLO11** (Object Detection)
  - Ultralytics **YOLO11-Seg** (Instance Segmentation)
  - **Google Gemini 2.5 Flash** (`google-genai` Python & Node SDKs)
  - Tesseract OCR & OpenCV SSIM image comparison
- **Geospatial & Analytics:** 24-Ward Mumbai GIS Boundaries, Ray-Casting Point-in-Polygon Engine, DBSCAN Spatial Clustering.

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.10+ or v3.13+
- **npm** or **bun**

### 1. Install Dependencies
```bash
# Frontend & Express dependencies
npm install

# Python AI dependencies
pip install fastapi uvicorn pydantic requests numpy opencv-python ultralytics google-genai
```

### 2. Configure Environment
Copy `.env.example` to `.env` and supply your Gemini API key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
AI_SERVICE_URL="http://127.0.0.1:5001"
```

### 3. Start Python FastAPI AI Daemon (Port 5001)
```bash
python -u -m uvicorn ai_service.main:app --host 127.0.0.1 --port 5001
```

### 4. Start Express Web Server (Port 3000)
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Verification & Audit Commands

Run individual or master verification suites at any time:

```bash
# Master End-to-End System Audit across all 21 phases
python scratch/test_phase21_master_audit.py

# Python AI Assistant endpoint test
python scratch/test_phase19_ai_assistant.py

# Security & Anti-Fraud Shield test
python scratch/test_phase20_security.py

# TypeScript lint check
npm run lint
```

---

## 🏛️ 24 BMC Administrative Wards Covered

| Ward Code | Administrative Ward Name | Key Locations Covered | AMC Officer |
|---|---|---|---|
| **A** | A-Ward | Colaba, Fort, Churchgate, Cuffe Parade | Shri Prashant S. Gaikwad |
| **B** | B-Ward | Masjid Bunder, Dongri, Mohamedali Road | Smt. Dhanaji Herwade |
| **C** | C-Ward | Marine Lines, Kalbadevi, Charni Road | Shri Chakrapani Alle |
| **D** | D-Ward | Malabar Hill, Grant Road, Breach Candy | Shri Sharad Ughade |
| **E** | E-Ward | Byculla, Mazgaon, Nagpada | Shri Ajay Yadav |
| **F/S** | F-South Ward | Parel, Sewri, Lalbaug | Shri Swapnaja Kshirsagar |
| **F/N** | F-North Ward | Matunga, Wadala, Sion | Shri Gajanan Bellale |
| **G/S** | G-South Ward | Worli, Prabhadevi, Lower Parel | Shri Sharadkumar B. Ughade |
| **G/N** | G-North Ward | Dadar, Mahim, Dharavi, Shivaji Park | Shri Kiran Dighavkar |
| **H/E** | H-East Ward | Bandra East, BKC, Santacruz East | Shri Swapnil Dhamal |
| **H/W** | H-West Ward | Bandra West, Khar West, Santacruz West | Shri Vinayak Vispute |
| **K/E** | K-East Ward | Andheri East, Vile Parle East, SEEPZ | Shri Manish Valanju |
| **K/W** | K-West Ward | Andheri West, Vile Parle West, Juhu | Shri Prithviraj Chauhan |
| **P/S** | P-South Ward | Goregaon East, Goregaon West, Aarey | Shri Rajesh Akre |
| **P/N** | P-North Ward | Malad East, Malad West, Marve | Shri Lalit Tarde |
| **R/S** | R-South Ward | Kandivali East, Kandivali West, Charkop | Shri Sandhya Nandedkar |
| **R/C** | R-Central Ward | Borivali East, Borivali West, Gorai | Shri Vivek Rane |
| **R/N** | R-North Ward | Dahisar East, Dahisar West | Shri Sandeep Vaishampayan |
| **L** | L-Ward | Kurla, Sakinaka, Chandivali | Shri Dhanaji Herwade |
| **M/E** | M-East Ward | Govandi, Mankhurd, Deonar | Shri Alka Sasane |
| **M/W** | M-West Ward | Chembur, Tilak Nagar | Shri Vishwas Mote |
| **N** | N-Ward | Ghatkopar East, Ghatkopar West | Shri Sanjay Jadhvar |
| **S** | S-Ward | Bhandup, Kanjurmarg, Powai | Shri Abhay Jagtap |
| **T** | T-Ward | Mulund East, Mulund West | Shri Chakrapani Alle |

---

## 📜 License & Acknowledgments

- Built for **Brihanmumbai Municipal Corporation (BMC)** Smart City Operations.
- Released under the [MIT License](LICENSE).
