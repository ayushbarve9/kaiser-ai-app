import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Stats } from "../types";
import { 
  Search, Building2, PlusCircle, MapPin, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, 
  PhoneCall, Construction, Droplets, Trash2, Waves, Lightbulb, Camera, ChevronRight, Activity
} from "lucide-react";
import { FlipText } from "./FlipText";
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
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  const quickCategories = [
    { name: "Potholes", category: "Pothole", icon: Construction },
    { name: "Water Leaks", category: "Water Leakage", icon: Droplets },
    { name: "Garbage", category: "Garbage", icon: Trash2 },
    { name: "Drainage", category: "Drainage", icon: Waves },
    { name: "Streetlights", category: "Streetlight", icon: Lightbulb },
  ];

  return (
    <div 
      ref={heroRef}
      className="hero-12 relative my-4 text-[#242424] bg-[#f6f3f1] rounded-[40px] border border-[#cecac8] overflow-hidden"
    >
      {/* Top Hero Section */}
      <div className="p-8 sm:p-14 lg:p-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Monad Editorial Serif & Monospace */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#cfdaf5] border border-[#cecac8] text-[#242424] text-xs font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#2b59d1] animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Display Headline - Monad Serif Weight 400 (Never Bold) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-[-0.02em] text-[#242424] leading-[1.05]">
              {title}
            </h1>

            {/* Subtitle - ABC Diatype / JetBrains Monospace */}
            <p className="text-base sm:text-lg text-[#4e4d4d] font-mono leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Monad Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/report")}
                className="px-8 py-3.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono font-medium text-xs uppercase tracking-wider rounded-full transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98] pop-btn"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>File a Grievance</span>
                <span className="text-white">▸</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-7 py-3.5 bg-[#242424] hover:bg-[#000000] text-white font-mono font-medium text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] pop-btn"
              >
                <span>Explore Active Tickets</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Column: Monad Periwinkle Mist Card Surface (#cfdaf5) */}
          <motion.div 
            style={{ y: translateY, opacity }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-full max-w-md bg-[#cfdaf5] text-[#242424] rounded-[40px] p-8 border border-[#cecac8] space-y-6">
              <div className="flex items-center justify-between border-b border-[#cecac8]/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2b59d1] text-white flex items-center justify-center font-medium">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-normal text-[#242424]">Ward Telemetry</h3>
                    <p className="text-[11px] font-mono text-[#4e4d4d] uppercase">BMC Control Network</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f6f3f1] text-[#242424] text-[10px] font-mono font-medium uppercase tracking-wider border border-[#cecac8]">
                  Real-Time
                </span>
              </div>

              {/* 3 Process Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div 
                  onClick={() => navigate("/report")}
                  className="bg-[#f6f3f1] hover:bg-white border border-[#cecac8] p-4 rounded-[24px] cursor-pointer transition-all hover:scale-105"
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-[#2b59d1] text-white flex items-center justify-center mb-2">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[9px] font-mono text-[#797776] uppercase">1. Citizen</div>
                  <div className="text-[11px] font-mono font-medium text-[#242424] uppercase">Photo GPS</div>
                </div>

                <div 
                  onClick={() => navigate("/officers")}
                  className="bg-[#242424] hover:bg-[#000000] text-white border border-[#242424] p-4 rounded-[24px] cursor-pointer transition-all hover:scale-105"
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-white text-[#242424] flex items-center justify-center mb-2">
                    <Building2 className="w-4 h-4 text-[#242424]" />
                  </div>
                  <div className="text-[9px] font-mono text-[#cecac8] uppercase">2. Squad</div>
                  <div className="text-[11px] font-mono font-medium text-white uppercase">2h Dispatch</div>
                </div>

                <div 
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#f6f3f1] hover:bg-white border border-[#cecac8] p-4 rounded-[24px] cursor-pointer transition-all hover:scale-105"
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-[#2b59d1] text-white flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[9px] font-mono text-[#797776] uppercase">3. Resolution</div>
                  <div className="text-[11px] font-mono font-medium text-[#242424] uppercase">48h SLA</div>
                </div>
              </div>

              {/* Status Guarantee Strip */}
              <div className="bg-[#f6f3f1] rounded-full px-5 py-3 border border-[#cecac8] flex items-center justify-between text-xs font-mono">
                <span className="text-[#4e4d4d] font-normal uppercase">Services Act Guarantee</span>
                <span className="text-[#2b59d1] font-medium">100% Enforced</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Telemetry Bar */}
        <div className="mt-8 bg-[#f6f3f1] rounded-[40px] p-8 space-y-6 border border-[#cecac8]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-medium uppercase text-[#2b59d1] tracking-wider">
                Search & Telemetry Index
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#242424] mt-1">
                Track any grievance across Mumbai
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#242424] bg-[#cfdaf5] px-4 py-2 rounded-full border border-[#cecac8]">
              <span className="w-2 h-2 rounded-full bg-[#2b59d1] animate-pulse" />
              <span>24 Ward Control Rooms Active</span>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 bg-white rounded-full border border-[#cecac8] focus-within:border-[#2b59d1] flex flex-col sm:flex-row items-center gap-2 transition-all"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#797776]" />
              <input
                type="text"
                aria-label="Search grievance by registration number or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ref No. (#BMC-2026-...) or locality (e.g. Bandra, Ward G-North, Andheri)..."
                className="w-full pl-12 pr-4 py-3 bg-transparent text-[#242424] placeholder-[#797776] font-mono text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono text-xs font-medium uppercase tracking-wider rounded-full transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search Grievances</span>
              <span className="text-white">▸</span>
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#797776] mr-2">
              Filter:
            </span>
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => navigate(`/dashboard?category=${encodeURIComponent(cat.category)}`)}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-[#cfdaf5] text-[#242424] border border-[#cecac8] text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer group"
                >
                  <Icon className="w-3.5 h-3.5 text-[#2b59d1] transition-colors" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* 4 Telemetry Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#cecac8]">
            <div className="p-6 bg-white rounded-[24px] border border-[#cecac8] space-y-1">
              <span className="text-[10px] font-mono font-medium text-[#797776] uppercase tracking-wider">Total Registered</span>
              <div className="text-3xl font-serif font-normal text-[#242424]">
                {stats?.total || "38"}
              </div>
            </div>

            <div className="p-6 bg-[#cfdaf5] rounded-[24px] border border-[#cecac8] space-y-1">
              <span className="text-[10px] font-mono font-medium text-[#2b59d1] uppercase tracking-wider">Resolved & Closed</span>
              <div className="text-3xl font-serif font-normal text-[#2b59d1]">
                {stats?.resolved || "24"}
              </div>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#cecac8] space-y-1">
              <span className="text-[10px] font-mono font-medium text-[#797776] uppercase tracking-wider">Field Action</span>
              <div className="text-3xl font-serif font-normal text-[#242424]">
                {stats?.inProgress || "11"}
              </div>
            </div>

            <div className="p-6 bg-white rounded-[24px] border border-[#cecac8] space-y-1">
              <span className="text-[10px] font-mono font-medium text-[#797776] uppercase tracking-wider">Avg. Turnaround</span>
              <div className="text-3xl font-serif font-normal text-[#242424]">
                24.8h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
