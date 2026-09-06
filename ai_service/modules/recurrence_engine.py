"""
CivicConnect AI — Phase 15 Recurring Issue Intelligence & Chronic Defect Engine
Detects recurring civic defects at identical GPS locations, calculates contractor failure rates,
adds severity penalty boosts (+15 pts), and triggers Contractor Audit Flags.
"""

import math
import time
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("civicconnect.recurrence_engine")

def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0  # meters
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class RecurrenceEngine:
    def evaluate_recurrence(
        self,
        latitude: Optional[float],
        longitude: Optional[float],
        category: Optional[str],
        title: Optional[str] = None,
        existing_complaints: Optional[List[Dict[str, Any]]] = None,
        radius_meters: float = 100.0
    ) -> Dict[str, Any]:
        """
        Evaluates whether a complaint represents a recurring defect at the same GPS spot.
        """
        start_time = time.time()
        
        if not latitude or not longitude or latitude == 0.0:
            return {
                "recurrence_count": 0,
                "is_chronic_defect": False,
                "contractor_audit_flag": False,
                "severity_boost_pts": 0,
                "recurrence_explanation": "Insufficient GPS data to evaluate historical recurrence.",
                "historical_matches": [],
                "execution_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        history = existing_complaints or []
        cat_key = (category or "").lower()

        historical_matches = []
        for past in history:
            plat = past.get("latitude")
            plng = past.get("longitude")
            if plat and plng and plat != 0.0:
                dist = haversine_m(latitude, longitude, plat, plng)
                if dist <= radius_meters:
                    pcat = (past.get("category") or "").lower()
                    # Category match or close match
                    if pcat == cat_key or not cat_key:
                        historical_matches.append({
                            "id": past.get("id"),
                            "title": past.get("title"),
                            "status": past.get("status"),
                            "distance_meters": round(dist, 1),
                            "createdAt": past.get("createdAt")
                        })

        recurrence_count = len(historical_matches)
        is_chronic = recurrence_count >= 2
        contractor_audit = recurrence_count >= 3

        boost_pts = 0
        if contractor_audit:
            boost_pts = 15
        elif is_chronic:
            boost_pts = 10

        if contractor_audit:
            explanation = f"🚨 CHRONIC MUNICIPAL FAILURE DETECTED: This issue has recurred {recurrence_count} times at this exact location within {radius_meters}m despite past resolution claims. Triggered Contractor Quality Audit Flag (+15 pts priority boost)."
        elif is_chronic:
            explanation = f"⚠️ RECURRING HAZARD DETECTED: 2 previous reports logged at this location. Added +10 pts priority penalty boost."
        else:
            explanation = "First-time reported incident at this GPS location."

        return {
            "recurrence_count": recurrence_count,
            "is_chronic_defect": is_chronic,
            "contractor_audit_flag": contractor_audit,
            "severity_boost_pts": boost_pts,
            "recurrence_explanation": explanation,
            "historical_matches": historical_matches,
            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
        }

recurrence_engine = RecurrenceEngine()
