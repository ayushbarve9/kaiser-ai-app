import os
import json
import base64
import numpy as np
import cv2
import urllib.request

def create_synthetic_test_image():
    """Create synthetic test image."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:, :] = (200, 200, 200)
    cv2.rectangle(img, (120, 150), (450, 380), (50, 50, 50), -1)
    _, buffer = cv2.imencode(".jpg", img)
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")

def run_triage_test(name, payload):
    print(f"\n--- [TEST CASE] {name} ---")
    try:
        url = "http://127.0.0.1:3000/api/ai/analyze"
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json"})
        
        response = urllib.request.urlopen(req)
        res_json = json.loads(response.read().decode("utf-8"))
        
        print(f"HTTP Status: {response.status}")
        print(f"Success: {res_json.get('success')}")
        
        triage = res_json.get("triage", {})
        print(f"Category: {triage.get('category')}")
        print(f"Severity: {triage.get('severity')}")
        print(f"Priority Score: {triage.get('priority_score')}/100")
        print(f"Urgency: {triage.get('urgency')}")
        print(f"Department: {triage.get('department')}")
        print(f"Recommended SLA: {triage.get('recommended_sla_days')} days")
        print(f"SLA Risk: {triage.get('sla_risk')}")
        print(f"Score Breakdown: {json.dumps(triage.get('score_breakdown'), indent=2)}")
        print(f"Explanation: {triage.get('explanation')}")
        return True, res_json
    except Exception as e:
        print(f"Test Failed: {e}")
        return False, None

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 5 — AI TRIAGE & SLA TEST      ")
    print("==================================================")
    
    img_b64 = create_synthetic_test_image()
    
    # Test 1: High Priority Triage with Upvotes & SLA Risk on Highway
    run_triage_test("1. High Priority Triage (Arterial Highway, 12 Upvotes, 18h Elapsed)", {
        "image": img_b64,
        "title": "Hazardous Deep Pothole Cluster on Western Express Highway",
        "description": "Critical road defect near Andheri Flyover creating severe traffic bottleneck and accident risk",
        "category": "Pothole",
        "upvote_count": 12,
        "elapsed_hours": 18.0,
        "target_sla_days": 1,
        "recurrence_count": 2
    })
    
    # Test 2: Low Priority Routine Triage
    run_triage_test("2. Routine Low Priority Triage (No Upvotes, 1h Elapsed)", {
        "image": img_b64,
        "title": "Minor Streetlight Inspection",
        "description": "Flickering lamp post tile in residential lane",
        "category": "Streetlight",
        "upvote_count": 0,
        "elapsed_hours": 1.0,
        "target_sla_days": 3
    })
    
    # Test 3: Standalone /triage/evaluate Endpoint
    print("\n--- [TEST CASE] 3. Standalone /triage/evaluate Endpoint ---")
    try:
        url = "http://127.0.0.1:5001/triage/evaluate"
        payload = {
            "image": img_b64,
            "title": "Main Water Distribution Burst",
            "description": "High pressure pipe burst flooding street near Station Market",
            "category": "Water Leakage",
            "upvote_count": 15,
            "elapsed_hours": 20.0,
            "target_sla_days": 1
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        triage_res = json.loads(resp.read().decode("utf-8"))
        print(f"Standalone Priority Score: {triage_res.get('priority_score')}/100")
        print(f"Urgency: {triage_res.get('urgency')}")
        print(f"Department: {triage_res.get('department')}")
        print(f"SLA Risk: {triage_res.get('sla_risk')}")
        print(f"Breakdown: {json.dumps(triage_res.get('score_breakdown'), indent=2)}")
    except Exception as e:
        print(f"Standalone Triage Endpoint Test Failed: {e}")
