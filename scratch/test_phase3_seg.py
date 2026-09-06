import os
import json
import base64
import numpy as np
import cv2
import urllib.request
import urllib.parse

def create_synthetic_test_image(pattern="shapes"):
    """Create a synthetic test image with shapes for segmentation testing."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:, :] = (210, 210, 210)
    
    if pattern == "shapes":
        # Filled red rectangle
        cv2.rectangle(img, (100, 100), (300, 300), (0, 0, 255), -1)
        # Filled green circle
        cv2.circle(img, (450, 250), 80, (0, 255, 0), -1)
    elif pattern == "blank":
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
        print(f"YOLO Status: {yolo.get('status')} | Object Count: {yolo.get('object_count')}")
        
        seg = res_json.get("segmentation", {})
        print(f"Segmentation Status: {seg.get('status')}")
        print(f"Model Name: {seg.get('model_name')}")
        print(f"Weights Status: {seg.get('weights_status')}")
        print(f"Mask Count: {seg.get('mask_count')}")
        print(f"Total Mask Area: {seg.get('total_mask_area_px')} px")
        print(f"Inference Time: {seg.get('inference_time_ms')} ms")
        print(f"Masks Sample: {json.dumps(seg.get('masks', [])[:2], indent=2)}")
        return True, res_json
    except Exception as e:
        print(f"Test Failed: {e}")
        return False, None

if __name__ == "__main__":
    print("==================================================")
    print("   CIVICCONNECT PHASE 3 — YOLO11-SEG TEST SUITE    ")
    print("==================================================")
    
    img_shapes = create_synthetic_test_image("shapes")
    img_blank = create_synthetic_test_image("blank")
    
    # Test 1: Valid Image Payload (Segmentation & YOLO)
    run_test_case("1. Valid Image Payload (YOLO + Segmentation)", {
        "image": img_shapes,
        "category": "Pothole",
        "title": "Pothole surface defect"
    })
    
    # Test 2: Blank Image Payload (Zero Masks Expected)
    run_test_case("2. Blank Image Payload (Zero Masks)", {
        "image": img_blank,
        "category": "Garbage"
    })
    
    # Test 3: Standalone /segmentation/predict Endpoint
    print("\n--- [TEST CASE] 3. Standalone /segmentation/predict Endpoint ---")
    try:
        url = "http://127.0.0.1:5001/segmentation/predict"
        payload = {"image": img_shapes, "confidence_threshold": 0.10}
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        seg_res = json.loads(resp.read().decode("utf-8"))
        print(f"Standalone Seg Status: {seg_res.get('status')}")
        print(f"Weights Status: {seg_res.get('weights_status')}")
        print(f"Mask Count: {seg_res.get('mask_count')}")
        print(f"Total Mask Area: {seg_res.get('total_mask_area_px')} px")
    except Exception as e:
        print(f"Standalone Seg Endpoint Test Failed: {e}")
