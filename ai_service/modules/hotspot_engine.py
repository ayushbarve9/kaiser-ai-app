"""
CivicConnect AI — Phase 14 Ward Hotspots & Spatial Clustering Engine
Groups nearby civic complaints into geographic density clusters using Haversine distance
to identify municipal problem hotspots (e.g. SV Road Pothole Cluster, Dadar Market Waste Zone).
"""

import math
import time
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("civicconnect.hotspot_engine")

def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0  # meters
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class HotspotClusteringEngine:
    def detect_hotspots(
        self,
        complaints: Optional[List[Dict[str, Any]]] = None,
        distance_threshold_meters: float = 300.0,
        min_cluster_size: int = 2
    ) -> Dict[str, Any]:
        """
        Groups complaints into geographic spatial clusters.
        """
        start_time = time.time()
        complaint_list = complaints or []

        # Filter valid coordinates
        valid_items = [
            c for c in complaint_list 
            if c.get("latitude") and c.get("longitude") and c.get("latitude") != 0.0
        ]

        visited = set()
        clusters = []

        for i, item1 in enumerate(valid_items):
            c_id1 = item1.get("id", f"c-{i}")
            if c_id1 in visited:
                continue

            lat1 = item1["latitude"]
            lng1 = item1["longitude"]
            cluster_members = [item1]
            visited.add(c_id1)

            for j, item2 in enumerate(valid_items):
                c_id2 = item2.get("id", f"c-{j}")
                if i != j and c_id2 not in visited:
                    lat2 = item2["latitude"]
                    lng2 = item2["longitude"]
                    dist = haversine_meters(lat1, lng1, lat2, lng2)
                    if dist <= distance_threshold_meters:
                        cluster_members.append(item2)
                        visited.add(c_id2)

            if len(cluster_members) >= min_cluster_size:
                # Compute centroid
                c_lats = [m["latitude"] for m in cluster_members]
                c_lngs = [m["longitude"] for m in cluster_members]
                center_lat = round(sum(c_lats) / len(c_lats), 6)
                center_lng = round(sum(c_lngs) / len(c_lngs), 6)

                # Determine dominant category
                categories = [m.get("category", "Pothole") for m in cluster_members]
                dominant_category = max(set(categories), key=categories.count)

                # Calculate average severity
                severities = [m.get("severity", 65) for m in cluster_members]
                avg_severity = round(sum(severities) / len(severities), 1)

                ward_name = cluster_members[0].get("wardName", "Ward Cluster")
                cluster_name = f"{dominant_category} Hotspot Cluster near {ward_name}"

                intervention_map = {
                    "Pothole": "Resurface 150-meter asphalt stretch & apply polymer binder layer.",
                    "Garbage": "Station heavy dumper placer unit and establish twice-daily sanitation drive.",
                    "Water Leakage": "Isolate distribution sub-main and install reinforced pipe sleeve.",
                    "Drainage": "Deploy high-pressure hydraulic jetting tanker for storm drain desilting.",
                    "Streetlight": "Replace damaged underground armoring cable and install LED lamp fixtures."
                }

                clusters.append({
                    "cluster_id": f"HOTSPOT-{len(clusters)+1:02d}",
                    "name": cluster_name,
                    "category": dominant_category,
                    "center_latitude": center_lat,
                    "center_longitude": center_lng,
                    "incident_count": len(cluster_members),
                    "cluster_severity": avg_severity,
                    "radius_meters": round(max([haversine_meters(center_lat, center_lng, m["latitude"], m["longitude"]) for m in cluster_members]), 1),
                    "ward": cluster_members[0].get("ward", 9),
                    "ward_name": ward_name,
                    "recommended_intervention": intervention_map.get(dominant_category, "Dispatch engineering inspection team."),
                    "member_complaint_ids": [m.get("id") for m in cluster_members if m.get("id")]
                })

        return {
            "total_hotspots_detected": len(clusters),
            "clusters": clusters,
            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
        }

hotspot_clustering_engine = HotspotClusteringEngine()
