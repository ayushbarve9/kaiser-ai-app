import os
import time
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_service.config import config
from ai_service.modules.yolo_engine import yolo_engine
from ai_service.modules.segmentation_engine import segmentation_engine
from ai_service.modules.gemini_engine import gemini_fusion_engine
from ai_service.modules.triage_engine import ai_triage_engine
from ai_service.modules.duplicate_engine import duplicate_detection_engine
from ai_service.modules.ocr_engine import extract_text_from_image
from ai_service.modules.gis_engine import gis_engine
from ai_service.modules.dispatch_engine import dispatch_engine
from ai_service.modules.resolution_verification_engine import resolution_verification_engine
from ai_service.modules.analytics_engine import ward_analytics_engine
from ai_service.modules.hotspot_engine import hotspot_clustering_engine
from ai_service.modules.recurrence_engine import recurrence_engine
from ai_service.modules.predictive_engine import predictive_engine
from ai_service.modules.civic_health_engine import civic_health_engine
from ai_service.modules.assistant_engine import assistant_engine
from ai_service.modules.security_shield_engine import security_shield_engine

app = FastAPI(
    title="CivicConnect AI Intelligence Engine",
    version="1.0.0",
    description="Unified AI service powering YOLO11, Segmentation, OCR, 24-Ward GIS, Gemini Fusion, Triage, Duplicate Detection, Smart Dispatch, Ward Analytics, Hotspots, Recurrence, Predictive Risk & Civic Health."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIAnalyzeRequest(BaseModel):
    image: Optional[str] = None  # Base64 string or image URL
    before_image: Optional[str] = None
    after_image: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    ward_id: Optional[int] = None
    rainfall_mm_hr: Optional[float] = 45.0
    tide_height_m: Optional[float] = 4.6
    distance_threshold_meters: Optional[float] = 300.0
    confidence_threshold: Optional[float] = None
    upvote_count: Optional[int] = 0
    elapsed_hours: Optional[float] = 0.0
    target_sla_days: Optional[int] = None
    recurrence_count: Optional[int] = 0
    existing_complaints: Optional[List[Dict[str, Any]]] = None

class AIAnalyzeResponse(BaseModel):
    success: bool
    message: str
    timestamp: str
    yolo: Dict[str, Any]
    segmentation: Dict[str, Any]
    ocr: Dict[str, Any]
    gis: Dict[str, Any]
    dispatch: Dict[str, Any]
    gemini: Dict[str, Any]
    triage: Dict[str, Any]
    duplicates: List[Dict[str, Any]]
    execution_time_ms: float

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "CivicConnect AI Engine",
        "version": "1.0.0",
        "config": {
            "yolo_model_path": config.yolo_model_path,
            "yolo_seg_model_path": config.yolo_seg_model_path,
            "yolo_confidence": config.yolo_confidence_threshold,
            "device": yolo_engine.device,
            "yolo_weights_status": yolo_engine.weights_status,
            "seg_weights_status": segmentation_engine.weights_status,
            "has_gemini_key": bool(config.gemini_api_key or os.getenv("GEMINI_API_KEY"))
        }
    }

@app.post("/yolo/detect")
def standalone_yolo_detect(request: AIAnalyzeRequest):
    return yolo_engine.detect(request.image, request.confidence_threshold)

@app.post("/segmentation/predict")
def standalone_segmentation_predict(request: AIAnalyzeRequest):
    return segmentation_engine.segment(request.image, request.confidence_threshold)

@app.post("/ocr/extract")
def standalone_ocr_extract(request: AIAnalyzeRequest):
    return extract_text_from_image(request.image)

@app.post("/gis/resolve_ward")
def standalone_gis_resolve_ward(request: AIAnalyzeRequest):
    return gis_engine.resolve_ward(request.latitude, request.longitude)

@app.post("/dispatch/recommend")
def standalone_dispatch_recommend(request: AIAnalyzeRequest):
    return dispatch_engine.recommend_dispatch(
        category=request.category,
        severity_score=75,
        latitude=request.latitude,
        longitude=request.longitude
    )

@app.post("/resolution/verify")
def standalone_resolution_verify(request: AIAnalyzeRequest):
    return resolution_verification_engine.verify_resolution(
        before_image=request.before_image or request.image or "",
        after_image=request.after_image or "",
        category=request.category
    )

@app.post("/analytics/ward_kpis")
def standalone_ward_kpis(request: AIAnalyzeRequest):
    return ward_analytics_engine.compute_ward_kpis(
        complaints=request.existing_complaints,
        target_ward_id=request.ward_id
    )

@app.post("/hotspots/cluster")
def standalone_hotspot_cluster(request: AIAnalyzeRequest):
    return hotspot_clustering_engine.detect_hotspots(
        complaints=request.existing_complaints,
        distance_threshold_meters=request.distance_threshold_meters or 300.0
    )

@app.post("/recurrence/evaluate")
def standalone_recurrence_evaluate(request: AIAnalyzeRequest):
    return recurrence_engine.evaluate_recurrence(
        latitude=request.latitude,
        longitude=request.longitude,
        category=request.category,
        title=request.title,
        existing_complaints=request.existing_complaints
    )

@app.post("/predictive/monsoon_risk")
def standalone_predictive_monsoon_risk(request: AIAnalyzeRequest):
    return predictive_engine.predict_monsoon_risk(
        rainfall_mm_hr=request.rainfall_mm_hr or 45.0,
        tide_height_m=request.tide_height_m or 4.6,
        target_ward_id=request.ward_id or 13
    )

@app.post("/civic_health/calculate")
def standalone_civic_health_calculate(request: AIAnalyzeRequest):
    return civic_health_engine.calculate_health_score(
        ward_id=request.ward_id or 11,
        complaints=request.existing_complaints
    )

@app.post("/fusion/analyze")
def standalone_fusion_analyze(request: AIAnalyzeRequest):
    yolo_res = yolo_engine.detect(request.image, request.confidence_threshold)
    seg_res = segmentation_engine.segment(request.image, request.confidence_threshold)
    return gemini_fusion_engine.analyze_and_fuse(
        image_input=request.image,
        title=request.title,
        description=request.description,
        category=request.category,
        yolo_result=yolo_res,
        seg_result=seg_res
    )

@app.post("/triage/evaluate")
def standalone_triage_evaluate(request: AIAnalyzeRequest):
    yolo_res = yolo_engine.detect(request.image, request.confidence_threshold)
    seg_res = segmentation_engine.segment(request.image, request.confidence_threshold)
    gemini_res = gemini_fusion_engine.analyze_and_fuse(
        image_input=request.image,
        title=request.title,
        description=request.description,
        category=request.category,
        yolo_result=yolo_res,
        seg_result=seg_res
    )
    return ai_triage_engine.evaluate_triage(
        category=request.category,
        severity_score=gemini_res.get("severity_score", 50),
        yolo_result=yolo_res,
        seg_result=seg_res,
        gemini_result=gemini_res,
        upvote_count=request.upvote_count or 0,
        elapsed_hours=request.elapsed_hours or 0.0,
        target_sla_days=request.target_sla_days,
        location_context=request.description or request.title,
        recurrence_count=request.recurrence_count or 0
    )

@app.post("/duplicate/search")
def standalone_duplicate_search(request: AIAnalyzeRequest):
    return duplicate_detection_engine.find_duplicates(
        latitude=request.latitude,
        longitude=request.longitude,
        title=request.title,
        description=request.description,
        category=request.category,
        image_input=request.image,
        existing_complaints=request.existing_complaints
    )

class AssistantQueryRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

@app.post("/assistant/query")
def standalone_assistant_query(request: AssistantQueryRequest):
    return assistant_engine.query(request.prompt, request.context)

@app.post("/security/audit")
def standalone_security_audit(request: AIAnalyzeRequest):
    return security_shield_engine.audit_submission(
        title=request.title,
        description=request.description,
        latitude=request.latitude,
        longitude=request.longitude,
        image_input=request.image
    )

@app.post("/analyze", response_model=AIAnalyzeResponse)
def analyze_civic_issue(request: AIAnalyzeRequest):
    start_time = time.time()
    
    # 1. Execute YOLO11 Object Detection Engine (Phase 2)
    yolo_result = yolo_engine.detect(request.image, request.confidence_threshold)
    
    # 2. Execute YOLO11-Seg Instance Segmentation Engine (Phase 3)
    seg_result = segmentation_engine.segment(request.image, request.confidence_threshold)
    
    # 3. Execute OCR Engine (Phase 7)
    ocr_result = extract_text_from_image(request.image)
    
    # 4. Execute 24-Ward GIS Point-in-Polygon Engine (Phase 8)
    gis_result = gis_engine.resolve_ward(request.latitude, request.longitude)
    
    # 5. Execute Gemini + AI Fusion Engine (Phase 4)
    gemini_result = gemini_fusion_engine.analyze_and_fuse(
        image_input=request.image,
        title=request.title,
        description=request.description,
        category=request.category,
        yolo_result=yolo_result,
        seg_result=seg_result
    )
    
    # 6. Execute AI Triage, Multi-Signal Priority & SLA Engine (Phase 5)
    triage_result = ai_triage_engine.evaluate_triage(
        category=request.category,
        severity_score=gemini_result.get("severity_score", 50),
        yolo_result=yolo_result,
        seg_result=seg_result,
        gemini_result=gemini_result,
        upvote_count=request.upvote_count or 0,
        elapsed_hours=request.elapsed_hours or 0.0,
        target_sla_days=request.target_sla_days,
        location_context=(request.title or "") + " " + (request.description or ""),
        recurrence_count=request.recurrence_count or 0
    )
    
    # 7. Execute Duplicate Detection Engine (Phase 6)
    duplicates_result = duplicate_detection_engine.find_duplicates(
        latitude=request.latitude,
        longitude=request.longitude,
        title=request.title,
        description=request.description,
        category=request.category,
        image_input=request.image,
        existing_complaints=request.existing_complaints
    )

    # 8. Execute Smart Dispatch Engine (Phase 11)
    dispatch_result = dispatch_engine.recommend_dispatch(
        category=request.category,
        severity_score=gemini_result.get("severity_score", 50),
        latitude=request.latitude,
        longitude=request.longitude,
        ward_code=gis_result.get("ward_code")
    )

    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    
    return AIAnalyzeResponse(
        success=True,
        message="YOLO11 + YOLO11-Seg + OCR + 24-Ward GIS + Gemini + AI Triage + Duplicate Detection + Smart Dispatch pipeline executed successfully.",
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        yolo=yolo_result,
        segmentation=seg_result,
        ocr=ocr_result,
        gis=gis_result,
        dispatch=dispatch_result,
        gemini=gemini_result,
        triage=triage_result,
        duplicates=duplicates_result,
        execution_time_ms=elapsed_ms
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.host, port=config.port)
