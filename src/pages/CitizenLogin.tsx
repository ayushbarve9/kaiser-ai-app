import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  User, Mail, Lock, Phone, ArrowRight, Shield, Building2, 
  CheckCircle2, Sparkles, AlertCircle, Award, UserPlus
} from "lucide-react";

export const CitizenLogin: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      const loginIdentifier = authMethod === "email" ? email.trim() : `${phone.replace(/\D/g, "")}@citizen.civic.com`;
      await login(loginIdentifier, password, "Citizen", { ward, phone: authMethod === "phone" ? phone : undefined });
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to sign in. Please verify your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCitizenDemo = async (demoEmail: string, demoWard: number) => {
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail, "citizen123", "Citizen", { ward: demoWard });
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Demo sign in failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-100 via-white to-slate-50">
      <div className="w-full max-w-lg space-y-6">
        {/* Tricolor Accent Pill */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 py-1.5 px-4 rounded-full shadow-2xs mx-auto w-max">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Brihanmumbai Citizen Redressal Portal</span>
        </div>

        {/* Main Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto text-white font-bold shadow-md">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citizen Resident Sign In</h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Track your reported grievances, upvote neighborhood civic repairs, and communicate with your ward engineers.
            </p>
          </div>

          {/* Quick Demo Citizen Profiles */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Pre-Verified Demo Resident Accounts
              </span>
              <span className="text-[10px] text-amber-700 font-medium">1-Click Sign In</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickCitizenDemo("aarav@example.com", 9)}
                className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-800 font-bold text-xs rounded-xl transition-all text-left shadow-2xs group"
              >
                <div className="text-xs text-slate-900 group-hover:text-amber-700 font-bold">Aarav Sharma</div>
                <div className="text-[10px] text-slate-500">Ward 9 • Bandra West</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickCitizenDemo("priya@example.com", 11)}
                className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-800 font-bold text-xs rounded-xl transition-all text-left shadow-2xs group"
              >
                <div className="text-xs text-slate-900 group-hover:text-amber-700 font-bold">Priya Mehta</div>
                <div className="text-[10px] text-slate-500">Ward 11 • Dadar West</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-xl text-xs text-rose-800 font-semibold space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <div className="pt-1 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                <span>Don't have an account yet?</span>
                <Link to="/register?role=Citizen" className="font-bold underline text-rose-900 hover:text-rose-950">
                  Click here to Sign Up &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Method switch */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className={`py-2 rounded-lg transition-all ${
                  authMethod === "email" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Email Address
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("phone")}
                className={`py-2 rounded-lg transition-all ${
                  authMethod === "phone" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Mobile Number
              </button>
            </div>

            {authMethod === "email" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@example.com"
                    required={authMethod === "email"}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (+91)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required={authMethod === "phone"}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-orange-600 hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Primary Mumbai Ward
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {MUMBAI_WARDS_DATA.map((w) => (
                  <option key={w.id} value={w.id}>
                    Ward {w.code} - {w.name} ({w.primaryRailwayStations})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Verifying Credentials..." : "Enter Citizen Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* New Member Sign Up Banner */}
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-xs font-extrabold text-orange-950 flex items-center justify-center sm:justify-start gap-1.5">
                <UserPlus className="w-4 h-4 text-orange-600" />
                <span>New Mumbai Member?</span>
              </div>
              <div className="text-[11px] text-orange-800">Create a secure resident account in 30 seconds.</div>
            </div>
            <Link
              to="/register?role=Citizen"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all shrink-0 shadow-2xs"
            >
              Sign Up (New Member)
            </Link>
          </div>
        </div>

        {/* Switch to Official Ward Officer Portal */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">BMC Ward Officer or Engineer?</div>
              <div className="text-[11px] text-slate-400">Access Official Triage & Dispatch Console</div>
            </div>
          </div>
          <Link
            to="/login/officer"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Officer Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
