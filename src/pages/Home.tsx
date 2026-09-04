import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint, Stats } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { MumbaiMap } from "../components/MumbaiMap";
import { PhotoWardFetcher } from "../components/PhotoWardFetcher";
import { ScrollExpand } from "../components/ScrollExpand";
import { 
  PlusCircle, Search, MapPin, CheckCircle2, 
  ShieldCheck, Flame, ArrowRight, CloudRain, Cpu,
  Construction, Droplets, Trash2, Waves, Lightbulb, Bug,
  FileText, Megaphone, PhoneCall, Building2, Clock, Sparkles
} from "lucide-react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [criticalIssues, setCriticalIssues] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherAlert, setWeatherAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

      {/* Main Official Header / Portal Banner */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Brihanmumbai Municipal Corporation • Official Grievance Redressal Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Public Grievance Registration & Ward Management System
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Citizens can register civic grievances regarding potholes, water leakage, garbage accumulation, or street lighting directly to Ward Officers for tracked resolution under the Maharashtra Right to Public Services Act.
            </p>

            {/* Official Search Form */}
            <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  aria-label="Search grievance by registration number or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Grievance Ref No. (#BMC-2026-...) or keyword (e.g. Potholes, Ward G-North)..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-300 shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wide shadow-2xs"
              >
                <Search className="w-4 h-4" />
                <span>Search Portal</span>
              </button>
            </form>
          </div>

          {/* Official Statistics Metrics Board */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Grievances Registered</div>
              <div className="text-2xl font-black text-white mt-1">{stats?.total || 5}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Across All 24 Wards</div>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Resolved & Closed</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.resolved || 1}</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">Ward Verified</div>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Under Process / Field Action</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{stats?.inProgress || 2}</div>
              <div className="text-[11px] text-amber-300 mt-0.5">Field Units Dispatched</div>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-lg border border-slate-700">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Avg. SLA Resolution Time</div>
              <div className="text-2xl font-black text-blue-400 mt-1">24.8 Hrs</div>
              <div className="text-[11px] text-blue-300 mt-0.5">Right to Service Standard</div>
            </div>
          </div>
        </div>
      </section>

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
            scrollHint="Scroll down to expand view"
            useWindowScroll={true}
            mediaZoom={1.35}
            startWidth={48}
            startHeight={64}
            startRadius={24}
            endRadius={0}
            scrollDistance={0.9}
            holdDistance={0.25}
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
