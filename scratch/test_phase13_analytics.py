"""
CivicConnect Phase 13 Ward Analytics Engine Automated Verification Test
"""

import json
import urllib.request

sample_complaints = [
    {"id": "C-1", "ward": 11, "status": "Resolved", "severity": 85, "slaDays": 1},
    {"id": "C-2", "ward": 11, "status": "In Progress", "severity": 90, "slaDays": 2},
    {"id": "C-3", "ward": 9, "status": "Resolved", "severity": 50, "slaDays": 2},
    {"id": "C-4", "ward": 1, "status": "Resolved", "severity": 65, "slaDays": 1},
    {"id": "C-5", "ward": 23, "status": "Reported", "severity": 78, "slaDays": 2}
]

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 13 — WARD ANALYTICS ENGINE TEST ")
    print("==================================================")

    try:
        url = "http://127.0.0.1:5001/analytics/ward_kpis"
        payload = {
            "existing_complaints": sample_complaints,
            "ward_id": 11
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print("\n--- [City-Wide Overall Metrics] ---")
        print(f"Total City Complaints: {res.get('overall_metrics', {}).get('total_city_complaints')}")
        print(f"Total Resolved: {res.get('overall_metrics', {}).get('total_resolved')}")
        print(f"City SLA Resolution Rate: {res.get('overall_metrics', {}).get('overall_city_sla_rate')}%")
        print(f"Top Performing Ward ID: {res.get('overall_metrics', {}).get('top_performing_ward_id')} (Health Score: {res.get('overall_metrics', {}).get('top_performing_ward_score')})")

        print("\n--- [Target Ward 11 KPI Summary] ---")
        t_ward = res.get("target_ward", {})
        print(f"Ward {t_ward.get('ward_id')} Rank: #{t_ward.get('ward_rank')} / 24")
        print(f"Ward Civic Health Score: {t_ward.get('ward_civic_health_score')} / 100")
        print(f"SLA Resolution Rate: {t_ward.get('sla_resolution_rate')}%")
        print(f"Critical Hazards Count: {t_ward.get('critical_count')}")
        print(f"Average Resolution Window: {t_ward.get('avg_resolution_days')} days")

        print(f"\nExecution Time: {res.get('execution_time_ms')} ms")
    except Exception as e:
        print(f"Phase 13 Test Failed: {e}")
