import React, { useState, useRef } from "react";
import { extractLocationFromPhoto } from "../utils/exifReader";
import { MumbaiWard, AIVerifyImageResult } from "../types";
import { complaintService } from "../services/api";
import { 
  Camera, 
  Upload, 
  MapPin, 
  Train, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Mail, 
  Building2, 
  Wind, 
  Award, 
  CheckCircle2, 
  RefreshCw,
  Search,
  ShieldAlert,
  AlertTriangle,
  Loader2
} from "lucide-react";

interface PhotoWardFetcherProps {
  onSelectWard?: (ward: MumbaiWard) => void;
  compact?: boolean;
}

export const PhotoWardFetcher: React.FC<PhotoWardFetcherProps> = ({ onSelectWard, compact = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<AIVerifyImageResult | null>(null);
  const [detectionResult, setDetectionResult] = useState<{
    lat: number;
    lng: number;
    ward: MumbaiWard;
    source: "exif" | "ai_estimated" | "ward_preset";
    hasExifGps: boolean;
    distanceKm: number;
  } | null>(null);

  const verifyAndProcessImage = async (dataUrlOrFile: string | File) => {
    try {
      const urlForVerify = typeof dataUrlOrFile === "string" ? dataUrlOrFile : await new Promise<string>((res) => {
        const r = new FileReader();
        r.onloadend = () => res(r.result as string);
        r.readAsDataURL(dataUrlOrFile);
      });

      const verifyRes = await complaintService.verifyImage({
        imageUrl: urlForVerify,
        category: "Civic",
      });
      setVerificationResult(verifyRes.data);
    } catch (e) {
      console.warn("AI photo screening failed", e);
    }
  };

  const processPhotoFile = async (file: File) => {
    setIsProcessing(true);
    setVerificationResult(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setPhotoPreview(dataUrl);

      // Extract EXIF GPS and Ward info
      const result = await extractLocationFromPhoto(file);
      setDetectionResult(result);
      
      // Also run AI image verification in parallel
      await verifyAndProcessImage(dataUrl);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const processSamplePhoto = async (sampleUrl: string) => {
    setIsProcessing(true);
    setVerificationResult(null);
    setPhotoPreview(sampleUrl);

    const result = await extractLocationFromPhoto(sampleUrl);
    setDetectionResult(result);
    await verifyAndProcessImage(sampleUrl);
    setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const resetFetcher = () => {
    setPhotoPreview(null);
    setDetectionResult(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0B1C24] to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#0D7377] text-white text-[10px] font-black uppercase tracking-wider">
              AI & EXIF Powered
            </span>
            <span className="text-teal-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Automatic Ward & Officer Identification
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            Photo Location & BMC Ward Locator
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Upload any photo from your camera or gallery to automatically extract GPS EXIF metadata, map the administrative ward, primary railway stations, and assigned Ward Officer.
          </p>
        </div>

        {photoPreview && (
          <button
            onClick={resetFetcher}
            className="self-start sm:self-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Scanner
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!photoPreview ? (
        /* Upload Trigger Zone */
        <div className="border-2 border-dashed border-teal-500/40 hover:border-teal-400 bg-slate-800/40 hover:bg-slate-800/80 rounded-2xl p-8 text-center transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0D7377]/30 border border-[#0D7377] flex items-center justify-center mx-auto text-teal-300 shadow-inner">
            <Camera className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-base font-extrabold text-white">Upload or Snap Photo to Scan Location</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Reads EXIF geotags or predicts location coordinates to instantly fetch Ward Officers, Railway Hubs, and Local AQI.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-[#0D7377] hover:bg-[#14919B] text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Upload className="w-4 h-4" /> Select Photo File
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <Camera className="w-4 h-4 text-teal-400" /> Use Camera
            </button>
          </div>
        </div>
      ) : (
        /* Scanned Result Card */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Photo Thumbnail & Verification State */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black/40">
              <img
                src={photoPreview}
                alt="Uploaded Location Scan"
                className="w-full h-52 object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-teal-300 flex items-center justify-between border border-slate-700">
                <span>
                  {detectionResult?.hasExifGps ? "📸 EXIF Geotag Found" : "🗺️ Location Fallback"}
                </span>
                <span>
                  {detectionResult?.lat}, {detectionResult?.lng}
                </span>
              </div>
            </div>

            {/* AI Image Content Screening Alert */}
            {verificationResult && (
              verificationResult.isValidCivicIssue === false ? (
                <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Non-Civic Image Detected</span>
                  </div>
                  <p className="text-[11px] text-red-300">
                    AI identified: <strong className="text-white">{verificationResult.detectedObject}</strong>. Digital screenshots do not possess hardware camera GPS geotags.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Verified Civic Subject: {verificationResult.detectedObject}</span>
                </div>
              )
            )}

            {detectionResult?.hasExifGps ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Exact GPS Coordinates extracted from Camera EXIF header!</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>No EXIF Geotag found in file (typical for screenshots). Defaulted to Ward HQ.</span>
              </div>
            )}
          </div>

          {/* Fetched Ward & Officer Info */}
          {detectionResult && (
            <div className="lg:col-span-8 bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 space-y-5">
              {/* Ward Title & Railway Hub */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#0D7377] text-white text-xs font-black rounded-md">
                      Ward {detectionResult.ward.code}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[11px] font-extrabold rounded-md border border-amber-500/30">
                      🚂 {detectionResult.ward.railwayCorridor}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-white mt-1">
                    {detectionResult.ward.name}
                  </h4>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Distance to Ward HQ
                  </span>
                  <span className="text-sm font-black text-teal-400">
                    {detectionResult.distanceKm} km
                  </span>
                </div>
              </div>

              {/* Railway Hub & Key Localities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <Train className="w-3.5 h-3.5" /> Primary Railway Station(s)
                  </span>
                  <p className="font-extrabold text-white text-sm">
                    {detectionResult.ward.primaryRailwayStations}
                  </p>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Localities Covered
                  </span>
                  <p className="font-bold text-slate-200 text-xs line-clamp-2">
                    {detectionResult.ward.areaDescription}
                  </p>
                </div>
              </div>

              {/* Ward Officer Details */}
              <div className="p-4 bg-gradient-to-r from-teal-950/60 to-slate-900/80 rounded-2xl border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={detectionResult.ward.officer.avatar}
                    alt={detectionResult.ward.officer.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-teal-500 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400 uppercase">
                      <ShieldCheck className="w-3 h-3" /> Designated Ward Officer
                    </div>
                    <div className="text-sm font-black text-white">
                      {detectionResult.ward.officer.name}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {detectionResult.ward.officer.designation}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs w-full sm:w-auto text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="flex items-center sm:justify-end gap-1.5 text-slate-300 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{detectionResult.ward.officer.contact}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-slate-300 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[11px]">{detectionResult.ward.officer.email}</span>
                  </div>
                </div>
              </div>

              {/* Ward Weather & AQI */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1 text-slate-300 border-t border-slate-700/60">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  <span>Ward Air Quality Index (AQI): <strong className="text-white">{detectionResult.ward.weatherAndAqi.aqi} ({detectionResult.ward.weatherAndAqi.aqiCategory})</strong></span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectWard?.(detectionResult.ward)}
                    className="px-3.5 py-2 bg-[#0D7377] hover:bg-[#14919B] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" /> View Ward {detectionResult.ward.code} Grievances
                  </button>
                  <a
                    href={`/report?ward=${detectionResult.ward.id}`}
                    className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> File Report in Ward {detectionResult.ward.code}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
