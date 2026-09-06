import sys
import os
import requests

def test_phase20_security():
    print("==================================================")
    print("   PHASE 20 VERIFICATION -- SECURITY & ANTI-FRAUD ")
    print("==================================================")

    url = "http://127.0.0.1:5001/security/audit"
    
    # Test case 1: Valid Legitimate Mumbai Submission
    legit_payload = {
        "title": "Pothole on Linking Road Bandra West",
        "description": "Deep pothole causing traffic slowdown near KFC junction.",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "image": "data:image/jpeg;base64,sample_bandra_pothole_image_bytes_123"
    }

    # Test case 2: Malicious / XSS & Out of Bounds GPS Submission
    malicious_payload = {
        "title": "Buy cheap crypto now! <script>alert('xss')</script>",
        "description": "Free lottery prize http://scam.com test test test",
        "latitude": 28.6139, # New Delhi coordinates (Out of Mumbai bounds)
        "longitude": 77.2090,
        "image": "data:image/jpeg;base64,sample_bandra_pothole_image_bytes_123" # Duplicate image hash
    }

    all_passed = True

    # Run Test 1
    try:
        r1 = requests.post(url, json=legit_payload, timeout=5)
        if r1.status_code == 200:
            d1 = r1.json()
            print("[PASS] Test 1 — Legitimate Mumbai Submission Audit:")
            print(f"       Passed: {d1.get('passed')} (Risk Score: {d1.get('risk_score')}, Level: {d1.get('risk_level')})")
            if not d1.get('passed'):
                all_passed = False
        else:
            print(f"[FAIL] Test 1 returned HTTP {r1.status_code}")
            all_passed = False
    except Exception as e:
        print(f"[FAIL] Test 1 failed with error: {e}")
        all_passed = False

    # Run Test 2
    try:
        r2 = requests.post(url, json=malicious_payload, timeout=5)
        if r2.status_code == 200:
            d2 = r2.json()
            print("[PASS] Test 2 — Malicious/Spam Submission Audit:")
            print(f"       Passed: {d2.get('passed')} (Risk Score: {d2.get('risk_score')}, Level: {d2.get('risk_level')})")
            print(f"       Fraud Flags Triggered: {len(d2.get('fraud_flags', []))}")
            for flag in d2.get('fraud_flags', []):
                print(f"         • {flag}")
            if d2.get('passed'): # Should fail anti-fraud
                print("       ❌ Expected malicious payload to fail anti-fraud audit!")
                all_passed = False
        else:
            print(f"[FAIL] Test 2 returned HTTP {r2.status_code}")
            all_passed = False
    except Exception as e:
        print(f"[FAIL] Test 2 failed with error: {e}")
        all_passed = False

    if all_passed:
        print("\n[SUCCESS] PHASE 20 SECURITY & ANTI-FRAUD VERIFICATION PASSED!")
        sys.exit(0)
    else:
        print("\n[FAIL] PHASE 20 VERIFICATION FAILED!")
        sys.exit(1)

if __name__ == "__main__":
    test_phase20_security()
