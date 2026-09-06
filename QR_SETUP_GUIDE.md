# 📱 QR Setup & Public Service Rating Guide — CivicConnect

This guide provides instructions for municipal engineers, ward staff, and facility operators to generate, deploy, and monitor QR codes for public amenities across all 24 administrative wards of Mumbai.

---

## 🎯 Overview

The **Public Service QR Rating System** allows citizens to scan physical QR codes placed on municipal assets to provide instant hygiene, maintenance, and safety feedback. Citizens earn **+20 Civic Points** per audit, driving community participation and real-time municipal oversight.

---

## 🏛️ Supported Facility Categories

1. **Public Restrooms / Toilets** (Cleanliness, Soap availability, Water supply, Odor, Lighting)
2. **Bus Stops & Depots** (Shelter integrity, Seating maintenance, Garbage bins, Lighting)
3. **Waste Bins & Disposal Spots** (Overflow state, Odor control, Vector sanitization)
4. **Public Parks & Gardens** (Play equipment, Pathways, Lawn maintenance, Safety)
5. **Water Kiosks & Fountains** (Potability, Tap leaking, Filter maintenance)
6. **Healthcare Centers & Clinics** (Waiting room cleanliness, Queue management)

---

## 🚀 How to Generate & Deploy QR Stickers

### Step 1: Access QR Facility Generator
Navigate to `/qr-rating` in the web application or click **"QR Rating"** in the top navigation bar.

### Step 2: Select Facility ID & Target Ward
Each public asset is assigned a unique Municipal Facility ID format:
- `FAC-[WARD_CODE]-[ASSET_ID]`
- Example: `FAC-BND-01` (Bandra West Public Restroom #4)
- Example: `FAC-DDR-02` (Dadar Market Bus Stop Shelter)

### Step 3: Print & Mount QR Sticker
1. Export or print the generated QR code sticker containing the deep link:
   `http://localhost:5173/qr-rating?facilityId=FAC-BND-01`
2. Mount the sticker on weatherproof vinyl laminate at a height of 1.2m to 1.5m at the facility entrance.

---

## 📊 Officer Oversight & Real-Time Action

When ratings drop below **3.0 / 5.0**:
- An automatic alert is dispatched to the Ward Assistant Engineer's Control Room.
- Solid Waste Management (SWM) or Electrical Squad is auto-assigned within **4 hours**.
- Action Taken Reports (ATR) are verified upon squad completion.

---

## 💡 Citizen Reward Integration

- **+20 Points** per submitted service audit.
- **+50 Points** for attaching a verified defect photo.
- Unlocks badges: `QR Auditor`, `Sanitation Sentinel`, `Urban Inspector`.
