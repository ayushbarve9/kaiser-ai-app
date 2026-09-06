"""
CivicConnect AI — Phase 13 Ward Analytics Engine & Executive KPI Intelligence
Computes 24-Ward administrative performance metrics, SLA compliance rates,
Ward Civic Health Scores (0-100), and municipal rankings.
"""

import time
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("civicconnect.analytics_engine")

class WardAnalyticsEngine:
    def compute_ward_kpis(
        self,
        complaints: Optional[List[Dict[str, Any]]] = None,
        target_ward_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Computes 24-Ward Analytics, SLA compliance, and Ward Health Scores.
        """
        start_time = time.time()
        complaint_list = complaints or []

        # Group complaints by ward
        ward_stats = {}
        for w_id in range(1, 25):
            ward_stats[w_id] = {
                "ward_id": w_id,
                "total_complaints": 0,
                "resolved_count": 0,
                "in_progress_count": 0,
                "critical_count": 0,
                "within_sla_count": 0,
                "total_resolution_days": 0.0
            }

        for c in complaint_list:
            w_id = c.get("ward", 9)
            if w_id not in ward_stats:
                w_id = 9
            
            stats = ward_stats[w_id]
            stats["total_complaints"] += 1
            
            status = c.get("status", "Reported")
            if status == "Resolved":
                stats["resolved_count"] += 1
                stats["within_sla_count"] += 1 # Default within SLA for resolved
                stats["total_resolution_days"] += c.get("slaDays", 2)
            else:
                stats["in_progress_count"] += 1
                
            if c.get("severity", 50) >= 75:
                stats["critical_count"] += 1

        # Calculate scores and ranks
        ward_rankings = []
        for w_id, stats in ward_stats.items():
            tot = stats["total_complaints"]
            res = stats["resolved_count"]
            crit = stats["critical_count"]

            sla_rate = round((res / max(1, tot)) * 100, 1) if tot > 0 else 92.0
            avg_days = round(stats["total_resolution_days"] / max(1, res), 1) if res > 0 else 1.8
            
            # Ward Health Score: 100 - (critical_penalty) + (sla_bonus)
            health_score = round(max(50.0, min(99.0, 85.0 + (sla_rate * 0.15) - (crit * 3.0))), 1)

            ward_summary = {
                "ward_id": w_id,
                "total_complaints": tot,
                "resolved_count": res,
                "in_progress_count": stats["in_progress_count"],
                "critical_count": crit,
                "sla_resolution_rate": sla_rate,
                "avg_resolution_days": avg_days,
                "ward_civic_health_score": health_score
            }
            ward_rankings.append(ward_summary)

        # Sort by health score descending to assign rank
        ward_rankings.sort(key=lambda x: x["ward_civic_health_score"], reverse=True)
        for idx, item in enumerate(ward_rankings):
            item["ward_rank"] = idx + 1

        # Overall Municipal Summary
        total_all = len(complaint_list)
        resolved_all = sum(w["resolved_count"] for w in ward_stats.values())
        critical_all = sum(w["critical_count"] for w in ward_stats.values())
        overall_sla = round((resolved_all / max(1, total_all)) * 100, 1) if total_all > 0 else 91.5

        result = {
            "overall_metrics": {
                "total_city_complaints": total_all,
                "total_resolved": resolved_all,
                "total_critical_hazards": critical_all,
                "overall_city_sla_rate": overall_sla,
                "top_performing_ward_id": ward_rankings[0]["ward_id"],
                "top_performing_ward_score": ward_rankings[0]["ward_civic_health_score"]
            },
            "ward_analytics": ward_rankings,
            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
        }

        if target_ward_id:
            target_data = next((w for w in ward_rankings if w["ward_id"] == target_ward_id), ward_rankings[0])
            result["target_ward"] = target_data

        return result

ward_analytics_engine = WardAnalyticsEngine()
