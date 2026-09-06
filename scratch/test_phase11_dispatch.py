"""
CivicConnect Phase 11 Smart Dispatch Engine Automated Verification Test
"""

import json
import urllib.request

test_cases = [
    {
        "name": "Pothole Hazard on SV Road Bandra",
        "category": "Pothole",
        "severity": 85,
        "latitude": 19.0590,
        "longitude": 72.8300
    },
    {
        "name": "Main Water Pipe Leakage in Powai",
        "category": "Water Leakage",
        "severity": 92,
        "latitude": 19.1430,
        "longitude": 72.9360
    },
    {
        "name": "Overflowing Garbage Dump at Dadar Market",
        "category": "Garbage",
        "severity": 60,
        "latitude": 19.0330,
        "longitude": 72.8400
    }
]

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 11 — SMART DISPATCH ENGINE TEST ")
    print("==================================================")

    # 1. Standalone /dispatch/recommend Endpoint
    print("\n--- [TEST CASE] 1. Standalone /dispatch/recommend Endpoint ---")
    for case in test_cases:
        try:
            url = "http://127.0.0.1:5001/dispatch/recommend"
            payload = {
                "category": case["category"],
                "latitude": case["latitude"],
                "longitude": case["longitude"]
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
            resp = urllib.request.urlopen(req)
            disp_res = json.loads(resp.read().decode("utf-8"))
            
            print(f"\n[{case['name']}]")
            print(f"Recommended Squad: {disp_res.get('recommended_contractor')}")
            print(f"Depot Yard: {disp_res.get('depot_name')} ({disp_res.get('depot_distance_km')} km away)")
            print(f"ETA: {disp_res.get('estimated_eta_minutes')} minutes | Squad Size: {disp_res.get('squad_size')} workers")
            print(f"Required Equipment: {disp_res.get('required_equipment')}")
            print(f"Priority Tier: {disp_res.get('priority_tier')}")
        except Exception as e:
            print(f"Dispatch Recommendation Failed for {case['name']}: {e}")

    # 2. Unified /analyze Endpoint Integration
    print("\n--- [TEST CASE] 2. Unified /analyze Endpoint with Smart Dispatch ---")
    try:
        url = "http://127.0.0.1:5001/analyze"
        payload = {
            "title": "Severe Pothole Cluster on SV Road near Bandra Station",
            "description": "Deep asphalt depression causing severe traffic blockage",
            "category": "Pothole",
            "latitude": 19.0590,
            "longitude": 72.8300
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        analysis_res = json.loads(resp.read().decode("utf-8"))
        
        print(f"Pipeline Success: {analysis_res.get('success')}")
        print(f"Message: {analysis_res.get('message')}")
        print(f"Dispatch Payload in Unified Response: {json.dumps(analysis_res.get('dispatch'), indent=2)}")
        print(f"Execution Time: {analysis_res.get('execution_time_ms')} ms")
    except Exception as e:
        print(f"Unified Pipeline Dispatch Test Failed: {e}")
