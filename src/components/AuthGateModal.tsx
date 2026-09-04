import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Building2, User, ShieldAlert, ArrowRight, CheckCircle2, 
  Sparkles, ShieldCheck, Lock, UserPlus, LogIn, Eye, X
} from "lucide-react";

export const AuthGateModal: React.FC = () => {
  const { user, login, exploreAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  // If user is already authenticated or already on an authentication/sign-in page, do not render modal gate
  const isAuthPage = 
    location.pathname.startsWith("/login") || 
    location.pathname.startsWith("/register");

  if (user || isAuthPage) return null;

  const handleQuickDemo = async (role: "Citizen" | "Officer") => {
    setLoadingDemo(role);
    try {
      if (role === "Officer") {
        await login("officer.hwest@civic.com", "officer123", "Officer", {
          serviceId: "BMC-OFF-0901",
          ward: 9,
        });
        navigate("/admin");
      } else {
        await login("aarav@example.com", "citizen123", "Citizen", { ward: 9 });
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200 relative">
        {/* Top Tricolor Stripe */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center space-y-3 relative">
          {/* Close / Dismiss Button */}
          <button
            onClick={exploreAsGuest}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
            title="Dismiss & Browse as Guest"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Building2 className="w-7 h-7 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>Government of Maharashtra • BMC</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to KAISER CivicConnect AI
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Please sign in or create an account to access automated civic grievance reporting, AI image hazard triage, or the Ward Officer Control Room.
          </p>
        </div>

        {/* Dual Portal Selection Cards */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Citizen Portal Choice */}
            <div className="p-5 rounded-2xl border-2 border-orange-200 bg-orange-50/40 hover:border-orange-500 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Resident Citizen</h3>
                <p className="text-xs text-slate-600 leading-normal">
                  Report civic issues (potholes, garbage, water leaks), track repairs, and upvote local ward priorities.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login/citizen")}
                  className="w-full py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Citizen Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register?role=Citizen")}
                  className="w-full py-2.5 px-3 bg-white hover:bg-orange-100/60 border border-orange-300 text-orange-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Account</span>
                </button>
              </div>
            </div>

            {/* Ward Officer Portal Choice */}
            <div className="p-5 rounded-2xl border-2 border-slate-800 bg-slate-900 text-white hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-white">Ward Officer / AMC</h3>
                <p className="text-xs text-slate-300 leading-normal">
                  Confidential console for BMC officers. Review AI severity triage, dispatch maintenance crews, and manage SLAs.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login/officer")}
                  className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Officer Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register?role=Officer")}
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Officer Onboarding</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Demo Instant Buttons */}
          <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold">Test with 1-Click Demo:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleQuickDemo("Citizen")}
                disabled={loadingDemo !== null}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-300 text-slate-800 font-bold text-xs rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors shadow-2xs"
              >
                {loadingDemo === "Citizen" ? "Logging in..." : "Demo Citizen"}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("Officer")}
                disabled={loadingDemo !== null}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
              >
                {loadingDemo === "Officer" ? "Logging in..." : "Demo Officer"}
              </button>
            </div>
          </div>

          {/* Guest Pass */}
          <div className="text-center pt-1">
            <button
              onClick={exploreAsGuest}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-semibold underline inline-flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Explore Public Portal as Guest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

