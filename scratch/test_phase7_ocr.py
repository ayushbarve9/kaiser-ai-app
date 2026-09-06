"""
CivicConnect Phase 7 OCR Engine Automated Verification Test
Tests signboard, pole ID, and street name extraction capabilities.
"""

import json
import urllib.request
import base64
import cv2
import numpy as np

def create_synthetic_signboard_image():
    """Generates a synthetic image containing municipal signboard text: 'BMC-POLE-9942 SV Road Bandra West'"""
    img = np.ones((300, 600, 3), dtype=np.uint8) * 240  # light grey background
    # Add blue banner
    cv2.rectangle(img, (20, 20), (580, 100), (180, 50, 20), -1)
    
    # Draw white text on banner
    cv2.putText(img, "BMC-POLE-9942", (40, 70), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 3)
    cv2.putText(img, "SV Road Bandra West", (40, 180), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (20, 20, 20), 2)
    cv2.putText(img, "MCGM WARD H-WEST", (40, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (100, 30, 30), 2)

    _, buffer = cv2.imencode('.png', img)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{b64_str}"

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 7 — OCR ENGINE TEST ")
    print("==================================================")

    img_b64 = create_synthetic_signboard_image()

    # 1. Test Standalone /ocr/extract Endpoint
    print("\n--- [TEST CASE] 1. Standalone /ocr/extract Endpoint ---")
    try:
        url = "http://127.0.0.1:5001/ocr/extract"
        payload = {"image": img_b64}
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        ocr_res = json.loads(resp.read().decode("utf-8"))
        print(f"OCR Engine Used: {ocr_res.get('ocr_engine_used')}")
        print(f"Extracted Raw Text: '{ocr_res.get('raw_text')}'")
        print(f"Asset IDs: {ocr_res.get('asset_ids')}")
        print(f"Pole IDs: {ocr_res.get('pole_ids')}")
        print(f"Street Names: {ocr_res.get('street_names')}")
        print(f"Confidence: {ocr_res.get('confidence')}")
    except Exception as e:
        print(f"Standalone OCR Endpoint Failed: {e}")

    # 2. Test Unified /analyze Endpoint with OCR Integration
    print("\n--- [TEST CASE] 2. Unified /analyze Endpoint with OCR ---")
    try:
        url = "http://127.0.0.1:5001/analyze"
        payload = {
            "image": img_b64,
            "title": "Damaged Street Light Pole on SV Road",
            "description": "Exposed wires on street light pole near Bandra West station",
            "category": "Streetlight",
            "latitude": 19.0600,
            "longitude": 72.8300
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        analysis_res = json.loads(resp.read().decode("utf-8"))
        
        print(f"Pipeline Success: {analysis_res.get('success')}")
        print(f"Message: {analysis_res.get('message')}")
        print(f"OCR Response in Unified Payload: {json.dumps(analysis_res.get('ocr'), indent=2)}")
        print(f"Triage Priority Score: {analysis_res.get('triage', {}).get('priorityScore')}")
        print(f"Total Execution Time: {analysis_res.get('execution_time_ms')} ms")
    except Exception as e:
        print(f"Unified OCR Analysis Failed: {e}")
