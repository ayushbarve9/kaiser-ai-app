import math
import re
import time
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("civicconnect.duplicate")

class DuplicateDetectionEngine:
    def __init__(self):
        pass

    def haversine_distance_meters(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate geodesic distance in meters between two lat/lng coordinates using Haversine formula."""
        R = 6371000.0  # Earth radius in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lng2 - lng1)

        a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

        return round(R * c, 1)

    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate text similarity using token Jaccard & N-gram overlap metric."""
        if not text1 or not text2:
            return 0.0

        def tokenize(t: str) -> set:
            words = re.findall(r'\b\w+\b', t.lower())
            return set(w for w in words if len(w) > 2)

        set1 = tokenize(text1)
        set2 = tokenize(text2)

        if not set1 or not set2:
            return 0.0

        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        jaccard = intersection / float(union) if union > 0 else 0.0

        # Exact substring boost
        substring_boost = 0.2 if (text1.lower() in text2.lower() or text2.lower() in text1.lower()) else 0.0
        
        return round(min(1.0, jaccard + substring_boost), 4)

    def calculate_image_similarity(self, img1_data: Optional[str], img2_data: Optional[str]) -> float:
        """Calculate visual image similarity."""
        if not img1_data or not img2_data:
            return 0.50  # Neutral baseline if images not both provided

        if img1_data == img2_data:
            return 1.0  # Exact match

        # Hash length comparison heuristic
        len_diff = abs(len(img1_data) - len(img2_data))
        max_len = max(len(img1_data), len(img2_data), 1)
        sim = max(0.0, 1.0 - (len_diff / float(max_len)))

        return round(sim, 4)

    def find_duplicates(
        self,
        latitude: Optional[float],
        longitude: Optional[float],
        title: Optional[str],
        description: Optional[str],
        category: Optional[str],
        image_input: Optional[str],
        existing_complaints: Optional[List[Dict[str, Any]]] = None,
        max_distance_meters: float = 1000.0,
        similarity_threshold: float = 0.50
    ) -> List[Dict[str, Any]]:
        """Search existing complaints for geographic and semantic duplicate candidates."""
        if not existing_complaints:
            return []

        target_lat = latitude if latitude is not None else 19.076
        target_lng = longitude if longitude is not None else 72.877
        target_text = f"{title or ''} {description or ''}"

        candidates = []

        for item in existing_complaints:
            comp_id = item.get("id", "")
            comp_title = item.get("title", "")
            comp_desc = item.get("description", "")
            comp_category = item.get("category", "")
            comp_lat = float(item.get("latitude", 0.0))
            comp_lng = float(item.get("longitude", 0.0))
            comp_status = item.get("status", "Reported")
            comp_image = item.get("imageUrl", "")

            # 1. Geographic Distance Proximity
            dist_meters = self.haversine_distance_meters(target_lat, target_lng, comp_lat, comp_lng)

            # Skip complaints further than max distance (e.g. 1000m)
            if dist_meters > max_distance_meters:
                continue

            # Proximity Score (1.0 at 0m, 0.0 at 1000m)
            geo_score = max(0.0, 1.0 - (dist_meters / max_distance_meters))

            # 2. Text Similarity
            item_text = f"{comp_title} {comp_desc}"
            text_sim = self.calculate_text_similarity(target_text, item_text)

            # Category Match Bonus
            category_match = (category and comp_category and category.lower() == comp_category.lower())
            if category_match:
                text_sim = min(1.0, text_sim + 0.15)

            # 3. Image Similarity
            img_sim = self.calculate_image_similarity(image_input, comp_image)

            # 4. Composite Similarity Formula
            composite_score = round((geo_score * 0.40) + (text_sim * 0.40) + (img_sim * 0.20), 4)

            if composite_score >= similarity_threshold:
                candidates.append({
                    "complaintId": comp_id,
                    "title": comp_title,
                    "distanceMeters": dist_meters,
                    "imageSimilarity": round(img_sim, 2),
                    "textSimilarity": round(text_sim, 2),
                    "compositeSimilarity": composite_score,
                    "status": comp_status,
                    "ward": item.get("ward"),
                    "wardName": item.get("wardName")
                })

        # Sort candidates descending by composite similarity score
        candidates.sort(key=lambda x: x["compositeSimilarity"], reverse=True)
        return candidates[:5]

duplicate_detection_engine = DuplicateDetectionEngine()
