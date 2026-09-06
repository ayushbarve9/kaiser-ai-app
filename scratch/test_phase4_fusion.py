import os
import json
import base64
import numpy as np
import cv2
import urllib.request

def create_synthetic_test_image():
    """Create a synthetic test image with shapes for fusion testing."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:, :] = (200, 200, 200)
    cv2.rectangle(img, (120, 150), (450, 380), (50, 50, 50), -1)
    cv2.putText(img, "POTHOLE CAVITY", (140, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    _, buffer = cv2.imencode(".jpg", img)
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")

def run_fusion_test(name, payload):
    print(f"\n--- [TEST CASE] {name} ---")
    try:
        url = "http://127.0.0.1:3000/api/ai/analyze"
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json"})
        
        response = urllib.request.urlopen(req)
        res_json = json.loads(response.read().decode("utf-8"))
        
        print(f"HTTP Status: {response.status}")
        print(f"Success: {res_json.get('success')}")
        
        gemini = res_json.get("gemini", {})
        print(f"Verified: {gemini.get('verified')}")
        print(f"Category: {gemini.get('category')}")
        print(f"Severity Level: {gemini.get('severity')}")
        print(f"Severity Score: {gemini.get('severity_score')}/100")
        print(f"Recommended Department: {gemini.get('recommended_department')}")
        print(f"Fusion Confidence: {gemini.get('fusion_confidence')}")
        print(f"Reason: {gemini.get('reason')}")
        print(f"Telemetry Evidence: {json.dumps(gemini.get('evidence'), indent=2)}")
        return True, res_json
    except Exception as e:
        print(f"Test Failed: {e}")
        return False, None

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 4 — GEMINI + AI FUSION TEST  ")
    print("==================================================")
    
    img_b64 = create_synthetic_test_image()
    
    # Test 1: High Severity Pothole Hazard Fusion
    run_fusion_test("1. Pothole Hazard Fusion (YOLO + Seg + Gemini)", {
        "image": img_b64,
        "title": "Hazardous Deep Pothole Cluster on SV Road",
        "description": "Multiple severe asphalt cavities creating severe traffic bottleneck and accident risk",
        "category": "Pothole"
    })
    
    # Test 2: Emergency Water Line Leakage Burst Fusion
    run_fusion_test("2. Emergency Water Burst Fusion", {
        "image": img_b64,
        "title": "Main Water Distribution Pipe Burst",
        "description": "High pressure clean water line burst leaking thousands of liters per hour on WEH service road emergency flood hazard",
        "category": "Water Leakage"
    })
    
    # Test 3: Standalone /fusion/analyze Endpoint
    print("\n--- [TEST CASE] 3. Standalone /fusion/analyze Endpoint ---")
    try:
        url = "http://127.0.0.1:5001/fusion/analyze"
        payload = {
            "image": img_b64,
            "title": "Overflowing Garbage Dump",
            "description": "Solid waste accumulation causing severe stench and vector breeding hazard",
            "category": "Garbage"
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        fusion_res = json.loads(resp.read().decode("utf-8"))
        print(f"Standalone Fusion Verified: {fusion_res.get('verified')}")
        print(f"Category: {fusion_res.get('category')}")
        print(f"Severity: {fusion_res.get('severity')} ({fusion_res.get('severity_score')}/100)")
        print(f"Department: {fusion_res.get('recommended_department')}")
    except Exception as e:
        print(f"Standalone Fusion Endpoint Test Failed: {e}")
