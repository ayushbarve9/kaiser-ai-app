import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint, Stats } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { MumbaiMap } from "../components/MumbaiMap";
import { PhotoWardFetcher } from "../components/PhotoWardFetcher";
import { ScrollExpand } from "../components/ScrollExpand";
import { OptionWheel } from "../components/OptionWheel";
import { Hero12 } from "../components/Hero12";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  PlusCircle, Search, MapPin, CheckCircle2, 
  ShieldCheck, Flame, ArrowRight, CloudRain, Cpu,
  Construction, Droplets, Trash2, Waves, Lightbulb, Bug,
  FileText, Megaphone, PhoneCall, Building2, Clock, Sparkles,
  Award, Mail, Phone, Compass, RotateCw
} from "lucide-react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [criticalIssues, setCriticalIssues] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherAlert, setWeatherAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWardWheelIndex, setSelectedWardWheelIndex] = useState(4); // Default to Ward H-West (Bandra)

  const wardWheelItems = MUMBAI_WARDS_DATA.map(
    (w) => `Ward ${w.code} • ${w.areas[0] || w.name.split("(")[1]?.replace(")", "") || w.name}`
  );
  const activeWheelWard = MUMBAI_WARDS_DATA[selectedWardWheelIndex] || MUMBAI_WARDS_DATA[0];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes, topRes, weatherRes] = await Promise.all([
        complaintService.getStats(),
        complaintService.getAll({ sortBy: "newest" }),
        complaintService.getTop10(),
        complaintService.getWeatherAlerts().catch(() => null),
      ]);
      setStats(statsRes.data);
      setAllComplaints(complaintsRes.data);
      setCriticalIssues(topRes.data.slice(0, 3));
      if (weatherRes?.data) {
        setWeatherAlert(weatherRes.data);
      }
    } catch (err) {
      console.error("Failed to load home data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const civicDepartments = [
    { name: "Roads & Potholes", icon: Construction, category: "Pothole" },
    { name: "Water Supply & Leaks", icon: Droplets, category: "Water Leakage" },
    { name: "Solid Waste Management", icon: Trash2, category: "Garbage" },
    { name: "Stormwater Drainage", icon: Waves, category: "Drainage" },
    { name: "Street Lighting", icon: Lightbulb, category: "Streetlight" },
    { name: "Pest Control & Health", icon: Bug, category: "Other" },
  ];

  return (
    <div className="space-y-8 pb-16 bg-slate-50">
      {/* Official Government Public Notice Strip */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              PUBLIC NOTICE
            </span>
            <span className="font-medium text-slate-200">
              Monsoon Control Room Active: High Tide Warning 4.2m expected at 14:30. 24x7 Helpline: <strong>1916</strong>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Right to Public Services Act Mandate SLA: 24h - 48h
          </div>
        </div>
      </div>

      {/* Weather Alert Panel if Active */}
      {weatherAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-lg text-xs font-medium shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CloudRain className="w-5 h-5 text-amber-700 shrink-0" />
              <span>
                <strong className="text-amber-900 uppercase font-bold">Weather Advisory ({weatherAlert.weatherStatus}):</strong> Estimated high tide at <span className="font-mono font-bold">{weatherAlert.highTideTime}</span> ({weatherAlert.highTideHeightMeters}m). Emergency response units deployed.
              </span>
            </div>
            <Link to="/map" className="text-amber-900 hover:text-black font-bold underline shrink-0">
              View Flood Map &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* React Bits Pro Hero 12: Background image with curved shape text overlays */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero12
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          stats={stats}
          backgroundImage="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85"
          badgeText="Brihanmumbai Municipal Corporation • Official Grievance Redressal Portal"
          title="Public Grievance Registration & Ward Management System"
          description="Citizens can register civic grievances regarding potholes, water leakage, garbage accumulation, or street lighting directly to Ward Officers for tracked resolution under the Maharashtra Right to Public Services Act."
        />
      </div>

      {/* Main Portal Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Civic Department Directory Grid */}
        <section className="space-y-3">
          <div className="border-b border-slate-300 pb-2">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              Municipal Departments
            </h2>
            <p className="text-xs text-slate-600">Select department category to view or register civic grievances</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {civicDepartments.map((dept) => {
              const IconComp = dept.icon;
              return (
                <button
                  key={dept.name}
                  onClick={() => navigate(`/dashboard?category=${encodeURIComponent(dept.category)}`)}
                  className="p-4 bg-white rounded-lg border border-slate-300 hover:border-slate-800 shadow-2xs transition-all text-left flex flex-col justify-between space-y-3 group"
                >
                  <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                      {dept.name}
                    </span>
                    <span className="text-[10px] text-blue-900 font-semibold block pt-1">
                      View Tickets &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Photo Ward Locating Tool */}
        <section className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs">
          <PhotoWardFetcher onSelectWard={(w) => navigate(`/dashboard?ward=${w.id}`)} />
        </section>

        {/* Ward Jurisdiction Map */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-orange-600" />
                Greater Mumbai Ward Map
              </h2>
              <p className="text-xs text-slate-600">Geotagged locations of reported grievances across 24 municipal wards</p>
            </div>
            <Link to="/map" className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1">
              Full Screen Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MumbaiMap complaints={allComplaints} height="400px" />
        </section>

        {/* ========================================================================= */}
        {/* REACT BITS OPTION-WHEEL 24-WARD JURISDICTIONAL ROTARY DIAL                */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0A1922] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Interactive 3D Rotary Selector
                </span>
                <span className="text-orange-400 text-xs font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> 24 Wards Direct Telemetry
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                24-Ward Municipal Executive Wheel
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Spin the interactive dial or drag options to instantly inspect administrative boundaries, assigned Assistant Municipal Commissioners, 24x7 control room helplines, and live SLA resolution rates.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
              <RotateCw className="w-3.5 h-3.5 text-orange-400 animate-spin-slow" />
              <span>Scroll, Click or Drag Wheel</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: 3D OptionWheel Rotary Dial */}
            <div className="lg:col-span-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3 relative h-[360px] overflow-hidden shadow-inner flex items-center">
              <div className="absolute top-3 left-4 z-10 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Select Administrative Zone:</span>
              </div>

              {/* Center Active Indicator Line */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-14 bg-gradient-to-r from-orange-500/15 via-orange-500/25 to-transparent border-y border-orange-500/30 pointer-events-none z-0" />

              <OptionWheel
                items={wardWheelItems}
                defaultSelected={selectedWardWheelIndex}
                onChange={(index) => setSelectedWardWheelIndex(index)}
                side="left"
                fontSize={1.4}
                spacing={1.7}
                curve={1.1}
                tilt={7}
                blur={1.5}
                fade={0.3}
                minOpacity={0.15}
                smoothing={180}
                inset={36}
                loop={true}
                draggable={true}
                textColor="#94a3b8"
                activeColor="#ffffff"
                className="h-full z-10"
              />
            </div>

            {/* Right: Dynamic Ward Executive Dossier Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 rounded-2xl border border-slate-700/80 p-6 space-y-5 shadow-xl">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-orange-600 text-white font-black text-xs rounded-md uppercase">
                      Ward {activeWheelWard.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {activeWheelWard.railwayCorridor} Zone
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    {activeWheelWard.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    Coverage: {activeWheelWard.areaDescription}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">City Rank</div>
                  <div className="text-xl font-black text-amber-400">
                    #{activeWheelWard.officer.rank || 1}
                  </div>
                </div>
              </div>

              {/* Officer Bio Row */}
              <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <img
                  src={activeWheelWard.officer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={activeWheelWard.officer.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-orange-500 shadow-md shrink-0"
                />
                <div className="space-y-0.5 text-xs flex-1">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide block">
                    Assigned Assistant Municipal Commissioner
                  </span>
                  <p className="font-extrabold text-white text-sm">
                    {activeWheelWard.officer.name}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {activeWheelWard.officer.designation}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Resolution Rate</span>
                  <span className="text-sm font-black text-emerald-400 mt-0.5 block">
                    {activeWheelWard.officer.resolutionRate}%
                  </span>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg. SLA Time</span>
                  <span className="text-sm font-black text-blue-400 mt-0.5 block">
                    {activeWheelWard.officer.avgResolutionDays} Days
                  </span>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Air Quality</span>
                  <span className="text-sm font-black text-amber-400 mt-0.5 block">
                    {activeWheelWard.weatherAndAqi?.aqi || 120} AQI
                  </span>
                </div>
              </div>

              {/* Contact & Action CTA */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-400" />
                    <span>Control Room: {activeWheelWard.officer.contact}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Hubs: {activeWheelWard.primaryRailwayStations}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => navigate(`/dashboard?ward=${activeWheelWard.id}`)}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>View Ward {activeWheelWard.code} Tickets</span>
                  </button>
                  <button
                    onClick={() => navigate(`/report?ward=${activeWheelWard.code}`)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                    <span>File Complaint Here</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Priority Grievance Queue */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-300 pb-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                Top Priority Grievance Triage Queue
              </h2>
              <p className="text-xs text-slate-600">Urgent civic issues prioritized by AI hazard assessment & citizen endorsements</p>
            </div>
            <Link to="/top10" className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1">
              View All Priority Issues <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {criticalIssues.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} onUpvote={loadHomeData} />
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* REACT BITS SCROLL-EXPAND CIVIC EXPERIENCE SHOWCASE                        */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900">
          <ScrollExpand
            src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=85"
            alt="Mumbai Coastal Road Infrastructure"
            title="Building a Smarter, Safer Mumbai"
            scrollHint="Scroll to expand view"
            useWindowScroll={true}
            mediaZoom={1.25}
            startWidth={52}
            startHeight={68}
            startRadius={20}
            endRadius={0}
            scrollDistance={0.4}
            holdDistance={0}
            overlayScrim={0.55}
          >
            <div className="max-w-2xl text-white space-y-4 p-6 sm:p-8 bg-black/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-orange-600 rounded-full text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> 24 Wards Synchronized
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-snug text-white">
                Every Ward. Every Street. Verified Civic Action.
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                From real-time potholes detection to automated resolution notices sent straight to your email, CivicConnect puts municipal transparency into the palm of your hand.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/report"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>File a Grievance</span>
                </Link>
                <Link
                  to="/map"
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all border border-white/20 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Explore Mumbai Map</span>
                </Link>
              </div>
            </div>
          </ScrollExpand>
        </section>

        {/* Dual Authentication Gateway Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black text-orange-600 uppercase tracking-wider">
              MUMBAI CIVIC ACCESS DOORS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Access Citizen Redressal or Municipal Officer Dispatch
            </h2>
            <p className="text-xs text-slate-500">
              Dedicated high-security login portals designed separately for Mumbai residents and BMC ward administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-2xl border-2 border-orange-200/80 hover:border-orange-400 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Resident Citizen Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in to track your submitted grievances, monitor neighborhood civic resolutions, upvote priority road repairs, and receive instant status updates.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/login/citizen"
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Citizen Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/register?role=Citizen"
                  className="text-xs text-orange-700 font-bold hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-2xl border-2 border-slate-800 hover:border-amber-500 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Ward Officer Control Room</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Confidential console for Assistant Municipal Commissioners and ward engineers. Manage AI severity triage, dispatch contractor squads, and fulfill SLA metrics.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/login/officer"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Officer Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/register?role=Officer"
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  Staff Onboarding
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SLA & Service Standards */}
        <section className="bg-slate-900 text-white rounded-lg p-6 border border-slate-800 shadow-2xs space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Public Service Guarantee</span>
            <h2 className="text-lg font-extrabold text-white">Redressal Process & SLA Mandates</h2>
            <p className="text-xs text-slate-300">Standard operating procedure under the Maharashtra Right to Public Services Act</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800 p-4 rounded border border-slate-700 space-y-1">
              <div className="font-bold text-amber-400">1. Citizen Filing & Verification</div>
              <p className="text-slate-300 leading-relaxed">
                Geotagged image submission with automated location ward tagging and AI tamper validation.
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded border border-slate-700 space-y-1">
              <div className="font-bold text-amber-400">2. Ward Executive Assignment</div>
              <p className="text-slate-300 leading-relaxed">
                Direct dispatch to designated Ward Assistant Commissioner & field repair teams within 2 hours.
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded border border-slate-700 space-y-1">
              <div className="font-bold text-emerald-400">3. Resolution & Closure</div>
              <p className="text-slate-300 leading-relaxed">
                Field team uploads verified after-completion photo evidence before ticket closure in portal.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
