# 🏙️ KAISER AI

**AI-Powered Civic Issue Reporting, Real-Time YOLOv8 Vision & Forensic Fraud Prevention Engine**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.6_Flash-8e44ad.svg)](https://ai.google.dev/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Vision_Engine-ff6b6b.svg)](https://ultralytics.com/)

KAISER AI is a next-generation municipal grievance redressal and smart city management platform. Built for civic bodies (such as Brihanmumbai Municipal Corporation / BMC), it leverages **Google Gemini 3.6 Flash Multimodal AI** alongside **Ultralytics YOLOv8 real-time object detection** to automatically verify, categorize, severity-score, ward-route, and detect fraud in citizen complaints.

---

## ✨ Key Features

### 1. 🔍 Dual-Engine AI Vision & Anti-Fraud Shield
- **YOLOv8 Real-Time Object Bounding**: Identifies civic hazards (potholes, garbage dumps, water pipe leaks, streetlight failures) with exact percentage bounding boxes.
- **🚨 AI-Generated / Synthetic Image Detection**: Prevents ward officers or users from submitting fake AI-repaired images (e.g. Midjourney, DALL-E, Photoshop fake road repairs).
- **💻 Computer Code / IDE Screenshot Blocking**: Rejects code snippets, terminal screens, and non-civic media.
- **📱 Gadget & Indoor Photo Filter**: Rejects indoor furniture, pets, selfies, and mobile devices.
- **📷 Camera Sensor Verification**: Ensures uploaded photos are clicked directly from an authentic camera sensor on site.

### 2. 🗺️ Ward Auto-Routing & Geo-Fencing
- Auto-locates citizen reports via browser Geolocation API or interactive Leaflet Map selector.
- Automatically maps coordinates to municipal administrative wards (e.g., K-West Vile Parle, H-West Bandra, A-Ward Colaba).
- Assigns priority severity levels (P1 Urgent to P4 Low) based on visual structural damage.

### 3. 📊 Municipal Officer Command Center & Heatmaps
- Real-time interactive resolution workflows for municipal officers.
- Geospatial heatmap of high-density hazard clusters.
- AI Action Recommendation engine for field repair crews.
- Full SLA tracking and citizen status updates.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer), Recharts, Leaflet / React-Leaflet, Lucide Icons.
- **Backend**: Express.js (Node.js CJS/ESM via esbuild), TypeScript (`tsx`).
- **AI & Computer Vision**:
  - Google Gemini 3.6 Flash (`@google/genai` TypeScript SDK)
  - Ultralytics YOLOv8 Bounding & Sensor Analysis Engine
- **Build System**: Vite 6, esbuild.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or v20.x or higher
- **npm** or **bun** or **yarn**
- **Google Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/civic-connect-ai.git
   cd civic-connect-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and insert your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   In `.env`:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Repository Architecture

```text
├── server.ts                 # Express Server, Gemini AI & YOLOv8 Anti-Fraud Engine
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Primary layout & routing
│   ├── types.ts              # Global TypeScript interfaces & YOLO telemetry types
│   ├── components/
│   │   ├── ImageUploader.tsx # Photo upload with YOLOv8 live bounding box overlay
│   │   ├── MapPicker.tsx     # Leaflet map location selector
│   │   └── Navbar.tsx        # Responsive navigation
│   └── pages/
│       ├── HomePage.tsx      # Main dashboard & live complaint feed
│       ├── ReportPage.tsx    # Citizen complaint submission page
│       ├── ComplaintDetailsPage.tsx # Detailed report view & officer actions
│       └── AdminPage.tsx     # Officer Command Center & analytics
├── .env.example              # Environment key blueprint
├── ARCHITECTURE.md           # Deep-dive system architecture
└── package.json              # Package manifest & build scripts
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for multimodal vision verification & analysis |
| `APP_URL` | Optional | Public application domain URL (Defaults to `http://localhost:3000`) |

---

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
