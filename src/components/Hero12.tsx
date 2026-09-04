import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stats } from "../types";
import { 
  Search, Building2, PlusCircle, MapPin, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, 
  PhoneCall, Construction, Droplets, Trash2, Waves, Lightbulb, Camera, ChevronRight
} from "lucide-react";
import "./Hero12.css";

export interface Hero12Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  stats: Stats | null;
  backgroundImage?: string;
  badgeText?: string;
  title?: string;
  description?: string;
}

export const Hero12: React.FC<Hero12Props> = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  stats,
  badgeText = "Live Across 24 Municipal Wards",
  title = "Public Grievance Redressal. Simplified.",
  description = "Geotagged photographic reporting for 21 million citizens. Direct ward engineer dispatch within 2 hours. Verified with photo proof."
}) => {
  const navigate = useNavigate();

  const quickCategories = [
    { name: "Potholes", category: "Pothole", icon: Construction },
    { name: "Water Leaks", category: "Water Leakage", icon: Droplets },
    { name: "Garbage", category: "Garbage", icon: Trash2 },
    { name: "Drainage", category: "Drainage", icon: Waves },
    { name: "Streetlights", category: "Streetlight", icon: Lightbulb },
  ];

  return (
    <div className="hero-12 relative my-4 text-[#1d1d1f] bg-white rounded-[32px] border border-black/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Top Hero Section */}
      <div className="p-8 sm:p-14 lg:p-18 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Apple Minimalist Typography & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Apple Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.06] text-[#0071e3] text-xs font-semibold tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Apple Signature Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-[#1d1d1f] leading-[1.05]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[#86868b] font-normal tracking-[-0.015em] max-w-xl leading-relaxed">
              {description}
            </p>

            {/* Apple CTA Pill Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="button"
                onClick={() => navigate("/report")}
                className="px-7 py-3.5 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm rounded-full shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all flex items-center gap-2 active:scale-[0.98] group cursor-pointer"
              >
                <span>File a Grievance</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-[#0071e3] hover:underline text-sm font-medium inline-flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Explore Active Resolutions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Apple-Style Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#f5f5f7] flex items-center justify-center border border-black/[0.04]">
              
              {/* 3 Floating Apple Bento Canisters / Cards */}
              <div className="flex items-end justify-center gap-3 sm:gap-4 z-10">
                
                {/* Pillar 1: Citizen App */}
                <div 
                  onClick={() => navigate("/report")}
                  className="w-20 sm:w-24 h-48 sm:h-60 rounded-full bg-gradient-to-b from-[#ffffff] to-[#f5f5f7] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-3 flex flex-col justify-between items-center text-[#1d1d1f] hover:-translate-y-2 transition-transform cursor-pointer border border-black/[0.06]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center shadow-xs mt-2 border border-black/[0.04]">
                    <Camera className="w-4 h-4 text-[#0071e3]" />
                  </div>
                  <div className="bg-white rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-tight text-[#1d1d1f] shadow-2xs border border-black/[0.04]">
                    Snap
                  </div>
                  <div className="text-[10px] font-semibold tracking-tight text-[#86868b] mb-3">
                    Citizen
                  </div>
                </div>

                {/* Pillar 2: Ward Dispatch */}
                <div 
                  onClick={() => navigate("/officers")}
                  className="w-22 sm:w-28 h-56 sm:h-72 rounded-full bg-gradient-to-b from-[#0071e3] to-[#0051a8] shadow-[0_12px_32px_rgba(0,113,227,0.3)] p-3 flex flex-col justify-between items-center text-white hover:-translate-y-2 transition-transform cursor-pointer border border-white/20 relative -mt-4"
                >
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs mt-2">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white text-[#1d1d1f] rounded-full px-2.5 py-1 text-[10px] font-bold tracking-tight shadow-sm">
                    24 Wards
                  </div>
                  <div className="text-[11px] font-medium tracking-tight mb-3 text-white/90">
                    Dispatch
                  </div>
                </div>

                {/* Pillar 3: Resolution */}
                <div 
                  onClick={() => navigate("/dashboard")}
                  className="w-20 sm:w-24 h-48 sm:h-60 rounded-full bg-gradient-to-b from-[#1d1d1f] to-[#000000] shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-3 flex flex-col justify-between items-center text-white hover:-translate-y-2 transition-transform cursor-pointer border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shadow-xs mt-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-tight text-[#34c759]">
                    Proof
                  </div>
                  <div className="text-[10px] font-medium tracking-tight mb-3 text-white/80">
                    Resolved
                  </div>
                </div>
              </div>

              {/* Floating SLA Badge */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-xl border border-black/[0.06] rounded-[20px] p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-center z-20 hover:scale-105 transition-transform">
                <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight leading-none">48h</div>
                <div className="text-[10px] text-[#86868b] font-medium tracking-tight mt-1">SLA guarantee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Apple Bento Sub-Section: Minimalist Pill Search & Telemetry */}
        <div className="mt-10 bg-[#f5f5f7] rounded-[28px] p-6 sm:p-10 space-y-8 border border-black/[0.04]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold text-[#0071e3] tracking-tight">
                Search & Tracking
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight mt-1">
                The entire civic pipeline. In one place.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#86868b]">
              <span className="w-2 h-2 rounded-full bg-[#34c759]" />
              <span>24 Ward Control Rooms Synchronized</span>
            </div>
          </div>

          {/* Minimalist Apple Pill Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/[0.08] focus-within:border-[#0071e3] focus-within:ring-2 focus-within:ring-[#0071e3]/20 flex flex-col sm:flex-row items-center gap-2 transition-all"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input
                type="text"
                aria-label="Search grievance by registration number or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ref No. (#BMC-2026-...) or locality (e.g. Bandra, Ward G-North)..."
                className="w-full pl-11 pr-4 py-3 bg-transparent text-[#1d1d1f] placeholder-[#86868b] font-normal text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs sm:text-sm rounded-full transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-[0_2px_6px_rgba(0,113,227,0.25)] active:scale-[0.98] cursor-pointer"
            >
              <span>Search</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#86868b] mr-1">
              Quick Filter:
            </span>
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => navigate(`/dashboard?category=${encodeURIComponent(cat.category)}`)}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-[#0071e3] hover:text-white border border-black/[0.06] text-[#1d1d1f] text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#0071e3] group-hover:text-white" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* 4 Apple Bento Telemetry Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-black/[0.06]">
            <div className="p-5 bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
              <span className="text-[11px] font-medium text-[#86868b]">Total Registered</span>
              <div className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                {stats?.total || "38"}
              </div>
            </div>

            <div className="p-5 bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
              <span className="text-[11px] font-medium text-[#34c759]">Resolved & Closed</span>
              <div className="text-2xl sm:text-4xl font-semibold text-[#34c759] tracking-tight">
                {stats?.resolved || "24"}
              </div>
            </div>

            <div className="p-5 bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
              <span className="text-[11px] font-medium text-[#0071e3]">Field Action</span>
              <div className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                {stats?.inProgress || "11"}
              </div>
            </div>

            <div className="p-5 bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
              <span className="text-[11px] font-medium text-[#86868b]">Avg. Turnaround</span>
              <div className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                24.8h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
