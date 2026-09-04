import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { complaintService } from "../services/api";
import { MumbaiMap } from "../components/MumbaiMap";
import { SeverityMeter } from "../components/SeverityMeter";
import { ImageUploader } from "../components/ImageUploader";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { AIAnalysisResult, AIVerifyImageResult } from "../types";
import { 
  MapPin, Sparkles, Loader2, CheckCircle2, ArrowLeft, Cpu, ShieldAlert 
} from "lucide-react";

export const ReportPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryWard = searchParams.get("ward");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Pothole");
  const [ward, setWard] = useState<number>(queryWard ? Number(queryWard) : user?.ward || 9);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Image verification state
  const [imageVerification, setImageVerification] = useState<AIVerifyImageResult | null>(null);

  // GPS coordinates state
  const selectedWardObj = MUMBAI_WARDS_DATA.find((w) => w.id === ward) || MUMBAI_WARDS_DATA[0];
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: selectedWardObj.lat,
    lng: selectedWardObj.lng,
  });

  useEffect(() => {
    const foundWard = MUMBAI_WARDS_DATA.find((w) => w.id === ward);
    if (foundWard) {
      setLocation({ lat: foundWard.lat, lng: foundWard.lng });
    }
  }, [ward]);

  // AI Triage state
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Trigger Gemini AI analysis
  const handleAiAnalyze = async () => {
    if (!title.trim() && !description.trim()) {
      setStatusMessage("Please enter issue title and description to run AI analysis.");
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage(null);

    try {
      const res = await complaintService.analyzeWithAI({
        title,
        description,
        category,
        location: `Ward ${ward}, Mumbai`,
      });
      setAiResult(res.data);
      if (res.data.category) {
        setCategory(res.data.category);
      }
      setStatusMessage("AI Triage Analysis complete: Evaluated hazard severity score & department SLA.");
    } catch (err) {
      console.error("AI Analysis failed", err);
      setStatusMessage("Could not connect to Gemini API. Using fallback severity estimation.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get GPS current position
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by your browser.");
      return;
    }

    setStatusMessage("Acquiring GPS coordinates...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
        setStatusMessage("✓ Location captured via device GPS!");
      },
      (err) => {
        console.warn("GPS error:", err);
        setStatusMessage("Could not retrieve GPS automatically. Click your location on the map below.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatusMessage("Title and description are required.");
      return;
    }

    if (!imageUrl) {
      setStatusMessage("Please attach a camera photo of the civic issue before submitting.");
      return;
    }

    // AI Image Fraud Guard
    if (imageVerification && !imageVerification.isValidCivicIssue) {
      setStatusMessage(
        `🚨 SUBMISSION REJECTED BY AI FRAUD SHIELD: ${
          imageVerification.isAIGenerated
            ? "Synthetic / AI-Generated image detected! Only authentic camera photographs clicked on-site are allowed."
            : imageVerification.rejectionReason || `Attached photo was flagged as "${imageVerification.detectedObject}". Please attach a genuine camera photo of the civic issue.`
        }`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const newComplaint = await complaintService.create({
        title: title.trim(),
        description: description.trim(),
        category: category as any,
        ward,
        latitude: location.lat,
        longitude: location.lng,
        imageUrl,
        isImageRejected: imageVerification?.isValidCivicIssue === false,
        rejectionReason: imageVerification?.rejectionReason,
        severity: aiResult?.severity || 65,
        urgency: aiResult?.urgency || "Medium",
        assignedDepartment: aiResult?.assignedDepartment || "Roads & Traffic Department",
        slaDays: aiResult?.slaDays || 2,
        aiSummary: aiResult?.aiSummary || "Citizen issue logged and triaged by KAISER AI.",
        aiSuggestedAction: aiResult?.aiSuggestedAction || "Dispatch ward maintenance crew for inspection.",
        reporterName: user?.name || "Local Resident",
      });

      navigate(`/complaint/${newComplaint.data.id}`);
    } catch (err: any) {
      console.error("Failed to submit report", err);
      const errMsg = err?.response?.data?.message || "Failed to submit report. Please check photo evidence & try again.";
      setStatusMessage(`🚨 ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          File Municipal Issue Report
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Submit camera photo evidence with map coordinates for automated AI triage and ward officer dispatch.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          {/* Photo Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Attach Camera Photo Evidence *
            </label>
            <ImageUploader 
              value={imageUrl} 
              category={category}
              onChange={(newUrl) => {
                setImageUrl(newUrl);
                if (statusMessage?.includes("SUBMISSION REJECTED")) {
                  setStatusMessage(null);
                }
              }} 
              onImageVerified={(res) => {
                setImageVerification(res);
                if (res.suggestedCategory && res.suggestedCategory !== category) {
                  setCategory(res.suggestedCategory);
                }
                if (!res.isValidCivicIssue) {
                  setStatusMessage(
                    `🚨 AI FRAUD ALERT: Uploaded photo identified as "${res.detectedObject}", not a municipal ${category} hazard.`
                  );
                } else {
                  const catName = res.suggestedCategory || category;
                  setStatusMessage(`✅ AI Vision Verified: ${res.detectedObject} (${catName})`);
                  if (!title.trim() || title === "Pothole" || title.includes("Civic Issue")) {
                    setTitle(`${res.detectedObject}`);
                  }
                }
              }}
              onLocationDetected={(info) => {
                setWard(info.ward.id);
                setLocation({ lat: info.lat, lng: info.lng });
                setStatusMessage(
                  `📸 Location Mapped: Ward ${info.ward.code} (${info.ward.name}) - Officer: ${info.ward.officer.name}`
                );
              }}
            />
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              2. Incident Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous Deep Pothole on SV Road near Bandra Station"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              3. Problem Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide exact details about the hazard, size, traffic blockage, or public impact..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* AI Auto-Analyze CTA Box */}
          <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Gemini AI Triage Diagnostics</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Instant hazard diagnosis, severity score calculation, and department SLA prediction.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={isAnalyzing}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all shrink-0 flex items-center gap-1.5"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Diagnostics</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Results Output Box */}
            {aiResult && (
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">AI Hazard Severity Index</span>
                  <SeverityMeter score={aiResult.severity} size="md" />
                </div>
                <div className="space-y-1">
                  <div className="text-slate-300">
                    <strong>Assigned Dept:</strong> {aiResult.assignedDepartment}
                  </div>
                  <div className="text-slate-300">
                    <strong>Target SLA:</strong> {aiResult.slaDays} Days
                  </div>
                  <div className="text-blue-300 italic line-clamp-2">
                    "{aiResult.aiSummary}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category & Ward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                4. Problem Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Pothole">Potholes & Asphalt Failure</option>
                <option value="Garbage">Garbage & Waste Accumulation</option>
                <option value="Water Leakage">Potable Water Pipe Leakage</option>
                <option value="Drainage">Drainage & Storm Water Overflow</option>
                <option value="Streetlight">Streetlight & Cable Failure</option>
                <option value="Roadwork">Unfinished Digging / Roadwork</option>
                <option value="Other">Other Municipal Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                5. Mumbai Ward Jurisdiction *
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {MUMBAI_WARDS_DATA.map((w) => (
                  <option key={w.id} value={w.id}>
                    Ward {w.code} - {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ward Officer Direct Assignment Preview */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedWardObj.officer.avatar}
                alt={selectedWardObj.officer.name}
                className="w-10 h-10 rounded-lg object-cover border border-slate-300"
              />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Assigned Ward Officer
                </span>
                <span className="font-bold text-slate-900">{selectedWardObj.officer.name}</span>
                <span className="text-slate-500 block text-[11px]">{selectedWardObj.officer.designation}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">Helpline</span>
              <span className="font-bold text-slate-800">{selectedWardObj.officer.contact}</span>
            </div>
          </div>

          {/* Location GPS Picker & Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                6. Geotag Location Pin *
              </label>
              <button
                type="button"
                onClick={handleGetGPS}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" /> Acquire GPS
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Coordinates: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
            </div>

            <MumbaiMap
              center={[location.lat, location.lng]}
              zoom={13}
              height="260px"
              selectedLocation={location}
              onSelectLocation={(lat, lng) => setLocation({ lat, lng })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Dispatching to Ward {selectedWardObj.code} Executive...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Incident Ticket to Ward Officer</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
