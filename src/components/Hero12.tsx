import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stats } from "../types";
import { 
  Search, Building2, PlusCircle, MapPin, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, 
  PhoneCall, Construction, Droplets, Trash2, Waves, Lightbulb, Camera
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
  badgeText = "Live: All 24 Mumbai Wards Active",
  title = "Real complaints, loud impact, nothing else.",
  description = "Geotagged photographic reporting for 21 million citizens. Direct ward engineer dispatch in 2 hours. No red tape."
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
    <div className="hero-12 relative my-4 text-slate-900 bg-white">
      {/* Top Hero Section */}
      <div className="p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column: Minimalist Typography & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Capsule Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] border border-[#FFE0D4] text-[#E0533C] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Huge Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.06]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="button"
                onClick={() => navigate("/report")}
                className="px-8 py-4 bg-[#D4F72C] hover:bg-[#c2eb1c] text-slate-950 font-black text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 active:scale-95 group cursor-pointer"
              >
                <span>File a grievance</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-slate-800 hover:text-slate-950 font-bold text-sm underline underline-offset-4 decoration-2 decoration-slate-300 hover:decoration-slate-800 transition-all cursor-pointer"
              >
                See active resolutions
              </button>
            </div>
          </div>

          {/* Right Hero Column: Organic Circular Visual with 3 Feature Pillars */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#FFEAE0] flex items-center justify-center shadow-inner">
              
              {/* 3 Floating 3D-styled Pillar Canisters */}
              <div className="flex items-end justify-center gap-3 sm:gap-4 z-10">
                
                {/* Pillar 1: Lime - Citizen App */}
                <div 
                  onClick={() => navigate("/report")}
                  className="w-20 sm:w-24 h-48 sm:h-60 rounded-full bg-gradient-to-b from-[#E2FD52] to-[#BEEB12] shadow-xl p-3 flex flex-col justify-between items-center text-slate-950 hover:-translate-y-2 transition-transform cursor-pointer border-2 border-white"
                >
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-xs mt-2">
                    <Camera className="w-4 h-4 text-slate-900" />
                  </div>
                  <div className="bg-white/90 backdrop-blur-xs rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-900">
                    Snap
                  </div>
                  <div className="text-[10px] font-black tracking-widest uppercase mb-3">
                    CITIZEN
                  </div>
                </div>

                {/* Pillar 2: Coral - Ward Dispatch */}
                <div 
                  onClick={() => navigate("/officers")}
                  className="w-22 sm:w-28 h-56 sm:h-72 rounded-full bg-gradient-to-b from-[#FF5C38] to-[#E03A14] shadow-2xl p-3 flex flex-col justify-between items-center text-white hover:-translate-y-2 transition-transform cursor-pointer border-2 border-white relative -mt-4"
                >
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs mt-2">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white text-slate-900 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    24 Wards
                  </div>
                  <div className="text-[11px] font-black tracking-widest uppercase mb-3 text-white">
                    DISPATCH
                  </div>
                </div>

                {/* Pillar 3: Charcoal - Resolution */}
                <div 
                  onClick={() => navigate("/dashboard")}
                  className="w-20 sm:w-24 h-48 sm:h-60 rounded-full bg-gradient-to-b from-[#2D3748] to-[#1A202C] shadow-xl p-3 flex flex-col justify-between items-center text-white hover:-translate-y-2 transition-transform cursor-pointer border-2 border-white"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-xs mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-xs rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">
                    Proof
                  </div>
                  <div className="text-[10px] font-black tracking-widest uppercase mb-3 text-slate-200">
                    RESOLVED
                  </div>
                </div>
              </div>

              {/* Floating SLA Badge */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3.5 shadow-xl text-center z-20 hover:scale-105 transition-transform">
                <div className="text-2xl font-black text-slate-900 leading-none">48h</div>
                <div className="text-[10px] text-slate-500 font-bold tracking-tight mt-1">SLA guarantee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Hero Section Card: Soft Tinted Clean Card with Search & Telemetry */}
        <div className="mt-12 bg-[#FFF6F2] rounded-3xl p-6 sm:p-10 space-y-8 border border-[#FFE5D8]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E0533C]">
                Search Grievance Database
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                The entire redressal pipeline fits on your screen.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-Time Officer Dispatch Hub</span>
            </div>
          </div>

          {/* Minimalist Pill Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 bg-white rounded-full shadow-sm border border-slate-200 focus-within:border-slate-400 flex flex-col sm:flex-row items-center gap-2 transition-all"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                aria-label="Search grievance by registration number or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ref No. (#BMC-2026-...) or keyword (e.g. Potholes, Dadar, Ward K-West)..."
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 font-medium text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-full transition-all shrink-0 flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1">
              Popular:
            </span>
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => navigate(`/dashboard?category=${encodeURIComponent(cat.category)}`)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#E0533C]" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* 4 Bottom Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#FFE5D8]">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Registered</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.total || "38"}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Resolved & Closed</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                {stats?.resolved || "24"}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Field Dispatched</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.inProgress || "11"}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Avg. Turnaround</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                24.8 Hrs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
