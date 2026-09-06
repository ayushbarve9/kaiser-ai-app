import os
import json
import urllib.request

sample_existing_complaints = [
    {
        "id": "COMP-1001",
        "title": "Hazardous Deep Pothole Cluster on SV Road near Bandra Station",
        "description": "Multiple severe potholes across a 15-meter stretch creating severe traffic bottleneck.",
        "category": "Pothole",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "status": "In Progress",
        "ward": 9,
        "wardName": "H-West (Bandra West)"
    },
    {
        "id": "COMP-1002",
        "title": "Overflowing Garbage Dump near Dadar Flower Market",
        "description": "Solid waste accumulation spreading onto footpath causing severe stench.",
        "category": "Garbage",
        "latitude": 19.0178,
        "longitude": 72.8478,
        "status": "Assigned",
        "ward": 11,
        "wardName": "G-North (Dadar/Dharavi)"
    },
    {
        "id": "COMP-1003",
        "title": "Main Water Distribution Pipe Burst on WEH Andheri East",
        "description": "High-pressure clean water line leaking clean drinking water at thousands of liters per hour.",
        "category": "Water Leakage",
        "latitude": 19.1136,
        "longitude": 72.8697,
        "status": "In Progress",
        "ward": 7,
        "wardName": "K-East (Andheri East)"
    }
]

def run_duplicate_test(name, payload):
    print(f"\n--- [TEST CASE] {name} ---")
    try:
        url = "http://127.0.0.1:3000/api/ai/analyze"
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json"})
        try:
            response = urllib.request.urlopen(req)
        except Exception:
            # Fallback to Python FastAPI directly on port 5001
            url = "http://127.0.0.1:5001/analyze"
            req = urllib.request.Request(url, data=data_bytes, headers={"Content-Type": "application/json"})
            response = urllib.request.urlopen(req)
        
        res_json = json.loads(response.read().decode("utf-8"))
        
        print(f"Endpoint: {url}")
        print(f"HTTP Status: {response.status}")
        print(f"Success: {res_json.get('success')}")
        
        duplicates = res_json.get("duplicates", [])
        print(f"Duplicate Candidates Count: {len(duplicates)}")
        if duplicates:
            print(f"Candidates Details: {json.dumps(duplicates, indent=2)}")
        else:
            print("No duplicate candidates detected.")
        return True, res_json
    except Exception as e:
        print(f"Test Failed: {e}")
        return False, None

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 6 — DUPLICATE DETECTION TEST ")
    print("==================================================")
    
    # Test 1: Obvious Duplicate (45m distance, matching pothole on SV Road)
    run_duplicate_test("1. Obvious Duplicate (Same spot 45m away, SV Road Pothole)", {
        "title": "Deep Pothole Hazard near Bandra Station on SV Road",
        "description": "Large potholes causing severe traffic backlog on SV Road",
        "category": "Pothole",
        "latitude": 19.0600,
        "longitude": 72.8298,
        "existing_complaints": sample_existing_complaints
    })
    
    # Test 2: Same Category but Distant Location (5 km away in Andheri)
    run_duplicate_test("2. Similar Category but Distant Location (5km away)", {
        "title": "Deep Pothole Cavity on WEH Andheri",
        "description": "Asphalt depression near metro station",
        "category": "Pothole",
        "latitude": 19.1100,
        "longitude": 72.8600,
        "existing_complaints": sample_existing_complaints
    })
    
    # Test 3: Standalone /duplicate/search Endpoint
    print("\n--- [TEST CASE] 3. Standalone /duplicate/search Endpoint ---")
    try:
        url = "http://127.0.0.1:5001/duplicate/search"
        payload = {
            "title": "Overflowing Garbage Bin at Dadar Market",
            "description": "Waste overflowing on footpath",
            "category": "Garbage",
            "latitude": 19.0180,
            "longitude": 72.8480,
            "existing_complaints": sample_existing_complaints
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        dup_res = json.loads(resp.read().decode("utf-8"))
        print(f"Standalone Search Candidates Count: {len(dup_res)}")
        print(f"Candidate Sample: {json.dumps(dup_res, indent=2)}")
    except Exception as e:
        print(f"Standalone Duplicate Search Failed: {e}")
