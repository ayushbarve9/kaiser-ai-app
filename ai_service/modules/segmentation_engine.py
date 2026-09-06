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

logger = logging.getLogger("civicconnect.segmentation")

class YOLO11SegmentationEngine:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(YOLO11SegmentationEngine, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
        
    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self.model = None
        self.model_path = config.yolo_seg_model_path
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
        """Lazy load YOLO11-Seg segmentation model weights."""
        if self._attempted_load:
            return self.model is not None

        self._attempted_load = True

        if not ULTRALYTICS_AVAILABLE:
            self.weights_status = "ultralytics_not_installed"
            return False

        # 1. Check custom segmentation model path
        target_path = self.model_path
        if os.path.exists(target_path):
            try:
                logger.info(f"Loading custom CivicConnect YOLO11-Seg weights from '{target_path}' on {self.device}...")
                self.model = YOLO(target_path)
                self.weights_status = "custom_weights_loaded"
                return True
            except Exception as e:
                logger.error(f"Failed to load custom segmentation model '{target_path}': {e}")

        # 2. Local fallbacks
        local_fallbacks = ["./models/yolo11n-seg.pt", "yolo11n-seg.pt", "./models/yolov8n-seg.pt", "yolov8n-seg.pt"]
        for fb_path in local_fallbacks:
            if os.path.exists(fb_path):
                try:
                    logger.info(f"Loading local fallback segmentation model '{fb_path}' on {self.device}...")
                    self.model = YOLO(fb_path)
                    self.model_path = fb_path
                    self.weights_status = "pretrained_standard_yolo11_seg"
                    return True
                except Exception as e:
                    logger.warning(f"Could not load local fallback '{fb_path}': {e}")

        # 3. Download/load standard yolo11n-seg.pt
        try:
            logger.info("Custom segmentation model not found. Initializing pretrained 'yolo11n-seg.pt'...")
            self.model = YOLO("yolo11n-seg.pt")
            self.model_path = "yolo11n-seg.pt"
            self.weights_status = "pretrained_standard_yolo11_seg"
            return True
        except Exception as e:
            logger.warning(f"Segmentation model unavailable: {e}")
            self.model = None
            self.weights_status = "optional_segmentation_unavailable"
            return False

    def decode_image(self, image_input: str) -> Optional[np.ndarray]:
        """Decode base64 string or data URI into OpenCV BGR numpy array."""
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
            logger.error(f"Error decoding image in segmentation engine: {e}")
            return None

    def segment(self, image_input: Optional[str] = None, conf_threshold: Optional[float] = None) -> Dict[str, Any]:
        """Run YOLO11-Seg instance segmentation inference."""
        start_time = time.time()
        conf = conf_threshold if conf_threshold is not None else self.conf_threshold

        if self.model is None:
            self.load_model()

        if self.model is None:
            return {
                "status": "optional_unavailable",
                "message": f"Segmentation model unavailable ({self.weights_status}). Pipeline continuing optionally.",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "masks": [],
                "mask_count": 0,
                "total_mask_area_px": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        if not image_input:
            return {
                "status": "no_image_provided",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "masks": [],
                "mask_count": 0,
                "total_mask_area_px": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        img = self.decode_image(image_input)
        if img is None:
            return {
                "status": "invalid_image",
                "message": "Failed to decode image for segmentation.",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "masks": [],
                "mask_count": 0,
                "total_mask_area_px": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2)
            }

        try:
            results = self.model.predict(
                source=img,
                conf=conf,
                device=self.device,
                verbose=False
            )

            masks_output = []
            total_mask_area = 0

            if results and len(results) > 0:
                result = results[0]
                if result.masks is not None and result.boxes is not None:
                    # Access mask data and boxes
                    mask_data = result.masks.data.cpu().numpy()  # Array of shape [N, H, W]
                    boxes = result.boxes

                    for i, box in enumerate(boxes):
                        xyxy = box.xyxy[0].cpu().numpy().tolist()
                        confidence = float(box.conf[0].cpu().numpy())
                        class_id = int(box.cls[0].cpu().numpy())
                        class_name = result.names[class_id] if hasattr(result, "names") and class_id in result.names else f"class_{class_id}"

                        # Calculate pixel mask area
                        if i < len(mask_data):
                            mask_matrix = mask_data[i]
                            # Count non-zero mask pixels
                            mask_pixel_area = int(np.sum(mask_matrix > 0.5))
                        else:
                            # Estimate area from bbox if mask array boundary exceeds
                            mask_pixel_area = int((xyxy[2] - xyxy[0]) * (xyxy[3] - xyxy[1]))

                        total_mask_area += mask_pixel_area

                        masks_output.append({
                            "class_id": class_id,
                            "class_name": class_name,
                            "confidence": round(confidence, 4),
                            "bbox": [int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])],
                            "mask_area": mask_pixel_area
                        })

            execution_time = round((time.time() - start_time) * 1000, 2)

            return {
                "status": "success",
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "device": self.device,
                "confidence_threshold": conf,
                "masks": masks_output,
                "mask_count": len(masks_output),
                "total_mask_area_px": total_mask_area,
                "inference_time_ms": execution_time
            }

        except Exception as e:
            logger.error(f"Segmentation inference error: {e}")
            return {
                "status": "segmentation_error",
                "message": str(e),
                "model_name": self.model_path,
                "weights_status": self.weights_status,
                "masks": [],
                "mask_count": 0,
                "total_mask_area_px": 0,
                "inference_time_ms": round((time.time() - start_time) * 1000, 2)
            }

segmentation_engine = YOLO11SegmentationEngine()
