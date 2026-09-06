"""
CivicConnect Phase 16 Predictive Analytics Automated Verification Test
"""

import json
import urllib.request

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 16 — PREDICTIVE MONSOON RISK TEST ")
    print("==================================================")

    # Test 1: Critical Flood Warning in Ward 13 (F-North Sion / Hindmata)
    print("\n--- [TEST CASE] 1. Ward 13 (Sion/Hindmata) High Tide Lock & Heavy Rain ---")
    try:
        url = "http://127.0.0.1:5001/predictive/monsoon_risk"
        payload = {
            "ward_id": 13,
            "rainfall_mm_hr": 55.0,
            "tide_height_m": 4.8
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Target Ward: {res.get('ward_name')} (Elev: {res.get('elevation_above_msl_m')}m MSL)")
        print(f"Rainfall: {res.get('forecast_rainfall_mm_hr')} mm/hr | Tide: {res.get('tide_height_m')}m")
        print(f"High Tide Lock Flag: {res.get('high_tide_lock_flag')}")
        print(f"Flood Risk Probability: {res.get('monsoon_flood_risk_pct')}%")
        print(f"Asphalt Erosion Risk: {res.get('asphalt_erosion_risk_pct')}%")
        print(f"Drainage Overflow Risk: {res.get('drainage_overflow_risk_pct')}%")
        print(f"Risk Level: {res.get('risk_level')}")
        print(f"Preemptive Action: {res.get('recommended_preemptive_action')}")
    except Exception as e:
        print(f"Test 1 Failed: {e}")

    # Test 2: Moderate Risk in Ward 1 (Colaba)
    print("\n--- [TEST CASE] 2. Ward 1 (Colaba) High Elevation ---")
    try:
        url = "http://127.0.0.1:5001/predictive/monsoon_risk"
        payload = {
            "ward_id": 1,
            "rainfall_mm_hr": 20.0,
            "tide_height_m": 3.2
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Target Ward: {res.get('ward_name')}")
        print(f"Flood Risk Probability: {res.get('monsoon_flood_risk_pct')}%")
        print(f"Risk Level: {res.get('risk_level')}")
    except Exception as e:
        print(f"Test 2 Failed: {e}")
