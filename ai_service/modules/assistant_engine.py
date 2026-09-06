import os
import time
from typing import Dict, Any, Optional
from ai_service.config import config

class AssistantEngine:
    """
    Municipal AI Assistant Engine.
    Powers real-time civic queries using Gemini API + BMC Municipal Knowledge Base fallback.
    """

    SYSTEM_PROMPT = """You are KAISER Civic Intelligence AI, the official municipal assistant for the Brihanmumbai Municipal Corporation (BMC).
Your role is to assist citizens, municipal officers, and field engineers with:
1. Filing civic grievances (potholes, garbage, water supply, sewage, streetlights).
2. Understanding 24-ward municipal boundaries, AMC officers, and ward contact numbers.
3. Explaining SLA timelines (Critical: 24h, High: 48h, Medium: 72h, Low: 120h).
4. Providing real-time disaster management & flood emergency protocols (BMC Helpline 1916).
5. Explaining Ward Health Scores, spatial hotspots, and recurring civic defect analytics.

Maintain a polite, helpful, authoritative, and concise tone. When applicable, guide the user to relevant sections like /report, /dashboard, /map, /analytics, /admin, or /hotspots.
"""

    FAQ_KNOWLEDGE: Dict[str, str] = {
        "pothole": "To report a road defect or pothole:\n1. Go to **[Report Grievance](/report)**\n2. Upload a site photograph (YOLO11 auto-detects pothole dimensions & severity)\n3. Confirm GPS location & Ward\n4. Submit for instant AMC & Road Repair Squad dispatch.\n\n*SLA:* 24-48 hours depending on severity.",
        "water": "Water supply issues, main bursts, and contamination are categorized as **High Priority**.\n• Emergency Repair SLA: **24 Hours**\n• Routine Water Supply SLA: **48 Hours**\n• Department: BMC Hydraulics Engineer Dept\n• Emergency Hotline: Call **1916** for instant water tanker dispatch.",
        "garbage": "Solid Waste Management (SWM) collects garbage daily.\n• Open Dumping & Littering SLA: **24 Hours**\n• Uncleared Garbage Bins: **12 Hours**\n• Debris / Construction Material SLA: **48 Hours**\nReport open dumps via **[File Grievance](/report)** with photo.",
        "ward": "Mumbai is divided into **24 Municipal Wards** (A to R/North, L, M/East, M/West, N, S, T).\n• View ward boundaries & active complaints on the **[Mumbai Ward GIS Map](/map)**.\n• View ward performance rankings on **[Executive Analytics](/analytics)**.",
        "bandra": "**Bandra West** is under **Ward H-West** (AMC: Shri Vinayak Vispute).\n**Bandra East & BKC** are under **Ward H-East** (AMC: Shri Swapnil Dhamal).\nTrack Ward H-West issues on the **[Dashboard](/dashboard?ward=11)**.",
        "dadar": "**Dadar & Shivaji Park** fall under **Ward G-North** (AMC: Shri Kiran Dighavkar).\nWard Office: Harishchandra Yelve Marg, Dadar West.",
        "andheri": "**Andheri East** is **Ward K-East** (Azad Road Office).\n**Andheri West** is **Ward K-West** (Paliram Road Office).",
        "sla": "BMC Service Level Agreements (SLA):\n• **Critical Severity (80-100):** 24 Hours (Immediate Dispatch)\n• **High Severity (60-79):** 48 Hours\n• **Medium Severity (40-59):** 72 Hours (3 Days)\n• **Low Severity (0-39):** 120 Hours (5 Days)\nMissed SLAs trigger automatic escalation to the Assistant Municipal Commissioner.",
        "hotspot": "Spatial Hotspots are identified using **DBSCAN Spatial Clustering** on recurring complaints within a 300m radius.\nExplore high-density defect zones on the **[Ward Hotspots Map](/hotspots)**.",
        "health": "Ward Civic Health Scores are dynamically evaluated out of 100 based on:\n1. SLA Resolution Velocity (30%)\n2. Critical Defect Control (25%)\n3. Quality Verification Rate (20%)\n4. Citizen Satisfaction Index (15%)\n5. Anti-Fraud Audit Score (10%)\nCheck top ranked wards on **[Civic Health Rankings](/analytics)**.",
        "disaster": "🚨 **BMC Disaster Control Room:**\n• Emergency Call: **1916** (Toll-Free 24x7)\n• Medical Ambulance: **108**\n• Disaster Alert Hotline: **022-22694725**\nFor heavy rainfall & waterlogging, stay tuned to BMC Monsoon Advisories.",
    }

    def query(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        p = prompt.lower().strip()
        
        # 1. Attempt Gemini query if API key is available
        gemini_key = config.gemini_api_key or os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=gemini_key)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"{self.SYSTEM_PROMPT}\n\nUser Question: {prompt}\n\nProvide a clear, formatted municipal response:"
                )
                if response and response.text:
                    return {
                        "success": True,
                        "reply": response.text,
                        "source": "gemini-2.5-flash",
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
            except Exception as e:
                print(f"[AssistantEngine] Gemini query error: {e}. Falling back to FAQ Knowledge Base.")

        # 2. Intelligent Keyword & Entity Matcher Fallback
        matched_reply = None
        for key, reply_text in self.FAQ_KNOWLEDGE.items():
            if key in p:
                matched_reply = reply_text
                break

        if not matched_reply:
            if "report" in p or "file" in p or "submit" in p:
                matched_reply = self.FAQ_KNOWLEDGE["pothole"]
            elif "officer" in p or "amc" in p or "contact" in p:
                matched_reply = "You can view directory contacts for all 24 Assistant Municipal Commissioners (AMCs) on the **[24-Ward Officers Directory](/officers)**."
            elif "monsoon" in p or "rain" in p or "flood" in p:
                matched_reply = self.FAQ_KNOWLEDGE["disaster"]
            else:
                matched_reply = (
                    "I am KAISER Civic AI Assistant. I can help you with:\n"
                    "• **[Reporting Grievances](/report)** (potholes, garbage, water leaks, streetlights)\n"
                    "• **[Ward GIS Map](/map)** & AMC Officer Info across 24 Wards\n"
                    "• **[Ward Civic Health Ratings](/analytics)** & Hotspots\n"
                    "• **SLA Timelines** & Emergency Disaster Hotlines (**1916**)\n\n"
                    "Try asking about a ward (e.g. *Bandra*, *Dadar*), SLA timelines, or pothole reporting!"
                )

        return {
            "success": True,
            "reply": matched_reply,
            "source": "bmc-knowledge-base",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

assistant_engine = AssistantEngine()
