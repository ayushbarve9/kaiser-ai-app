import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  Building2, ShieldCheck, Lock, Mail, BadgeCheck, 
  ArrowRight, ShieldAlert, Key, CheckCircle, AlertTriangle, PhoneCall
} from "lucide-react";

export const OfficerLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [ward, setWard] = useState<number>(9);
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
        email || "officer.hwest@civic.com", 
        password, 
        "Officer", 
        { serviceId: serviceId || `BMC-OFF-${ward < 10 ? '0' + ward : ward}01`, ward }
      );
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Official authentication failed. Please verify your Service ID and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOfficerDemo = async (
    officerEmail: string, 
    officerWard: number, 
    badgeId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await login(officerEmail, "officerpass123", "Officer", { serviceId: badgeId, ward: officerWard });
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Officer demo authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10 bg-[#0B132B]">
      <div className="w-full max-w-xl space-y-6">
        {/* Official Header Badge */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official Government Dispatch Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Ward Officer & AMC Authentication
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Authorized municipal personnel access for automated AI triage, contractor dispatch, and SLA enforcement.
          </p>
        </div>

        {/* Official Login Card */}
        <div className="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 text-white relative overflow-hidden">
          {/* Top Gold Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none blur-xl"></div>

          {/* Quick Demo Officer Profiles */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-amber-400" /> Verified Officer 1-Click Access
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                Executive Clearance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickOfficerDemo("officer.hwest@civic.com", 9, "BMC-OFF-0901")}
                className="p-3 bg-slate-900/90 hover:bg-slate-700 border border-slate-600 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400">AMC V. Vispute</div>
                <div className="text-[10px] text-amber-400/90 font-mono">Ward 9 (H-West)</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Bandra West</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickOfficerDemo("officer.gnorth@civic.com", 11, "BMC-OFF-1102")}
                className="p-3 bg-slate-900/90 hover:bg-slate-700 border border-slate-600 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400">AMC K. Dighavkar</div>
                <div className="text-[10px] text-amber-400/90 font-mono">Ward 11 (G-North)</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Dadar / Dharavi</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickOfficerDemo("officer.award@civic.com", 1, "BMC-OFF-0103")}
                className="p-3 bg-slate-900/90 hover:bg-slate-700 border border-slate-600 rounded-xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400">AMC S. Gurav</div>
                <div className="text-[10px] text-amber-400/90 font-mono">Ward 1 (A-Ward)</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Fort / Colaba</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-700 rounded-xl text-xs text-rose-300 font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Official BMC Email / Service Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer.hwest@civic.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  BMC Service Badge ID
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    placeholder="BMC-OFF-0901"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Ward Jurisdiction
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {MUMBAI_WARDS_DATA.map((w) => (
                    <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                      Ward {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Official Passcode / Security PIN
                </label>
                <span className="text-[10px] text-amber-400/80 font-mono">256-Bit Encrypted</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              <span>{loading ? "Authenticating Clearance..." : "Access Officer Control Room"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Legal Security Disclaimer */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Notice:</strong> This console is designated for official Municipal Corporation administration only. 
              Unauthorized access attempts are monitored and recorded.
            </p>
          </div>

          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span>Register as new Municipal Staff? </span>
            <Link to="/register?role=Officer" className="text-amber-400 font-bold hover:underline">
              Officer Onboarding Form
            </Link>
          </div>
        </div>

        {/* Switch back to Citizen Portal */}
        <div className="text-center">
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
