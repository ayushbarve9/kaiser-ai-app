import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stats } from "../types";
import { 
  Search, Building2, PlusCircle, MapPin, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, 
  PhoneCall, Construction, Droplets, Trash2, Waves, Lightbulb, Bug
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
  badgeText = "Brihanmumbai Municipal Corporation • Official Grievance Portal",
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
    <div className="hero-12 relative my-4 border border-slate-800 shadow-2xl text-white">
      {/* Background Media with Ambient Tone */}
      <img
        src={backgroundImage}
        alt="Mumbai Urban Infrastructure"
        className="hero-12__bg"
      />
      <div className="hero-12__gradient-overlay" />

      {/* Decorative Glow Orbs */}
      <div className="hero-12__glow-circle top-10 right-10" />
      <div className="hero-12__glow-circle bottom-0 left-1/4 opacity-40" />

      {/* Main Curved Overlay Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center Curved Content Shell */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Curved Header Badge */}
            <div className="hero-12__curved-badge">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] sm:text-xs font-semibold text-slate-200 tracking-wide">
                {badgeText}
              </span>
            </div>

            {/* Headline with High Contrast */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white drop-shadow-md">
              {title}
            </h1>

            {/* Explanatory Subtitle */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
              {description}
            </p>

            {/* Curved Search Input Bar (100% Functional) */}
            <form
              onSubmit={handleSearchSubmit}
              className="p-1.5 bg-slate-950/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  aria-label="Search grievance by registration number or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Grievance Ref No. (#BMC-2026-...) or keyword (e.g. Pothole, Ward G-North)..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-400 font-medium text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg active:scale-95 uppercase tracking-wider"
              >
                <Search className="w-4 h-4" />
                <span>Search Portal</span>
              </button>
            </form>

            {/* Quick Filter Department Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-1">
                Quick Category:
              </span>
              {quickCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => navigate(`/dashboard?category=${encodeURIComponent(cat.category)}`)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white text-[11px] font-semibold transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Curved Glass Card: Quick Direct Actions */}
          <div className="lg:col-span-4 hero-12__curved-card p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Civic Emergency & SLA
                </span>
              </div>
              <span className="px-2 py-0.5 bg-orange-600/30 border border-orange-500/40 text-orange-300 text-[10px] font-black rounded-md uppercase">
                24x7 Active
              </span>
            </div>

            <div className="space-y-3">
              <Link
                to="/report"
                className="w-full p-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Civic Grievance</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/map"
                className="w-full p-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Explore Mumbai Ward Map</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Emergency Helpline:</span>
                </div>
                <span className="font-extrabold text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                  1916 (Toll-Free)
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-white/10 font-sans">
              Right to Public Services Act SLA Mandate: <strong>24h - 48h Resolution</strong>
            </div>
          </div>
        </div>

        {/* Bottom Curved Telemetry Metrics Pill Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          <div className="hero-12__curved-card p-4 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Registered</span>
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats?.total || 5}</div>
            <div className="text-[10px] text-slate-300">Across 24 Wards</div>
          </div>

          <div className="hero-12__curved-card p-4 space-y-1">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Resolved & Closed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats?.resolved || 1}</div>
            <div className="text-[10px] text-emerald-300">Field Verified with Proof</div>
          </div>

          <div className="hero-12__curved-card p-4 space-y-1">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Field Action Dispatched</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats?.inProgress || 2}</div>
            <div className="text-[10px] text-amber-300">Active Work Orders</div>
          </div>

          <div className="hero-12__curved-card p-4 space-y-1">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
              <span>Avg. SLA Turnaround</span>
              <Clock className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400">24.8 Hrs</div>
            <div className="text-[10px] text-blue-300">Public Service Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero12;
