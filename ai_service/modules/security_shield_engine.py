import time
import re
import hashlib
from typing import Dict, Any, List, Optional

class SecurityShieldEngine:
    """
    Security, Anti-Fraud Shield & Audit Engine.
    Protects the BMC Civic Intelligence System against:
    - Fake/Spam complaint submissions
    - Image hashing duplicates & stock photo reuse
    - Rate-limit violations
    - Input injection / XSS payloads in grievance text
    - GPS coordinate spoofing / out-of-bounds Mumbai location pins
    """

    MUMBAI_BOUNDS = {
        "min_lat": 18.8500,
        "max_lat": 19.3500,
        "min_lng": 72.7500,
        "max_lng": 73.0000
    }

    SPAM_KEYWORDS = [
        "free crypto", "buy now", "casino", "lottery", "test test test", 
        "asdfgh", "http://", "https://", "<script>", "select * from", "union select"
    ]

    def __init__(self):
        # In-memory IP request tracker for rate-limiting
        self.request_counts: Dict[str, List[float]] = {}
        self.seen_image_hashes: set = set()

    def audit_submission(
        self,
        title: Optional[str] = None,
        description: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        image_input: Optional[str] = None,
        client_ip: Optional[str] = "127.0.0.1"
    ) -> Dict[str, Any]:
        """
        Runs comprehensive anti-fraud & security checks on a civic grievance submission.
        """
        t_start = time.time()
        fraud_flags: List[str] = []
        risk_score = 0  # 0 to 100 scale

        # 1. Rate Limiting Check (Max 10 submissions per minute per IP)
        now = time.time()
        ip_history = self.request_counts.get(client_ip, [])
        ip_history = [t for t in ip_history if now - t < 60]  # Keep past 60s
        ip_history.append(now)
        self.request_counts[client_ip] = ip_history

        if len(ip_history) > 10:
            fraud_flags.append("RATE_LIMIT_EXCEEDED: Excessive complaints submitted from this IP address.")
            risk_score += 40

        # 2. Text Sanitization & Spam Keyword Audit
        combined_text = f"{title or ''} {description or ''}".lower()

        if len(combined_text.strip()) < 5:
            fraud_flags.append("INSUFFICIENT_TEXT: Title and description are too brief.")
            risk_score += 20

        for keyword in self.SPAM_KEYWORDS:
            if keyword in combined_text:
                fraud_flags.append(f"SPAM_DETECTED: Contains prohibited or spam keyword '{keyword}'.")
                risk_score += 35

        # Check for XSS / Script Injection
        if re.search(r"<[^>]*script|javascript:|on\w+=", combined_text, re.IGNORECASE):
            fraud_flags.append("XSS_ATTEMPT: Malicious script tags detected in submission text.")
            risk_score += 50

        # 3. GPS Coordinate Bounding Box Audit (Mumbai Boundaries)
        if latitude is not None and longitude is not None:
            in_lat = self.MUMBAI_BOUNDS["min_lat"] <= latitude <= self.MUMBAI_BOUNDS["max_lat"]
            in_lng = self.MUMBAI_BOUNDS["min_lng"] <= longitude <= self.MUMBAI_BOUNDS["max_lng"]
            if not (in_lat and in_lng):
                fraud_flags.append(f"GPS_OUT_OF_BOUNDS: Coordinates ({latitude}, {longitude}) are outside BMC Mumbai limits.")
                risk_score += 30
        else:
            fraud_flags.append("MISSING_GPS: No geospatial coordinates provided.")
            risk_score += 15

        # 4. Image Hash Duplicate Audit
        image_hash = None
        if image_input and len(image_input) > 20:
            image_hash = hashlib.md5(image_input.encode('utf-8')).hexdigest()
            if image_hash in self.seen_image_hashes:
                fraud_flags.append("DUPLICATE_IMAGE_HASH: Exact duplicate image payload already submitted.")
                risk_score += 45
            else:
                self.seen_image_hashes.add(image_hash)

        # Cap risk score
        risk_score = min(100, risk_score)
        passed_anti_fraud = risk_score < 50

        elapsed_ms = round((time.time() - t_start) * 1000, 2)

        return {
            "passed": passed_anti_fraud,
            "risk_score": risk_score,
            "risk_level": "LOW" if risk_score < 25 else ("MEDIUM" if risk_score < 50 else "HIGH_FRAUD"),
            "fraud_flags": fraud_flags,
            "image_hash": image_hash,
            "sanitized_title": self._sanitize(title or ""),
            "sanitized_description": self._sanitize(description or ""),
            "execution_time_ms": elapsed_ms
        }

    def _sanitize(self, text: str) -> str:
        """Strips dangerous HTML/script tags from user string."""
        clean = re.sub(r"<[^>]*>", "", text)
        return clean.strip()

security_shield_engine = SecurityShieldEngine()
