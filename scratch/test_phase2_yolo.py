import os
import json
import base64
import numpy as np
import cv2
import urllib.request
import urllib.parse

def create_synthetic_test_image(pattern="objects"):
    """Create a synthetic test image with geometric shapes for testing YOLO preprocessing & inference."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    # Draw background gradient
    img[:, :] = (200, 200, 200)
    
    if pattern == "objects":
        # Draw red circle (simulating a target object)
        cv2.circle(img, (200, 240), 60, (0, 0, 255), -1)
        # Draw blue rectangle
        cv2.rectangle(img, (350, 150), (550, 350), (255, 0, 0), -1)
        # Add text
        cv2.putText(img, "TEST OBJECT", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)
    elif pattern == "blank":
        # Plain grey image (no sharp features)
        img[:, :] = (128, 128, 128)
        
    _, buffer = cv2.imencode(".jpg", img)
    b64_str = base64.b64encode(buffer).decode("utf-8")
    return "data:image/jpeg;base64," + b64_str

def run_test_case(name, payload):
    print(f"\n--- [TEST CASE] {name} ---")
    try:
        url = "http://127.0.0.1:3000/api/ai/analyze"
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json"})
        
        response = urllib.request.urlopen(req)
        res_json = json.loads(response.read().decode("utf-8"))
        
        print(f"HTTP Status: {response.status}")
        print(f"Success: {res_json.get('success')}")
        yolo = res_json.get("yolo", {})
        print(f"YOLO Status: {yolo.get('status')}")
        print(f"Model Name: {yolo.get('model_name')}")
        print(f"Weights Status: {yolo.get('weights_status')}")
        print(f"Device: {yolo.get('device')}")
        print(f"Object Count: {yolo.get('object_count')}")
        print(f"Inference Time: {yolo.get('inference_time_ms')} ms")
        print(f"Image Dimensions: {yolo.get('image_width')}x{yolo.get('image_height')}")
        print(f"Annotated Image Present: {bool(yolo.get('annotated_image_base64'))}")
        print(f"Detections Sample: {json.dumps(yolo.get('detections', [])[:2], indent=2)}")
        return True, res_json
    except Exception as e:
        print(f"❌ Test Failed: {e}")
        return False, None

if __name__ == "__main__":
    print("==================================================")
    print("   CIVICCONNECT PHASE 2 — YOLO11 TEST SUITE       ")
    print("==================================================")
    
    img_valid = create_synthetic_test_image("objects")
    img_blank = create_synthetic_test_image("blank")
    
    # Test 1: Valid Image Payload with YOLO Inference
    run_test_case("1. Valid Image Payload (YOLO Inference)", {
        "image": img_valid,
        "category": "Pothole",
        "title": "Road hazard test"
    })
    
    # Test 2: Blank Image Payload (No Detections Expected)
    run_test_case("2. Blank Image Payload (Zero Detections)", {
        "image": img_blank,
        "category": "Garbage"
    })
    
    # Test 3: Invalid / Corrupt Image Base64 Payload
    run_test_case("3. Invalid Image Payload (Corrupt Base64)", {
        "image": "not_a_valid_base64_string!!!",
        "category": "Streetlight"
    })
    
    # Test 4: Standalone YOLO Endpoint (/yolo/detect)
    print("\n--- [TEST CASE] 4. Standalone /yolo/detect Endpoint ---")
    try:
        url = "http://127.0.0.1:5001/yolo/detect"
        payload = {"image": img_valid, "confidence_threshold": 0.15}
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        yolo_res = json.loads(resp.read().decode("utf-8"))
        print(f"Standalone Status: {yolo_res.get('status')}")
        print(f"Weights Status: {yolo_res.get('weights_status')}")
        print(f"Device: {yolo_res.get('device')}")
        print(f"Confidence Threshold: {yolo_res.get('confidence_threshold')}")
        print(f"Annotated Image Length: {len(yolo_res.get('annotated_image_base64') or '')} chars")
    except Exception as e:
        print(f"❌ Standalone Endpoint Test Failed: {e}")
