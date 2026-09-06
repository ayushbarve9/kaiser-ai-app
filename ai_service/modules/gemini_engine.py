import os
import time
import json
import logging
import urllib.request
from typing import Dict, Any, Optional

from ai_service.config import config

logger = logging.getLogger("civicconnect.gemini_fusion")

class GeminiFusionEngine:
    def __init__(self):
        self.api_key = config.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
        self.model_name = config.gemini_model

    def analyze_and_fuse(
        self,
        image_input: Optional[str] = None,
        title: Optional[str] = None,
        description: Optional[str] = None,
        category: Optional[str] = None,
        yolo_result: Optional[Dict[str, Any]] = None,
        seg_result: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Perform Multi-Modal AI Fusion combining YOLO, Segmentation, and Gemini semantic analysis."""
        start_time = time.time()
        yolo_res = yolo_result or {}
        seg_res = seg_result or {}
        
        yolo_count = yolo_res.get("object_count", 0)
        yolo_detections = yolo_res.get("detections", [])
        seg_area = seg_res.get("total_mask_area_px", 0)
        seg_masks = seg_res.get("masks", [])
        
        # Build explainable visual evidence telemetry summary
        yolo_labels = [d.get("class_name") for d in yolo_detections if "class_name" in d]
        yolo_evidence_str = f"YOLO Detected {yolo_count} objects ({', '.join(yolo_labels) if yolo_labels else 'none'})"
        seg_evidence_str = f"Instance Segmentation identified {len(seg_masks)} masks covering {seg_area} px surface area."

        # Check if Gemini API Key is available for live LLM call
        gemini_response = None
        if self.api_key:
            gemini_response = self._call_gemini_api(
                title=title,
                description=description,
                category=category,
                yolo_evidence=yolo_evidence_str,
                seg_evidence=seg_evidence_str
            )
            
        # Execute Rule-Based Explainable Fusion Logic
        fusion_result = self._explainable_fusion_logic(
            gemini_data=gemini_response,
            title=title,
            description=description,
            user_category=category,
            yolo_count=yolo_count,
            yolo_labels=yolo_labels,
            seg_area=seg_area,
            has_image=bool(image_input)
        )
        
        fusion_result["execution_time_ms"] = round((time.time() - start_time) * 1000, 2)
        return fusion_result

    def _call_gemini_api(
        self,
        title: Optional[str],
        description: Optional[str],
        category: Optional[str],
        yolo_evidence: str,
        seg_evidence: str
    ) -> Optional[Dict[str, Any]]:
        """Query Gemini API with Vision Telemetry prompt."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        prompt = f"""You are KAISER AI Multi-Modal Fusion Engine for Brihanmumbai Municipal Corporation (BMC).
Analyze this civic grievance:
User Title: "{title or 'Civic Report'}"
User Description: "{description or 'Reported issue'}"
Selected Category: "{category or 'Auto-detect'}"
YOLO Vision Telemetry: {yolo_evidence}
Segmentation Telemetry: {seg_evidence}

Respond ONLY in valid JSON:
{{
  "verified": true/false,
  "category": "Pothole" | "Garbage" | "Drainage" | "Streetlight" | "Water Leakage" | "Roadwork" | "Other",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "severity_score": <number 1-100>,
  "reason": "<1-sentence technical diagnostic justification>",
  "recommended_department": "<department name>"
}}"""
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    json_start = text.find("{")
                    json_end = text.rfind("}") + 1
                    if json_start != -1 and json_end != -1:
                        return json.loads(text[json_start:json_end])
        except Exception as e:
            logger.warning(f"Gemini API direct call notice: {e}")
        return None

    def _explainable_fusion_logic(
        self,
        gemini_data: Optional[Dict[str, Any]],
        title: Optional[str],
        description: Optional[str],
        user_category: Optional[str],
        yolo_count: int,
        yolo_labels: list,
        seg_area: int,
        has_image: bool
    ) -> Dict[str, Any]:
        """Explainable Multi-Signal Fusion Engine combining YOLO + Seg + Gemini evidence."""
        text_context = ((title or "") + " " + (description or "")).lower()
        
        # 1. Base Category Resolution
        final_category = user_category or "Other"
        if gemini_data and isinstance(gemini_data, dict) and gemini_data.get("category"):
            final_category = gemini_data["category"]
        else:
            if any(k in text_context for k in ["pothole", "cavity", "asphalt", "crater"]):
                final_category = "Pothole"
            elif any(k in text_context for k in ["garbage", "waste", "dump", "trash", "stench"]):
                final_category = "Garbage"
            elif any(k in text_context for k in ["water", "pipe", "leak", "burst"]):
                final_category = "Water Leakage"
            elif any(k in text_context for k in ["drain", "sewer", "gutter", "clog"]):
                final_category = "Drainage"
            elif any(k in text_context for k in ["light", "dark", "lamp", "electric"]):
                final_category = "Streetlight"
            elif any(k in text_context for k in ["roadwork", "digging", "paver"]):
                final_category = "Roadwork"

        # 2. Explainable Severity Score Calculation
        severity_score = 55
        if gemini_data and isinstance(gemini_data, dict) and "severity_score" in gemini_data:
            severity_score = int(gemini_data["severity_score"])
        else:
            # Multi-signal additive scoring
            if any(k in text_context for k in ["burst", "hazard", "accident", "emergency", "flood", "high pressure"]):
                severity_score += 30
            if yolo_count > 0:
                severity_score += min(yolo_count * 5, 15)
            if seg_area > 10000:
                severity_score += 15
            elif seg_area > 0:
                severity_score += 5
                
        severity_score = max(1, min(100, severity_score))

        # Severity level string
        if severity_score >= 85:
            severity_level = "Critical"
        elif severity_score >= 70:
            severity_level = "High"
        elif severity_score >= 45:
            severity_level = "Medium"
        else:
            severity_level = "Low"

        # 3. Department Routing
        dept_map = {
            "Pothole": "Roads & Traffic Department",
            "Garbage": "Solid Waste Management (SWM)",
            "Water Leakage": "Hydraulics Department (Water Supply)",
            "Drainage": "Storm Water Drains (SWD)",
            "Streetlight": "Electrical & Streetlighting Dept",
            "Roadwork": "Maintenance & Roads Department",
            "Other": "General Municipal Works"
        }
        recommended_dept = (gemini_data.get("recommended_department") if (gemini_data and isinstance(gemini_data, dict)) else None) or dept_map.get(final_category, "General Municipal Works")

        # 4. Diagnostic Reason Synthesis
        if gemini_data and isinstance(gemini_data, dict) and gemini_data.get("reason"):
            reason_text = gemini_data["reason"]
        else:
            reason_parts = []
            if yolo_count > 0:
                reason_parts.append(f"YOLO detected {yolo_count} visual object(s)")
            if seg_area > 0:
                reason_parts.append(f"Segmentation mask area spans {seg_area} px")
            reason_parts.append(f"Semantic triage indicates {severity_level.lower()} hazard for category '{final_category}'")
            reason_text = ". ".join(reason_parts) + "."

        is_verified = (gemini_data.get("verified") if (gemini_data and isinstance(gemini_data, dict)) else True) if has_image else False

        return {
            "verified": bool(is_verified),
            "category": final_category,
            "severity": severity_level,
            "severity_score": severity_score,
            "reason": reason_text,
            "recommended_department": recommended_dept,
            "fusion_confidence": 0.94 if gemini_data else (0.85 if yolo_count > 0 else 0.70),
            "evidence": {
                "yolo_object_count": yolo_count,
                "yolo_classes": yolo_labels,
                "segmentation_mask_area_px": seg_area,
                "gemini_api_active": bool(gemini_data and isinstance(gemini_data, dict))
            }
        }

gemini_fusion_engine = GeminiFusionEngine()
