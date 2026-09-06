"""
CivicConnect Phase 8 24-Ward GIS Engine Automated Verification Test
"""

import json
import urllib.request

test_locations = [
    {
        "name": "Bandra West (SV Road / Hill Road)",
        "latitude": 19.0590,
        "longitude": 72.8300,
        "expected_code": "H/W"
    },
    {
        "name": "Dadar (Flower Market)",
        "latitude": 19.0330,
        "longitude": 72.8400,
        "expected_code": "G/N"
    },
    {
        "name": "Powai / Kanjurmarg",
        "latitude": 19.1430,
        "longitude": 72.9360,
        "expected_code": "S"
    },
    {
        "name": "Colaba / Fort (South Mumbai)",
        "latitude": 18.9220,
        "longitude": 72.8340,
        "expected_code": "A"
    }
]

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 8 — 24-WARD GIS ENGINE TEST ")
    print("==================================================")

    # 1. Standalone Endpoint Tests
    print("\n--- [TEST CASE] 1. Standalone /gis/resolve_ward Endpoint ---")
    for loc in test_locations:
        try:
            url = "http://127.0.0.1:5001/gis/resolve_ward"
            payload = {"latitude": loc["latitude"], "longitude": loc["longitude"]}
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
            resp = urllib.request.urlopen(req)
            gis_res = json.loads(resp.read().decode("utf-8"))
            
            ward_code = gis_res.get("ward_code")
            ward_name = gis_res.get("ward_name")
            officer = gis_res.get("officer_name")
            confidence = gis_res.get("confidence")
            match = (ward_code == loc["expected_code"])
            
            print(f"[{loc['name']}] -> Ward {ward_code} ({ward_name}) | Officer: {officer} | Conf: {confidence} | Match: {match}")
        except Exception as e:
            print(f"GIS Resolution Failed for {loc['name']}: {e}")

    # 2. Unified Pipeline Test
    print("\n--- [TEST CASE] 2. Unified /analyze Endpoint with GIS ---")
    try:
        url = "http://127.0.0.1:5001/analyze"
        payload = {
            "title": "Water Leakage near Hill Road Bandra",
            "description": "Clean water pipe leaking on main road",
            "category": "Water Leakage",
            "latitude": 19.0590,
            "longitude": 72.8300
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        analysis_res = json.loads(resp.read().decode("utf-8"))
        
        print(f"Pipeline Success: {analysis_res.get('success')}")
        print(f"Message: {analysis_res.get('message')}")
        print(f"GIS Resolution in Response: {json.dumps(analysis_res.get('gis'), indent=2)}")
        print(f"Execution Time: {analysis_res.get('execution_time_ms')} ms")
    except Exception as e:
        print(f"Unified Pipeline GIS Test Failed: {e}")
