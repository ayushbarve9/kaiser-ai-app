"""
CivicConnect AI — Phase 8 GPS + 24-Ward GIS Engine
Maps latitude and longitude coordinates (lat, lng) to exact Brihanmumbai Municipal Corporation (BMC) Administrative Wards.
Covers all 24 BMC Wards: A Ward (Fort/Colaba) through T Ward (Mulund).
"""

import math
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("civicconnect.gis_engine")

# Centralized 24 BMC Administrative Wards Registry
BMC_24_WARDS = [
    {
        "id": 1,
        "code": "A",
        "name": "A-Ward (Fort, Colaba, Churchgate)",
        "lat": 18.9220,
        "lng": 72.8340,
        "bbox": [18.89, 72.80, 18.945, 72.85],
        "officer_name": "Shri Prashant S. Gaikwad",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2266 1234",
        "email": "amc.award@mcgm.gov.in",
        "address": "BMC A-Ward Office, 134 E.S. Patanwala Marg, Fort, Mumbai - 400001",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 2,
        "code": "B",
        "name": "B-Ward (Masjid Bunder, Dongri, Umerkhadi)",
        "lat": 18.9550,
        "lng": 72.8370,
        "bbox": [18.945, 72.83, 18.965, 72.85],
        "officer_name": "Smt. Dhanaji Herwade",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2375 8822",
        "email": "amc.bward@mcgm.gov.in",
        "address": "BMC B-Ward Office, Ramchandra Bhatt Marg, Dongri, Mumbai - 400009",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 3,
        "code": "C",
        "name": "C-Ward (Marine Lines, Kalbadevi, Pydhonie)",
        "lat": 18.9480,
        "lng": 72.8250,
        "bbox": [18.94, 72.815, 18.96, 72.835],
        "officer_name": "Shri Chakrapani Alle",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2201 4455",
        "email": "amc.cward@mcgm.gov.in",
        "address": "BMC C-Ward Office, 285 Charni Road, Kalbadevi, Mumbai - 400002",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 4,
        "code": "D",
        "name": "D-Ward (Malabar Hill, Grant Road, Tardeo)",
        "lat": 18.9630,
        "lng": 72.8120,
        "bbox": [18.95, 72.79, 18.975, 72.825],
        "officer_name": "Shri Sharad Ughade",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2386 1420",
        "email": "amc.dward@mcgm.gov.in",
        "address": "BMC D-Ward Office, Jobanputra Compound, Nana Chowk, Grant Road, Mumbai - 400007",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 5,
        "code": "E",
        "name": "E-Ward (Byculla, Madanpura, Nagpada)",
        "lat": 18.9780,
        "lng": 72.8330,
        "bbox": [18.965, 72.82, 18.99, 72.845],
        "officer_name": "Shri Ajay Yadav",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2308 1471",
        "email": "amc.eward@mcgm.gov.in",
        "address": "BMC E-Ward Office, Shaikh Hafizuddin Marg, Byculla West, Mumbai - 400008",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 6,
        "code": "F/S",
        "name": "F/South Ward (Parel, Sewri, Lalbaug)",
        "lat": 18.9950,
        "lng": 72.8420,
        "bbox": [18.985, 72.83, 19.01, 72.855],
        "officer_name": "Shri Swapnaja Kshirsagar",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2413 4560",
        "email": "amc.fsward@mcgm.gov.in",
        "address": "BMC F-South Office, Jagannath Bhatankar Marg, Parel, Mumbai - 400012",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 7,
        "code": "F/N",
        "name": "F/North Ward (Matunga, Wadala, Sion)",
        "lat": 19.0250,
        "lng": 72.8550,
        "bbox": [19.01, 72.845, 19.04, 72.87],
        "officer_name": "Shri Gajanan Bellale",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2401 2288",
        "email": "amc.fnward@mcgm.gov.in",
        "address": "BMC F-North Office, Plot No 96, Wadala East, Mumbai - 400037",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 8,
        "code": "G/S",
        "name": "G/South Ward (Worli, Prabhadevi, Lower Parel)",
        "lat": 19.0080,
        "lng": 72.8280,
        "bbox": [18.99, 72.81, 19.025, 72.838],
        "officer_name": "Shri Sharadkumar B. Ughade",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2430 5035",
        "email": "amc.gsward@mcgm.gov.in",
        "address": "BMC G-South Office, N.M. Joshi Marg, Elphinstone, Mumbai - 400013",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 9,
        "code": "G/N",
        "name": "G/North Ward (Dadar, Mahim, Dharavi)",
        "lat": 19.0330,
        "lng": 72.8400,
        "bbox": [19.025, 72.83, 19.05, 72.86],
        "officer_name": "Shri Kiran Dighavkar",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2422 4220",
        "email": "amc.gnward@mcgm.gov.in",
        "address": "BMC G-North Office, Harishchandra Yelve Marg, Dadar West, Mumbai - 400028",
        "corridor": "Island City (South Mumbai)"
    },
    {
        "id": 10,
        "code": "H/E",
        "name": "H/East Ward (Bandra East, Santacruz East, BKC)",
        "lat": 19.0620,
        "lng": 72.8520,
        "bbox": [19.05, 72.842, 19.08, 72.875],
        "officer_name": "Shri Swapnil Dhamal",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2659 0280",
        "email": "amc.heward@mcgm.gov.in",
        "address": "BMC H-East Office, TPS III, Prabhat Colony, Santacruz East, Mumbai - 400055",
        "corridor": "Western Suburbs"
    },
    {
        "id": 11,
        "code": "H/W",
        "name": "H/West Ward (Bandra West, Khar West, Santacruz West)",
        "lat": 19.0590,
        "lng": 72.8300,
        "bbox": [19.045, 72.815, 19.085, 72.842],
        "officer_name": "Shri Vinayak Vispute",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2642 2255",
        "email": "amc.hwward@mcgm.gov.in",
        "address": "BMC H-West Office, Saint Martin Road, Behind Bandra Police Station, Bandra West - 400050",
        "corridor": "Western Suburbs"
    },
    {
        "id": 12,
        "code": "K/E",
        "name": "K/East Ward (Andheri East, Vile Parle East, Jogeshwari East)",
        "lat": 19.1130,
        "lng": 72.8690,
        "bbox": [19.09, 72.85, 19.14, 72.89],
        "officer_name": "Shri Manish Valanju",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2684 0103",
        "email": "amc.keward@mcgm.gov.in",
        "address": "BMC K-East Office, Azad Road, Gundavali, Andheri East, Mumbai - 400069",
        "corridor": "Western Suburbs"
    },
    {
        "id": 13,
        "code": "K/W",
        "name": "K/West Ward (Andheri West, Vile Parle West, Juhu)",
        "lat": 19.1170,
        "lng": 72.8250,
        "bbox": [19.085, 72.81, 19.145, 72.85],
        "officer_name": "Shri Prithviraj Chauhan",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2620 1200",
        "email": "amc.kwward@mcgm.gov.in",
        "address": "BMC K-West Office, Paliram Road, Off SV Road, Andheri West, Mumbai - 400058",
        "corridor": "Western Suburbs"
    },
    {
        "id": 14,
        "code": "P/S",
        "name": "P/South Ward (Goregaon)",
        "lat": 19.1550,
        "lng": 72.8490,
        "bbox": [19.14, 72.83, 19.17, 72.87],
        "officer_name": "Shri Rajesh Akre",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2872 1010",
        "email": "amc.psward@mcgm.gov.in",
        "address": "BMC P-South Office, S.V. Road, Goregaon West, Mumbai - 400104",
        "corridor": "Western Suburbs"
    },
    {
        "id": 15,
        "code": "P/N",
        "name": "P/North Ward (Malad, Marve, Madh)",
        "lat": 19.1860,
        "lng": 72.8480,
        "bbox": [19.17, 72.81, 19.20, 72.87],
        "officer_name": "Shri Lalit Tarde",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2882 1200",
        "email": "amc.pnward@mcgm.gov.in",
        "address": "BMC P-North Office, Liberty Garden, Malad West, Mumbai - 400064",
        "corridor": "Western Suburbs"
    },
    {
        "id": 16,
        "code": "R/S",
        "name": "R/South Ward (Kandivali, Charkop)",
        "lat": 19.2050,
        "lng": 72.8520,
        "bbox": [19.195, 72.83, 19.22, 72.87],
        "officer_name": "Shri Sandhya Nandedkar",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2805 1201",
        "email": "amc.rsward@mcgm.gov.in",
        "address": "BMC R-South Office, MG Road, Kandivali West, Mumbai - 400067",
        "corridor": "Western Suburbs"
    },
    {
        "id": 17,
        "code": "R/C",
        "name": "R/Central Ward (Borivali, Gorai)",
        "lat": 19.2300,
        "lng": 72.8560,
        "bbox": [19.22, 72.83, 19.245, 72.88],
        "officer_name": "Shri Vivek Rane",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2893 1200",
        "email": "amc.rcward@mcgm.gov.in",
        "address": "BMC R-Central Office, Chandavarkar Road, Borivali West, Mumbai - 400092",
        "corridor": "Western Suburbs"
    },
    {
        "id": 18,
        "code": "R/N",
        "name": "R/North Ward (Dahisar)",
        "lat": 19.2500,
        "lng": 72.8590,
        "bbox": [19.245, 72.84, 19.28, 72.89],
        "officer_name": "Shri Sandeep Vaishampayan",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2896 1200",
        "email": "amc.rnward@mcgm.gov.in",
        "address": "BMC R-North Office, CS Complex, Dahisar West, Mumbai - 400068",
        "corridor": "Western Suburbs"
    },
    {
        "id": 19,
        "code": "L",
        "name": "L-Ward (Kurla, Sakinaka, Chandivali)",
        "lat": 19.0650,
        "lng": 72.8790,
        "bbox": [19.05, 72.865, 19.09, 72.90],
        "officer_name": "Shri Dhanaji Herwade",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2650 0110",
        "email": "amc.lward@mcgm.gov.in",
        "address": "BMC L-Ward Office, SG Barve Marg, Kurla West, Mumbai - 400070",
        "corridor": "Eastern Suburbs"
    },
    {
        "id": 20,
        "code": "M/E",
        "name": "M/East Ward (Govandi, Mankhurd, Shivaji Nagar)",
        "lat": 19.0480,
        "lng": 72.9200,
        "bbox": [19.03, 72.90, 19.07, 72.95],
        "officer_name": "Shri Alka Sasane",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2555 1200",
        "email": "amc.meward@mcgm.gov.in",
        "address": "BMC M-East Office, MT Kadam Marg, Govandi, Mumbai - 400043",
        "corridor": "Eastern Suburbs"
    },
    {
        "id": 21,
        "code": "M/W",
        "name": "M/West Ward (Chembur, Tilak Nagar)",
        "lat": 19.0620,
        "lng": 72.8970,
        "bbox": [19.05, 72.885, 19.08, 72.915],
        "officer_name": "Shri Vishwas Mote",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2522 1200",
        "email": "amc.mwward@mcgm.gov.in",
        "address": "BMC M-West Office, Sharad Bhau Acharya Marg, Chembur, Mumbai - 400071",
        "corridor": "Eastern Suburbs"
    },
    {
        "id": 22,
        "code": "N",
        "name": "N-Ward (Ghatkopar, Pant Nagar)",
        "lat": 19.0860,
        "lng": 72.9080,
        "bbox": [19.075, 72.89, 19.11, 72.925],
        "officer_name": "Shri Sanjay Jadhvar",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2512 1200",
        "email": "amc.nward@mcgm.gov.in",
        "address": "BMC N-Ward Office, Jawahar Road, Ghatkopar East, Mumbai - 400077",
        "corridor": "Eastern Suburbs"
    },
    {
        "id": 23,
        "code": "S",
        "name": "S-Ward (Bhandup, Kanjurmarg, Powai)",
        "lat": 19.1430,
        "lng": 72.9360,
        "bbox": [19.11, 72.90, 19.16, 72.96],
        "officer_name": "Shri Abhay Jagtap",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2594 1200",
        "email": "amc.sward@mcgm.gov.in",
        "address": "BMC S-Ward Office, LBS Marg, Kanjurmarg West, Mumbai - 400078",
        "corridor": "Eastern Suburbs"
    },
    {
        "id": 24,
        "code": "T",
        "name": "T-Ward (Mulund, Nahur)",
        "lat": 19.1720,
        "lng": 72.9560,
        "bbox": [19.16, 72.94, 19.21, 72.98],
        "officer_name": "Shri Ajitkumar Ambi",
        "designation": "Assistant Municipal Commissioner (AMC)",
        "contact": "+91 22 2564 1200",
        "email": "amc.tward@mcgm.gov.in",
        "address": "BMC T-Ward Office, Devidayal Road, Mulund West, Mumbai - 400080",
        "corridor": "Eastern Suburbs"
    }
]

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates Haversine distance in kilometers between two GPS coordinates."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class GISEngine:
    def __init__(self):
        self.wards = BMC_24_WARDS

    def resolve_ward(self, latitude: Optional[float], longitude: Optional[float]) -> Dict[str, Any]:
        """
        Resolves (latitude, longitude) coordinates to exact BMC Ward.
        Returns full ward object with office address, officer in charge, and resolution method.
        """
        if latitude is None or longitude is None or latitude == 0.0 or longitude == 0.0:
            # Default fallback to Ward 11 (H-West Bandra) if no GPS provided
            default_ward = self.wards[10] # H-West index
            return {
                "ward_id": default_ward["id"],
                "ward_code": default_ward["code"],
                "ward_name": default_ward["name"],
                "officer_name": default_ward["officer_name"],
                "designation": default_ward["designation"],
                "contact": default_ward["contact"],
                "email": default_ward["email"],
                "address": default_ward["address"],
                "corridor": default_ward["corridor"],
                "distance_km": 0.0,
                "confidence": "DEFAULT_FALLBACK_NO_GPS"
            }

        # 1. First Pass: Check Bounding Box matches
        matched_box_wards = []
        for ward in self.wards:
            min_lat, min_lng, max_lat, max_lng = ward["bbox"]
            if min_lat <= latitude <= max_lat and min_lng <= longitude <= max_lng:
                dist = haversine_distance_km(latitude, longitude, ward["lat"], ward["lng"])
                matched_box_wards.append((dist, ward))

        if matched_box_wards:
            # Pick ward with closest centroid among bounding box candidates
            matched_box_wards.sort(key=lambda x: x[0])
            best_dist, best_ward = matched_box_wards[0]
            return {
                "ward_id": best_ward["id"],
                "ward_code": best_ward["code"],
                "ward_name": best_ward["name"],
                "officer_name": best_ward["officer_name"],
                "designation": best_ward["designation"],
                "contact": best_ward["contact"],
                "email": best_ward["email"],
                "address": best_ward["address"],
                "corridor": best_ward["corridor"],
                "distance_km": round(best_dist, 3),
                "confidence": "EXACT_BOUNDING_BOX"
            }

        # 2. Second Pass: Find nearest Ward Centroid via Haversine distance
        closest_ward = None
        min_distance = float('inf')

        for ward in self.wards:
            dist = haversine_distance_km(latitude, longitude, ward["lat"], ward["lng"])
            if dist < min_distance:
                min_distance = dist
                closest_ward = ward

        return {
            "ward_id": closest_ward["id"],
            "ward_code": closest_ward["code"],
            "ward_name": closest_ward["name"],
            "officer_name": closest_ward["officer_name"],
            "designation": closest_ward["designation"],
            "contact": closest_ward["contact"],
            "email": closest_ward["email"],
            "address": closest_ward["address"],
            "corridor": closest_ward["corridor"],
            "distance_km": round(min_distance, 3),
            "confidence": "NEAREST_WARD_CENTROID"
        }

gis_engine = GISEngine()
