"""
CivicConnect Phase 12 Before/After Resolution AI Verification Test
"""

import json
import urllib.request
import base64
import cv2
import numpy as np

def generate_before_image():
    """Synthetic 'Before' photo with dark pothole cavity"""
    img = np.ones((200, 300, 3), dtype=np.uint8) * 180
    cv2.circle(img, (150, 100), 40, (30, 30, 30), -1) # dark pothole
    _, buf = cv2.imencode('.png', img)
    return f"data:image/png;base64,{base64.b64encode(buf).decode('utf-8')}"

def generate_after_image():
    """Synthetic 'After' photo with smooth repaved asphalt"""
    img = np.ones((200, 300, 3), dtype=np.uint8) * 140 # fresh asphalt
    cv2.circle(img, (150, 100), 40, (130, 130, 130), -1) # repaired patch
    _, buf = cv2.imencode('.png', img)
    return f"data:image/png;base64,{base64.b64encode(buf).decode('utf-8')}"

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 12 — RESOLUTION AI VERIFICATION TEST ")
    print("==================================================")

    img_before = generate_before_image()
    img_after = generate_after_image()

    # Test 1: Valid Repair Case
    print("\n--- [TEST CASE] 1. Valid Repair Verification ---")
    try:
        url = "http://127.0.0.1:5001/resolution/verify"
        payload = {
            "before_image": img_before,
            "after_image": img_after,
            "category": "Pothole"
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Verified: {res.get('verified')}")
        print(f"Verification Score: {res.get('verification_score')}%")
        print(f"Status: {res.get('status')}")
        print(f"SSIM Difference: {res.get('ssim_difference')}")
        print(f"Diagnostic: {res.get('diagnostic_summary')}")
    except Exception as e:
        print(f"Test 1 Failed: {e}")

    # Test 2: Identical Image Fraud Attempt
    print("\n--- [TEST CASE] 2. Identical Image Fraud Attempt ---")
    try:
        url = "http://127.0.0.1:5001/resolution/verify"
        payload = {
            "before_image": img_before,
            "after_image": img_before, # Exact same image!
            "category": "Pothole"
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Verified: {res.get('verified')}")
        print(f"Verification Score: {res.get('verification_score')}%")
        print(f"Status: {res.get('status')}")
        print(f"Diagnostic: {res.get('diagnostic_summary')}")
    except Exception as e:
        print(f"Test 2 Error: {e}")
