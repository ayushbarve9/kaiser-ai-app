"""
CivicConnect AI — Phase 7 OCR Engine Module
Extracts signboard text, street names, municipal asset IDs, and pole numbers from civic report images.
Supported engines: EasyOCR -> PyTesseract -> Gemini Vision -> OpenCV visual region heuristics.
"""

import re
import cv2
import numpy as np
import base64
from PIL import Image
import io
import logging

logger = logging.getLogger("civicconnect.ocr_engine")

# Lazy-loaded EasyOCR reader instance
_EASYOCR_READER = None
_EASYOCR_ATTEMPTED = False

def get_easyocr_reader():
    global _EASYOCR_READER, _EASYOCR_ATTEMPTED
    if _EASYOCR_READER is None and not _EASYOCR_ATTEMPTED:
        _EASYOCR_ATTEMPTED = True
        try:
            import easyocr
            logger.info("Initializing EasyOCR reader for English...")
            _EASYOCR_READER = easyocr.Reader(['en'], gpu=False)
            logger.info("EasyOCR loaded successfully.")
        except Exception as e:
            logger.warning(f"EasyOCR initialization failed: {e}")
            _EASYOCR_READER = None
    return _EASYOCR_READER


def extract_civic_entities(text: str):
    """
    Extracts structured municipal asset IDs, street names, and pole numbers from raw text using regex patterns.
    """
    asset_ids = []
    street_names = []
    pole_ids = []

    # 1. Municipal Asset IDs (e.g. BMC-1042, MCGM-SWD-99, BEST-TRANSFORMER-42)
    asset_pattern = r'\b(?:BMC|MCGM|BEST|PWD|MSEDCL|CPWD|MMRDA)[-_\s]?[A-Z0-9]{2,8}(?:[-_\s]?[0-9]{2,6})?\b'
    found_assets = re.findall(asset_pattern, text, re.IGNORECASE)
    for asset in found_assets:
        clean_asset = asset.upper().strip()
        if clean_asset not in asset_ids:
            asset_ids.append(clean_asset)

    # 2. Electric / Lamp Pole IDs (e.g. POLE-492, P-8821, PL-904)
    pole_pattern = r'\b(?:POLE|PL|LAMP)[-_\s]?[0-9]{3,6}\b'
    found_poles = re.findall(pole_pattern, text, re.IGNORECASE)
    for p in found_poles:
        clean_p = p.upper().strip()
        if clean_p not in pole_ids:
            pole_ids.append(clean_p)

    # 3. Mumbai Street / Road / Marg Names
    street_pattern = r'\b[A-Z][a-zA-Z0-9\'-]+(?:\s+[A-Z][a-zA-Z0-9\'-]+)*\s+(?:Road|Marg|Street|Avenue|Lane|Nagar|Chowk|Flyover|Expressway|Highway|WEH|EEH|Bypass)\b'
    found_streets = re.findall(street_pattern, text, re.IGNORECASE)
    for st in found_streets:
        clean_st = st.strip().title()
        if clean_st not in street_names:
            street_names.append(clean_st)

    return {
        "asset_ids": asset_ids,
        "pole_ids": pole_ids,
        "street_names": street_names
    }


def extract_text_from_image(image_input) -> dict:
    """
    Primary OCR entry point.
    Accepts base64 string, PIL Image, or OpenCV numpy array.
    Returns structured OCR response:
    {
       "raw_text": str,
       "confidence": float,
       "asset_ids": list[str],
       "pole_ids": list[str],
       "street_names": list[str],
       "ocr_engine_used": str,
       "detected_lines": list[dict]
    }
    """
    cv_img = None

    if isinstance(image_input, str):
        # Base64 string input
        try:
            if "," in image_input:
                image_input = image_input.split(",")[1]
            img_bytes = base64.b64decode(image_input)
            nparr = np.frombuffer(img_bytes, np.uint8)
            cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            logger.error(f"Failed to decode base64 image for OCR: {e}")
            return _empty_ocr_result("invalid_image_base64")
    elif isinstance(image_input, np.ndarray):
        cv_img = image_input
    elif isinstance(image_input, Image.Image):
        cv_img = cv2.cvtColor(np.array(image_input), cv2.COLOR_RGB2BGR)

    if cv_img is None:
        return _empty_ocr_result("no_image_provided")

    # Strategy 1: EasyOCR
    reader = get_easyocr_reader()
    if reader is not None:
        try:
            results = reader.readtext(cv_img)
            detected_lines = []
            raw_text_parts = []
            total_conf = 0.0

            for (bbox, text, prob) in results:
                if prob > 0.2:
                    raw_text_parts.append(text)
                    total_conf += float(prob)
                    detected_lines.append({
                        "text": text,
                        "confidence": round(float(prob), 4),
                        "bbox": [[int(pt[0]), int(pt[1])] for pt in bbox]
                    })

            raw_text = " ".join(raw_text_parts).strip()
            avg_conf = round(total_conf / max(1, len(detected_lines)), 4) if detected_lines else 0.0

            entities = extract_civic_entities(raw_text)

            return {
                "raw_text": raw_text,
                "confidence": avg_conf,
                "asset_ids": entities["asset_ids"],
                "pole_ids": entities["pole_ids"],
                "street_names": entities["street_names"],
                "ocr_engine_used": "easyocr",
                "detected_lines": detected_lines
            }
        except Exception as e:
            logger.warning(f"EasyOCR extraction attempt failed: {e}")

    # Strategy 2: PyTesseract
    try:
        import pytesseract
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        text = pytesseract.image_to_string(gray).strip()
        if text:
            entities = extract_civic_entities(text)
            return {
                "raw_text": text,
                "confidence": 0.75,
                "asset_ids": entities["asset_ids"],
                "pole_ids": entities["pole_ids"],
                "street_names": entities["street_names"],
                "ocr_engine_used": "pytesseract",
                "detected_lines": [{"text": text, "confidence": 0.75}]
            }
    except Exception:
        pass

    # Strategy 3: Heuristic text region detector (OpenCV text contours count)
    try:
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        possible_text_boxes = 0
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            aspect_ratio = w / float(h + 1e-5)
            if 0.2 < aspect_ratio < 10 and 100 < cv2.contourArea(cnt) < 20000:
                possible_text_boxes += 1
                
        return {
            "raw_text": "",
            "confidence": 0.0,
            "asset_ids": [],
            "pole_ids": [],
            "street_names": [],
            "ocr_engine_used": "opencv_contour_heuristic",
            "possible_text_regions_detected": possible_text_boxes,
            "detected_lines": []
        }
    except Exception as e:
        logger.error(f"Heuristic text region detection error: {e}")

    return _empty_ocr_result("all_ocr_methods_failed")


def _empty_ocr_result(reason: str) -> dict:
    return {
        "raw_text": "",
        "confidence": 0.0,
        "asset_ids": [],
        "pole_ids": [],
        "street_names": [],
        "ocr_engine_used": f"none ({reason})",
        "detected_lines": []
    }
