"""
CivicConnect Phase 15 Recurring Issue Intelligence Automated Verification Test
"""

import json
import urllib.request

historical_past_complaints = [
    {"id": "HIST-01", "category": "Pothole", "latitude": 19.0592, "longitude": 72.8296, "status": "Resolved", "createdAt": "2026-05-10T10:00:00Z"},
    {"id": "HIST-02", "category": "Pothole", "latitude": 19.0593, "longitude": 72.8297, "status": "Resolved", "createdAt": "2026-07-02T14:30:00Z"},
    {"id": "HIST-03", "category": "Pothole", "latitude": 19.0591, "longitude": 72.8295, "status": "Resolved", "createdAt": "2026-08-15T09:15:00Z"}
]

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 15 — RECURRENCE INTELLIGENCE TEST ")
    print("==================================================")

    # Test 1: Chronic Defect Location (Same spot on SV Road Bandra)
    print("\n--- [TEST CASE] 1. Chronic Defect Location (3 Historical Repairs) ---")
    try:
        url = "http://127.0.0.1:5001/recurrence/evaluate"
        payload = {
            "latitude": 19.0592,
            "longitude": 72.8296,
            "category": "Pothole",
            "title": "Recurred Deep Pothole Cavity on SV Road",
            "existing_complaints": historical_past_complaints
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Recurrence Count: {res.get('recurrence_count')}")
        print(f"Is Chronic Defect: {res.get('is_chronic_defect')}")
        print(f"Contractor Audit Flag: {res.get('contractor_audit_flag')}")
        print(f"Severity Boost: +{res.get('severity_boost_pts')} pts")
        print(f"Explanation: {res.get('recurrence_explanation', '').encode('ascii', errors='ignore').decode('ascii')}")
        print(f"Historical Matches Count: {len(res.get('historical_matches', []))}")
    except Exception as e:
        print(f"Test 1 Failed: {e}")

    # Test 2: Isolated New Location (No past history)
    print("\n--- [TEST CASE] 2. Isolated New Location (First-time Incident) ---")
    try:
        url = "http://127.0.0.1:5001/recurrence/evaluate"
        payload = {
            "latitude": 18.9220,
            "longitude": 72.8340,
            "category": "Pothole",
            "title": "New Pothole in Colaba",
            "existing_complaints": historical_past_complaints
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Recurrence Count: {res.get('recurrence_count')}")
        print(f"Is Chronic Defect: {res.get('is_chronic_defect')}")
        print(f"Contractor Audit Flag: {res.get('contractor_audit_flag')}")
        print(f"Explanation: {res.get('recurrence_explanation')}")
    except Exception as e:
        print(f"Test 2 Failed: {e}")
