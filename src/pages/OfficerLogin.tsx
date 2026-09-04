import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  Building2, ShieldCheck, Lock, Mail, BadgeCheck, 
  ArrowRight, ShieldAlert, Key, CheckCircle, AlertTriangle, PhoneCall, UserPlus,
  Search, MapPin, Sparkles, Filter, ChevronRight, Check
} from "lucide-react";

export const OfficerLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [ward, setWard] = useState<number>(9);
  const [activeZone, setActiveZone] = useState<"ALL" | "ISLAND" | "WESTERN" | "EASTERN">("ALL");
  const [wardSearch, setWardSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(
        email.trim(), 
        password, 
        "Officer", 
        { serviceId: serviceId.trim() || `BMC-OFF-${ward < 10 ? '0' + ward : ward}01`, ward }
      );
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Official authentication failed. Please verify your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOfficerDemo = async (
    officerEmail: string, 
    officerWard: number, 
    badgeId: string,
    officerPass: string = "officer123"
  ) => {
    setLoading(true);
    setError(null);
    try {
      await login(officerEmail, officerPass, "Officer", { serviceId: badgeId, ward: officerWard });
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Officer demo authentication failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWardToForm = (w: typeof MUMBAI_WARDS_DATA[0]) => {
    setWard(w.id);
    setEmail(w.officer.email || `amc.${w.code.replace("/", "").toLowerCase()}ward@mcgm.gov.in`);
    setServiceId(`BMC-OFF-${w.id < 10 ? '0' + w.id : w.id}01`);
    setPassword("officer123");
  };

  // Filter 24 Wards by Zone & Search Query
  const filteredWards = MUMBAI_WARDS_DATA.filter((w) => {
    // Zone filter
    if (activeZone === "ISLAND" && (w.id > 9)) return false;
    if (activeZone === "WESTERN" && (w.id < 10 || w.id > 18)) return false;
    if (activeZone === "EASTERN" && (w.id < 19)) return false;

    // Search query filter
    if (wardSearch.trim()) {
      const q = wardSearch.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.code.toLowerCase().includes(q) ||
        w.officer.name.toLowerCase().includes(q) ||
        w.areaDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-[90vh] px-4 py-10 bg-[#0B132B]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Official Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official Government Dispatch Console • 24 Municipal Wards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Brihanmumbai Ward Officers & AMC Control Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Authorized portal for all 24 Mumbai Municipal Wards. Each Ward Executive Officer has a separate, authenticated login with custom credentials and direct jurisdiction over their assigned ward.
          </p>
        </div>

        {/* Main Grid: Left side (24 Wards Directory), Right side (Direct Login Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT: 24-WARD FAST ACCESS & DIRECTORY ACCORDION (7 Cols)                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-amber-400" />
                  <span>24 Ward Officers Directory (1-Click Login)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Select your Ward from South Mumbai, Western, or Eastern suburbs.
                </p>
              </div>

              {/* Zone Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveZone("ALL")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === "ALL" ? "bg-amber-500 text-slate-950 font-black shadow-xs" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All 24
                </button>
                <button
                  type="button"
                  onClick={() => setActiveZone("ISLAND")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === "ISLAND" ? "bg-amber-500 text-slate-950 font-black shadow-xs" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Island (1-9)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveZone("WESTERN")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === "WESTERN" ? "bg-amber-500 text-slate-950 font-black shadow-xs" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Western (10-18)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveZone("EASTERN")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeZone === "EASTERN" ? "bg-amber-500 text-slate-950 font-black shadow-xs" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Eastern (19-24)
                </button>
              </div>
            </div>

            {/* Ward Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={wardSearch}
                onChange={(e) => setWardSearch(e.target.value)}
                placeholder="Search by Ward (e.g. Andheri, Colaba, Dadar, Bandra, Mulund, Borivali)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Scrollable Ward List Container */}
            <div className="max-h-[520px] overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
              {filteredWards.map((w) => {
                const defaultEmail = w.officer.email || `amc.${w.code.replace("/", "").toLowerCase()}ward@mcgm.gov.in`;
                const badge = `BMC-OFF-${w.id < 10 ? '0' + w.id : w.id}01`;
                const isSelectedInForm = ward === w.id;

                return (
                  <div
                    key={w.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelectedInForm
                        ? "bg-slate-800/95 border-amber-400 shadow-md ring-1 ring-amber-400/40"
                        : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/50 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[11px] font-black text-amber-400 font-mono">{w.code}</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase">W-{w.id}</span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-2">
                          <span>{w.officer.name}</span>
                          <span className="text-[10px] px-2 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono font-bold">
                            {badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {w.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {defaultEmail} • {w.officer.contact}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleSelectWardToForm(w)}
                        className="flex-1 sm:flex-none px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-colors"
                        title="Fill into login form"
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickOfficerDemo(defaultEmail, w.id, badge)}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95"
                      >
                        <span>Sign In</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredWards.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No municipal wards found matching "{wardSearch}".
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: CUSTOM OFFICER CREDENTIALS AUTH FORM (5 Cols)                      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-white relative overflow-hidden">
            {/* Top Gold Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none blur-xl"></div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Custom Officer Credentials Login</span>
              </div>
              <h2 className="text-xl font-black text-white">Enter Ward Authentication</h2>
              <p className="text-xs text-slate-400 mt-1">
                Sign in using your chosen official email, badge ID, and custom password.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-950/90 border-2 border-rose-600 rounded-xl text-xs text-rose-200 font-semibold space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
                <div className="pt-1 border-t border-rose-800/80 flex items-center justify-between text-[11px]">
                  <span>Need custom onboarding?</span>
                  <Link to="/register?role=Officer" className="font-bold underline text-amber-300 hover:text-amber-200">
                    Register Officer Account &rarr;
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  1. Assigned Municipal Ward (1 to 24)
                </label>
                <select
                  value={ward}
                  onChange={(e) => {
                    const selectedWardId = Number(e.target.value);
                    setWard(selectedWardId);
                    const selectedWard = MUMBAI_WARDS_DATA.find((w) => w.id === selectedWardId);
                    if (selectedWard && !email) {
                      setEmail(selectedWard.officer.email || `amc.${selectedWard.code.replace("/", "").toLowerCase()}ward@mcgm.gov.in`);
                      setServiceId(`BMC-OFF-${selectedWardId < 10 ? '0' + selectedWardId : selectedWardId}01`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {MUMBAI_WARDS_DATA.map((w) => (
                    <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                      Ward {w.id}: {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  2. Official BMC Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amc.award@mcgm.gov.in or custom email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  3. BMC Service Badge ID
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    placeholder="BMC-OFF-0101"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    4. Security Passcode / Password
                  </label>
                  <span className="text-[10px] text-amber-400/80 font-mono">Default: officer123</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter custom officer password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
              >
                <span>{loading ? "Verifying Official Credentials..." : "Unlock Ward Officer Control Room"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Custom Onboarding Box */}
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Want to set your own custom Email & Password?</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Officers can create their own personalized account for any of the 24 wards with custom email, password, and phone number.
              </p>
              <Link
                to="/register?role=Officer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold underline pt-1"
              >
                <span>Go to Officer Onboarding Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Legal Security Disclaimer */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-tight">
                <strong>Notice:</strong> This console is designated for official Municipal Corporation administration only. 
                Unauthorized access attempts are monitored and recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Switch back to Citizen Portal */}
        <div className="text-center pt-2">
          <Link
            to="/login/citizen"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Are you a resident citizen filing a grievance?</span>
            <span className="text-amber-400 font-bold underline">Go to Citizen Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

