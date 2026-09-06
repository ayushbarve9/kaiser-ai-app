import os
import io
import time
import base64
import logging
from typing import Dict, Any, List, Optional
import cv2
import numpy as np
from PIL import Image

try:
    import torch
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False

from ai_service.config import config

logger = logging.getLogger("civicconnect.yolo")

class YOLO11Engine:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(YOLO11Engine, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
        
    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.model = None
        self.model_path = config.yolo_model_path
        self.device = self._resolve_device(config.yolo_device)
        self.conf_threshold = config.yolo_confidence_threshold
        self.weights_status = "unloaded"
        self._attempted_load = False

    def _resolve_device(self, requested_device: str) -> str:
        if not ULTRALYTICS_AVAILABLE:
            return "cpu"
        if requested_device.lower() in ["auto", "cuda", "gpu"]:
            try:
                return "cuda" if torch.cuda.is_available() else "cpu"
            except Exception:
                return "cpu"
        return "cpu"
        
    def load_model(self) -> bool:
        """Lazy load YOLO11 model weights."""
        if self._attempted_load:
            return self.model is not None

        self._attempted_load = True

        if not ULTRALYTICS_AVAILABLE:
            self.weights_status = "ultralytics_not_installed"
            logger.warning("Ultralytics library not available.")
            return False

        # 1. Check for custom CivicConnect YOLO weights first
        target_path = self.model_path
        if os.path.exists(target_path):
            try:
                logger.info(f"Loading custom CivicConnect YOLO11 weights from '{target_path}' on {self.device}...")
                self.model = YOLO(target_path)
                self.weights_status = "custom_weights_loaded"
                return True
            except Exception as e:
                logger.error(f"Failed to load custom weights from '{target_path}': {e}")

        # 2. Check for local yolo11n.pt fallback model in models/ or current dir
        local_fallbacks = ["./models/yolo11n.pt", "yolo11n.pt", "./models/yolo8n.pt", "yolov8n.pt"]
        for fb_path in local_fallbacks:
            if os.path.exists(fb_path):
                try:
                    logger.info(f"Loading local fallback model '{fb_path}' on {self.device}...")
                    self.model = YOLO(fb_path)
                    self.model_path = fb_path
                    self.weights_status = "pretrained_standard_yolo11"
                    return True
                except Exception as e:
                    logger.warning(f"Could not load local fallback '{fb_path}': {e}")

        # 3. Attempt downloading/loading standard yolo11n.pt
        try:
            logger.info(f"Custom model '{target_path}' not found. Initializing pretrained 'yolo11n.pt'...")
            self.model = YOLO("yolo11n.pt")
            self.model_path = "yolo11n.pt"
            self.weights_status = "pretrained_standard_yolo11"
            return True
        except Exception as e:
            logger.warning(f"Could not initialize standard yolo11n.pt model: {e}")
            self.model = None
            self.weights_status = "custom_weights_missing_no_network"
            return False

    def decode_image(self, image_input: str) -> Optional[np.ndarray]:
        """Decode base64 string, data URI, or raw bytes into OpenCV BGR numpy array."""
        if not image_input or not isinstance(image_input, str):
            return None
            
        try:
            if "," in image_input:
                image_input = image_input.split(",", 1)[1]
                
            img_bytes = base64.b64decode(image_input)
            pil_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
            return cv_image
        except Exception as e:
            logger.error(f"Error decoding image input: {e}")
            return None

    def detect(self, image_input: Optional[str] = None, conf_threshold: Optional[float] = None) -> Dict[str, Any]:
        """Run YOLO11 object detection inference."""
        start_time = time.time()
        conf = conf_threshold if conf_threshold is not None else self.conf_threshold
        
        # Ensure model is loaded lazily
        if self.model is None:
            self.load_model()
            
        if self.model is None:
            return {
                "status": "weights_missing",
                "message": f"Custom YOLO weights not found at '{self.model_path}'. Inference architecture ready.",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "device": self.device,
                "confidence_threshold": conf,
                "detections": [],
                "object_count": 0,
                "image_width": 0,
                "image_height": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2),
                "annotated_image_base64": None
            }
            
        if not image_input:
            return {
                "status": "no_image_provided",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "device": self.device,
                "confidence_threshold": conf,
                "detections": [],
                "object_count": 0,
                "image_width": 0,
                "image_height": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2),
                "annotated_image_base64": None
            }

        img = self.decode_image(image_input)
        if img is None:
            return {
                "status": "invalid_image",
                "message": "Failed to decode image input. Ensure valid Base64 image payload.",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "device": self.device,
                "confidence_threshold": conf,
                "detections": [],
                "object_count": 0,
                "image_width": 0,
                "image_height": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2),
                "annotated_image_base64": None
            }

        height, width = img.shape[:2]

        try:
            results = self.model.predict(
                source=img,
                conf=conf,
                device=self.device,
                verbose=False
            )
            
            detections = []
            annotated_bgr = img.copy()

            if results and len(results) > 0:
                result = results[0]
                annotated_bgr = result.plot()
                
                boxes = result.boxes
                if boxes is not None and len(boxes) > 0:
                    for box in boxes:
                        xyxy = box.xyxy[0].cpu().numpy().tolist()
                        confidence = float(box.conf[0].cpu().numpy())
                        class_id = int(box.cls[0].cpu().numpy())
                        class_name = result.names[class_id] if hasattr(result, "names") and class_id in result.names else f"class_{class_id}"
                        
                        detections.append({
                            "class_id": class_id,
                            "class_name": class_name,
                            "confidence": round(confidence, 4),
                            "bbox": {
                                "x1": int(xyxy[0]),
                                "y1": int(xyxy[1]),
                                "x2": int(xyxy[2]),
                                "y2": int(xyxy[3])
                            }
                        })

            _, buffer = cv2.imencode(".jpg", annotated_bgr)
            annotated_base64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")
            execution_time = round((time.time() - start_time) * 1000, 2)

            return {
                "status": "success",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "device": self.device,
                "confidence_threshold": conf,
                "detections": detections,
                "object_count": len(detections),
                "image_width": width,
                "image_height": height,
                "inference_time_ms": execution_time,
                "annotated_image_base64": annotated_base64
            }

        except Exception as e:
            logger.error(f"YOLO11 inference execution error: {e}")
            return {
                "status": "inference_error",
                "message": str(e),
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "device": self.device,
                "confidence_threshold": conf,
                "detections": [],
                "object_count": 0,
                "image_width": width,
                "image_height": height,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2),
                "annotated_image_base64": None
            }

yolo_engine = YOLO11Engine()
