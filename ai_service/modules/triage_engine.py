import time
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("civicconnect.triage")

class AITriageEngine:
    def __init__(self):
        pass

    def evaluate_triage(
        self,
        category: Optional[str] = None,
        severity_score: int = 50,
        yolo_result: Optional[Dict[str, Any]] = None,
        seg_result: Optional[Dict[str, Any]] = None,
        gemini_result: Optional[Dict[str, Any]] = None,
        upvote_count: int = 0,
        elapsed_hours: float = 0.0,
        target_sla_days: Optional[int] = None,
        location_context: Optional[str] = None,
        recurrence_count: int = 0
    ) -> Dict[str, Any]:
        """Calculate explainable multi-signal priority score, SLA risk, and department triage."""
        start_time = time.time()
        
        yolo_res = yolo_result or {}
        seg_res = seg_result or {}
        gemini_res = gemini_result or {}
        
        # 1. Base Severity Contribution (Max 35 pts)
        sev_input = gemini_res.get("severity_score", severity_score)
        severity_pts = round((sev_input / 100.0) * 35.0, 1)
        
        # 2. AI Vision Evidence Contribution (Max 25 pts)
        yolo_count = yolo_res.get("object_count", 0)
        seg_area = seg_res.get("total_mask_area_px", 0)
        ai_evidence_pts = 0.0
        if yolo_count > 0:
            ai_evidence_pts += min(yolo_count * 6.0, 15.0)
        if seg_area > 20000:
            ai_evidence_pts += 10.0
        elif seg_area > 5000:
            ai_evidence_pts += 5.0
        ai_evidence_pts = min(25.0, ai_evidence_pts)

        # 3. Community Upvotes Contribution (Max 20 pts)
        upvote_pts = min(upvote_count * 2.5, 20.0)

        # 4. SLA Risk Contribution (Max 10 pts) & SLA Target Recommendation
        rec_sla_days = target_sla_days
        if not rec_sla_days:
            if sev_input >= 80:
                rec_sla_days = 1
            elif sev_input >= 60:
                rec_sla_days = 2
            else:
                rec_sla_days = 3

        target_hours = rec_sla_days * 24.0
        sla_ratio = elapsed_hours / max(target_hours, 1.0)
        
        if sla_ratio >= 0.9 or (sev_input >= 85 and elapsed_hours > 12):
            sla_risk_level = "CRITICAL_BREACH"
            sla_risk_pts = 10.0
        elif sla_ratio >= 0.6 or sev_input >= 75:
            sla_risk_level = "HIGH"
            sla_risk_pts = 7.0
        elif sla_ratio >= 0.3:
            sla_risk_level = "MEDIUM"
            sla_risk_pts = 4.0
        else:
            sla_risk_level = "LOW"
            sla_risk_pts = 1.0

        # 5. Location & Recurrence Context (Max 10 pts)
        location_pts = 0.0
        loc_lower = (location_context or "").lower()
        if any(k in loc_lower for k in ["station", "highway", "market", "arterial", "expressway", "hospital"]):
            location_pts += 5.0
        if recurrence_count > 0:
            location_pts += min(recurrence_count * 2.5, 5.0)

        # Total Priority Score (0 - 100)
        total_priority = round(severity_pts + ai_evidence_pts + upvote_pts + sla_risk_pts + location_pts)
        total_priority = max(1, min(100, total_priority))

        # Priority Level Urgency
        if total_priority >= 80:
            urgency = "Critical"
        elif total_priority >= 60:
            urgency = "High"
        elif total_priority >= 40:
            urgency = "Medium"
        else:
            urgency = "Low"

        # Department Routing
        final_category = gemini_res.get("category", category or "Other")
        dept_map = {
            "Pothole": "Roads & Traffic Department",
            "Garbage": "Solid Waste Management (SWM)",
            "Water Leakage": "Hydraulics Department (Water Supply)",
            "Drainage": "Storm Water Drains (SWD)",
            "Streetlight": "Electrical & Streetlighting Dept",
            "Roadwork": "Maintenance & Roads Department",
            "Other": "General Municipal Works"
        }
        department = gemini_res.get("recommended_department") or dept_map.get(final_category, "General Municipal Works")

        # Human-Readable Score Explanation
        explanation = (
            f"Priority Score {total_priority}/100: Base severity (+{round(severity_pts)}), "
            f"AI vision evidence (+{round(ai_evidence_pts)}), {upvote_count} community upvotes (+{round(upvote_pts)}), "
            f"SLA risk {sla_risk_level} (+{round(sla_risk_pts)}), location/recurrence context (+{round(location_pts)})."
        )

        return {
            "status": "success",
            "category": final_category,
            "severity": sev_input,
            "priority_score": total_priority,
            "urgency": urgency,
            "department": department,
            "recommended_sla_days": rec_sla_days,
            "sla_risk": sla_risk_level,
            "score_breakdown": {
                "severity_base": f"+{round(severity_pts)}",
                "ai_vision_evidence": f"+{round(ai_evidence_pts)}",
                "community_upvotes": f"+{round(upvote_pts)}",
                "sla_risk": f"+{round(sla_risk_pts)}",
                "location_recurrence": f"+{round(location_pts)}"
            },
            "explanation": explanation,
            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
        }

ai_triage_engine = AITriageEngine()
