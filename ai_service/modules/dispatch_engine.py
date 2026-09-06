"""
CivicConnect AI — Phase 11 Smart Dispatch Engine Module
Recommends optimal municipal field repair squads, contractor units, equipment, and ETA.
"""

import math
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("civicconnect.dispatch_engine")

# Municipal Field Maintenance Depots across Mumbai
MUNICIPAL_DEPOTS = [
    {
        "id": "DEPOT-SOUTH-01",
        "name": "Fort & Colaba Central Municipal Yard",
        "ward": 1,
        "ward_code": "A",
        "lat": 18.9300,
        "lng": 72.8350,
        "departments": ["Roads & Traffic Department", "Solid Waste Management", "Hydraulic Engineer Dept"]
    },
    {
        "id": "DEPOT-BANDRA-02",
        "name": "Bandra Reclamation Central Repair Yard",
        "ward": 11,
        "ward_code": "H/W",
        "lat": 19.0550,
        "lng": 72.8280,
        "departments": ["Roads & Traffic Department", "Hydraulic Engineer Dept", "Streetlight Division"]
    },
    {
        "id": "DEPOT-ANDHERI-03",
        "name": "Andheri West Municipal Engineering Yard",
        "ward": 13,
        "ward_code": "K/W",
        "lat": 19.1200,
        "lng": 72.8320,
        "departments": ["Roads & Traffic Department", "Storm Water Drains", "Solid Waste Management"]
    },
    {
        "id": "DEPOT-DADAR-04",
        "name": "Dadar West Municipal Operations Hub",
        "ward": 9,
        "ward_code": "G/N",
        "lat": 19.0280,
        "lng": 72.8420,
        "departments": ["Solid Waste Management", "Storm Water Drains", "Roads & Traffic Department"]
    },
    {
        "id": "DEPOT-POWAI-05",
        "name": "Kanjurmarg & Powai Suburb Maintenance Yard",
        "ward": 23,
        "ward_code": "S",
        "lat": 19.1450,
        "lng": 72.9300,
        "departments": ["Roads & Traffic Department", "Hydraulic Engineer Dept", "Streetlight Division"]
    }
]

DEPARTMENT_EQUIPMENT_MAP = {
    "Pothole": {
        "department": "Roads & Traffic Department",
        "squad_name": "Asphalt Rapid Patching Squad",
        "equipment": ["Cold-Mix Asphalt Batch", "Vibratory Roller", "Safety Cones", "Infrared Asphalt Heater"],
        "base_squad_size": 4
    },
    "Garbage": {
        "department": "Solid Waste Management",
        "squad_name": "Heavy Debris & Waste Hauler Unit",
        "equipment": ["Compactor Truck", "Hydraulic Loader", "Disinfectant Sprayer"],
        "base_squad_size": 3
    },
    "Water Leakage": {
        "department": "Hydraulic Engineer Dept",
        "squad_name": "Potable Water Pipeline Repair Team",
        "equipment": ["Pipe Clamp Sealers", "Dewatering Submersible Pump", "Acoustic Leak Detector"],
        "base_squad_size": 5
    },
    "Drainage": {
        "department": "Storm Water Drains",
        "squad_name": "SWD Desilting & Pumping Crew",
        "equipment": ["High-Pressure Jetting Vehicle", "Suction Tanker", "Safety Harnesses"],
        "base_squad_size": 4
    },
    "Streetlight": {
        "department": "Streetlight Division",
        "squad_name": "Electrical Cable & Lamp Maintenance Unit",
        "equipment": ["Hydraulic Aerial Bucket Lift Truck", "Digital Multimeter", "LED Fixture Replacements"],
        "base_squad_size": 2
    },
    "Roadwork": {
        "department": "Roads & Traffic Department",
        "squad_name": "Trench Backfilling & Paving Squad",
        "equipment": ["Backhoe Loader", "Gravel Bedding Material", "Compactor Plate"],
        "base_squad_size": 6
    }
}

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class SmartDispatchEngine:
    def recommend_dispatch(
        self,
        category: Optional[str],
        severity_score: Optional[int],
        latitude: Optional[float],
        longitude: Optional[float],
        ward_code: Optional[str] = None
    ) -> Dict[str, Any]:
        cat_key = category or "Pothole"
        dept_info = DEPARTMENT_EQUIPMENT_MAP.get(cat_key, DEPARTMENT_EQUIPMENT_MAP["Pothole"])

        lat = latitude if (latitude and latitude != 0.0) else 19.0590
        lng = longitude if (longitude and longitude != 0.0) else 72.8300

        # Find nearest maintenance depot
        nearest_depot = MUNICIPAL_DEPOTS[1] # Bandra default
        min_dist = float('inf')

        for depot in MUNICIPAL_DEPOTS:
            dist = haversine_km(lat, lng, depot["lat"], depot["lng"])
            if dist < min_dist:
                min_dist = dist
                nearest_depot = depot

        dist_km = round(min_dist, 2)
        # Estimate ETA in minutes: 10 mins base + 5 mins per km
        eta_minutes = int(10 + (dist_km * 5))

        sev = severity_score or 65
        priority_tier = "P1 - URGENT DISPATCH" if sev >= 75 else ("P2 - HIGH DISPATCH" if sev >= 50 else "P3 - STANDARD DISPATCH")

        return {
            "recommended_contractor": f"BMC {ward_code or 'Ward'} {dept_info['squad_name']} #{nearest_depot['id'][-2:]}",
            "department": dept_info["department"],
            "depot_name": nearest_depot["name"],
            "depot_distance_km": dist_km,
            "estimated_eta_minutes": eta_minutes,
            "squad_size": dept_info["base_squad_size"],
            "required_equipment": dept_info["equipment"],
            "priority_tier": priority_tier,
            "dispatch_status": "READY_FOR_OFFICER_CONFIRMATION"
        }

dispatch_engine = SmartDispatchEngine()
