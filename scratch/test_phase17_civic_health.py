"""
CivicConnect Phase 17 Ward Civic Health Score Automated Verification Test
"""

import json
import urllib.request

sample_ward_complaints = [
    {"id": "COMP-1", "ward": 11, "status": "Resolved", "severity": 65, "upvote_count": 12, "recurrence_count": 0},
    {"id": "COMP-2", "ward": 11, "status": "Resolved", "severity": 80, "upvote_count": 24, "recurrence_count": 0},
    {"id": "COMP-3", "ward": 11, "status": "In Progress", "severity": 90, "upvote_count": 18, "recurrence_count": 1}
]

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 17 — CIVIC HEALTH ENGINE TEST ")
    print("==================================================")

    try:
        url = "http://127.0.0.1:5001/civic_health/calculate"
        payload = {
            "ward_id": 11,
            "existing_complaints": sample_ward_complaints
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Target Ward ID: {res.get('ward_id')}")
        print(f"Civic Health Score: {res.get('civic_health_score')} / 100")
        print(f"Grade Rating: {res.get('grade')}")
        print(f"Municipal Status: {res.get('status')}")

        bd = res.get("dimension_breakdown", {})
        print("\n--- 5-Dimension Weighted Breakdown ---")
        print(f"1. SLA Speed Score (30%): {bd.get('sla_speed_score')}")
        print(f"2. Critical Hazard Control (25%): {bd.get('critical_hazard_score')}")
        print(f"3. Contractor Quality (20%): {bd.get('contractor_quality_score')}")
        print(f"4. Citizen Satisfaction (15%): {bd.get('citizen_satisfaction_score')}")
        print(f"5. Fraud Cleanliness (10%): {bd.get('fraud_clean_score')}")
        print(f"Executive Recommendation: {res.get('executive_recommendation')}")

        print(f"\nExecution Time: {res.get('execution_time_ms')} ms")
    except Exception as e:
        print(f"Phase 17 Test Failed: {e}")
