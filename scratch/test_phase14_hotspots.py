"""
CivicConnect Phase 14 Ward Hotspots & Spatial Clustering Automated Verification Test
"""

import json
import urllib.request

sample_hotspot_complaints = [
    # Bandra SV Road Cluster (all within 150m of each other)
    {"id": "COMP-101", "category": "Pothole", "severity": 85, "latitude": 19.0590, "longitude": 72.8295, "ward": 11, "wardName": "H-West (Bandra West)"},
    {"id": "COMP-102", "category": "Pothole", "severity": 90, "latitude": 19.0594, "longitude": 72.8298, "ward": 11, "wardName": "H-West (Bandra West)"},
    {"id": "COMP-103", "category": "Pothole", "severity": 80, "latitude": 19.0600, "longitude": 72.8302, "ward": 11, "wardName": "H-West (Bandra West)"},
    # Dadar Garbage Cluster (5km away)
    {"id": "COMP-201", "category": "Garbage", "severity": 70, "latitude": 19.0178, "longitude": 72.8478, "ward": 9, "wardName": "G-North (Dadar)"},
    {"id": "COMP-202", "category": "Garbage", "severity": 75, "latitude": 19.0182, "longitude": 72.8481, "ward": 9, "wardName": "G-North (Dadar)"}
]

if __name__ == "__main__":
    print("==================================================")
    print("  CIVICCONNECT PHASE 14 — WARD HOTSPOTS CLUSTERING TEST ")
    print("==================================================")

    try:
        url = "http://127.0.0.1:5001/hotspots/cluster"
        payload = {
            "existing_complaints": sample_hotspot_complaints,
            "distance_threshold_meters": 250.0
        }
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
        resp = urllib.request.urlopen(req)
        res = json.loads(resp.read().decode("utf-8"))

        print(f"Total Hotspot Clusters Detected: {res.get('total_hotspots_detected')}")
        for cluster in res.get("clusters", []):
            print(f"\n[{cluster.get('cluster_id')}] {cluster.get('name')}")
            print(f"Dominant Category: {cluster.get('category')} | Incidents Count: {cluster.get('incident_count')}")
            print(f"Centroid GPS: Lat {cluster.get('center_latitude')}, Lng {cluster.get('center_longitude')}")
            print(f"Cluster Severity Index: {cluster.get('cluster_severity')}/100 | Radius: {cluster.get('radius_meters')}m")
            print(f"Intervention Strategy: {cluster.get('recommended_intervention')}")
            print(f"Member Incident IDs: {cluster.get('member_complaint_ids')}")

        print(f"\nExecution Time: {res.get('execution_time_ms')} ms")
    except Exception as e:
        print(f"Phase 14 Hotspot Test Failed: {e}")
