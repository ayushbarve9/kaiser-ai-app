import os
from pydantic import BaseModel

class AIServiceConfig(BaseModel):
    # Server settings
    host: str = os.getenv("AI_SERVICE_HOST", "127.0.0.1")
    port: int = int(os.getenv("AI_SERVICE_PORT", "5001"))
    
    # YOLO & Segmentation Settings
    yolo_model_path: str = os.getenv("YOLO_MODEL_PATH", "./models/civicconnect_yolo11.pt")
    yolo_seg_model_path: str = os.getenv("YOLO_SEG_MODEL_PATH", "./models/civicconnect_yolo11_seg.pt")
    yolo_confidence_threshold: float = float(os.getenv("YOLO_CONFIDENCE_THRESHOLD", "0.25"))
    yolo_device: str = os.getenv("YOLO_DEVICE", "auto")  # 'auto', 'cpu', 'cuda'
    
    # Gemini Settings
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    
    # General Settings
    debug: bool = os.getenv("AI_SERVICE_DEBUG", "true").lower() == "true"

config = AIServiceConfig()
