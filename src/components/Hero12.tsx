import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stats } from "../types";
import { 
  Search, Building2, PlusCircle, MapPin, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, 
  PhoneCall, Construction, Droplets, Trash2, Waves, Lightbulb
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
  backgroundImage = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85",
  badgeText = "Brihanmumbai Municipal Corporation • Official Grievance Redressal Portal",
  title = "Public Grievance Registration & Ward Management System",
  description = "Empowering 21 million citizens to register, track, and verify civic resolutions across all 24 municipal wards with AI hazard screening and real-time photographic proof."
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
    <div className="hero-12 relative my-4 text-slate-900">
      {/* Background Media with Subtle Watermark Tone */}
      <img
        src={backgroundImage}
        alt="Mumbai Urban Infrastructure"
        className="hero-12__bg"
      />
      <div className="hero-12__gradient-overlay" />

      {/* Main Curved Overlay Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center Content Column */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Curved Header Badge */}
            <div className="hero-12__curved-badge">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <Building2 className="w-4 h-4 text-[#B45309]" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wide">
                {badgeText}
              </span>
            </div>

            {/* Headline with High Contrast Oxford Navy */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-[#0F172A]">
              {title}
            </h1>

            {/* Explanatory Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-2xl">
              {description}
            </p>

            {/* Clean White Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="p-1.5 bg-white border-2 border-slate-300 focus-within:border-[#B45309] rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-2 max-w-2xl transition-all"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  aria-label="Search grievance by registration number or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Grievance Ref No. (#BMC-2026-...) or keyword (e.g. Potholes, Ward G-North)..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 font-medium text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shrink-0 flex items-center justify-center gap-2 shadow-sm active:scale-95 uppercase tracking-wider"
              >
                <Search className="w-4 h-4" />
                <span>Search Portal</span>
              </button>
            </form>

            {/* Quick Filter Department Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-1">
                Quick Category:
              </span>
              {quickCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => navigate(`/dashboard?category=${encodeURIComponent(cat.category)}`)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-900 text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Crisp Card: Quick Direct Actions */}
          <div className="lg:col-span-4 hero-12__curved-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B45309]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#0F172A]">
                  Civic Emergency & SLA
                </span>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black rounded-md uppercase">
                24x7 Active
              </span>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/report"
                className="w-full p-3.5 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-between group active:scale-95"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Civic Grievance</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/map"
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-all flex items-center justify-between group active:scale-95"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B45309]" />
                  <span>Explore Mumbai Ward Map</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700 font-mono">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-sans font-semibold">Emergency Helpline:</span>
                </div>
                <span className="font-extrabold text-[#0F172A] bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] shadow-2xs">
                  1916 (Toll-Free)
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center pt-1 border-t border-slate-100 font-sans">
              Right to Public Services Act SLA Mandate: <strong className="text-slate-800">24h - 48h Resolution</strong>
            </div>
          </div>
        </div>

        {/* Bottom Clean Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Total Registered</span>
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-[#0F172A]">{stats?.total || 5}</div>
            <div className="text-[10px] text-slate-500">Across 24 Wards</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
              <span>Resolved & Closed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">{stats?.resolved || 1}</div>
            <div className="text-[10px] text-emerald-600">Field Verified with Proof</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
              <span>Field Action Dispatched</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">{stats?.inProgress || 2}</div>
            <div className="text-[10px] text-amber-600">Active Work Orders</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center justify-between">
              <span>Avg. SLA Turnaround</span>
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700">24.8 Hrs</div>
            <div className="text-[10px] text-blue-600">Public Service Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero12;
