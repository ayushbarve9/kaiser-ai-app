# 📋 CivicConnect System Requirements & API Reference

Comprehensive requirements, dependency list, environment configuration, and role permission guidelines for CivicConnect (KAISER Municipal Intelligence Engine).

---

## 🛠️ System Prerequisites

| Component | Minimum Version | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x` or `v22.x` | Runtime for Express backend & Vite build |
| **npm** | `v9.0.0` | `v10.x` | Package manager |
| **Python** | `3.10` | `3.11` or `3.13` | Required for optional AI Service & PyTorch |
| **Browser** | Chrome 100+, Edge 100+, Firefox 100+ | Latest Chrome | HTML5 Geolocation & Camera required |

---

## ⚙️ Environment Variables Setup

Create `.env` in project root:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_here
AI_SERVICE_URL=http://localhost:5001
VITE_ANALYZE_URL=http://localhost:8000
```

---

## 🌐 API Route Specifications

### Citizen & Grievance Routes
- `GET /api/complaints` — Retrieve all civic grievances (with ward, status, and department filtering).
- `GET /api/complaints/:id` — Detailed complaint dossier with comments, timeline, and ATR.
- `POST /api/complaints` — Submit new grievance with photo URL, geolocation, and category.
- `POST /api/complaints/:id/upvote` — Upvote community grievance (+5 Citizen Points).
- `POST /api/complaints/:id/comments` — Post citizen or official comment.

### Government & Officer Workflows
- `PATCH /api/complaints/:id` — Update complaint status (Reported -> Assigned -> In Progress -> Resolved).
- `GET /api/complaints/:id/atr` — Retrieve official Action Taken Report (ATR).
- `POST /api/complaints/:id/atr` — Generate & sign-off official Action Taken Report.
- `POST /api/complaints/:id/resolve-email` — Dispatch resolution completion email to citizen.

### QR Service Rating & Gamification
- `GET /api/public-services/ratings` — Fetch public facility ratings by facility ID or ward.
- `POST /api/public-services/rate` — Submit 1-5 star hygiene rating for public amenities (+20 Points).
- `GET /api/user/rewards` — Fetch citizen reward points balance, level, and earned badges.
- `POST /api/points/award` — Credit points for citizen participation.

### AI Assistance & Vision
- `POST /api/analyze-image` — Image analyzer compatibility endpoint (CLIP / YOLO category & severity hints).
- `POST /api/ai/full-analysis` — Fused 5-signal AI triage (YOLO11 + Segmentation + OCR + Ward GIS + Gemini).

---

## 👥 Role Permissions Matrix

| Feature / Page | Citizen Role | Ward Officer Role | Admin Role |
| :--- | :---: | :---: | :---: |
| **Submit Grievance** | ✅ | ✅ | ✅ |
| **Upvote & Comment** | ✅ | ✅ | ✅ |
| **Rate Public Services (QR)** | ✅ | ✅ | ✅ |
| **Earn Points & Badges** | ✅ | ❌ | ❌ |
| **View ATR Dossier** | ✅ | ✅ | ✅ |
| **Dispatch Squad & Assign Department** | ❌ | ✅ | ✅ |
| **Generate & Sign-Off ATR** | ❌ | ✅ | ✅ |
| **Manage Officer Directory** | ❌ | ❌ | ✅ |
