import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  PlusCircle, Map, LayoutDashboard, ShieldAlert, Building2, Award, 
  ShieldCheck, UserCheck, Flame, PhoneCall, Globe, LogOut, FileText,
  Lock, ArrowRight, UserPlus, LogIn, ChevronDown, ChevronRight
} from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isOfficer, isCitizen, isAuthenticated, logout, switchRole } = useAuth();
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/85 border-b border-black/[0.08] transition-all">
      {/* Top National Tricolor Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Official Government Utility & Accessibility Bar */}
      <div className="bg-[#f5f5f7] text-[#86868b] px-4 py-1.5 text-[11px] border-b border-black/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government Identification */}
          <div className="flex items-center gap-2 font-normal">
            <span className="font-semibold text-[#1d1d1f] tracking-tight">GOVERNMENT OF MAHARASHTRA</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#515154]">Brihanmumbai Municipal Corporation (BMC)</span>
            <span className="hidden md:inline-block text-slate-300">|</span>
            <span className="hidden md:inline-block text-[#0071e3] font-medium">
              CivicConnect Redressal Portal
            </span>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:1916" className="flex items-center gap-1 text-[#515154] hover:text-[#0071e3] transition-colors">
              <PhoneCall className="w-3 h-3 text-[#0071e3]" />
              <span>Helpline: <strong className="text-[#1d1d1f] font-mono">1916</strong></span>
            </a>
            <span className="text-slate-300">|</span>
            <Link to="/register" className="text-[#0071e3] hover:underline font-medium flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Branding Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Official Emblem & Portal Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] flex flex-col items-center justify-center text-[#1d1d1f] shrink-0 shadow-2xs group-hover:scale-105 transition-all">
              <Building2 className="w-5 h-5 text-[#0071e3]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-[#1d1d1f] text-base sm:text-lg tracking-tight">
                  CivicConnect
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-black/[0.06] text-[10px] font-semibold text-[#0071e3]">
                  BMC
                </span>
              </div>
              <p className="text-[11px] text-[#86868b] font-normal tracking-tight">
                Public Grievance Redressal & Ward Management (Govt. of Maharashtra)
              </p>
            </div>
          </Link>

          {/* Navigation Links + CTA Buttons */}
          <div className="flex items-center gap-3">
            {/* Nav Links for Desktop */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#515154]">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isActive("/")
                    ? "bg-[#1d1d1f] text-white"
                    : "hover:bg-black/[0.04] text-[#515154] hover:text-[#1d1d1f]"
                }`}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isActive("/dashboard")
                    ? "bg-[#1d1d1f] text-white"
                    : "hover:bg-black/[0.04] text-[#515154] hover:text-[#1d1d1f]"
                }`}
              >
                Grievances
              </Link>
              <Link
                to="/map"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isActive("/map")
                    ? "bg-[#1d1d1f] text-white"
                    : "hover:bg-black/[0.04] text-[#515154] hover:text-[#1d1d1f]"
                }`}
              >
                Ward Map
              </Link>
              <Link
                to="/top10"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isActive("/top10")
                    ? "bg-[#1d1d1f] text-white"
                    : "hover:bg-black/[0.04] text-[#515154] hover:text-[#1d1d1f]"
                }`}
              >
                Priority Queue
              </Link>
              <Link
                to="/officers"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isActive("/officers")
                    ? "bg-[#1d1d1f] text-white"
                    : "hover:bg-black/[0.04] text-[#515154] hover:text-[#1d1d1f]"
                }`}
              >
                Officers
              </Link>
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                  isActive("/admin")
                    ? "bg-[#1d1d1f] text-white"
                    : isOfficer
                    ? "bg-[#0071e3]/10 text-[#0071e3] font-semibold"
                    : "hover:bg-black/[0.04] text-[#515154]"
                }`}
              >
                {isOfficer ? <ShieldAlert className="w-3 h-3 text-[#0071e3]" /> : <Lock className="w-3 h-3 text-[#86868b]" />}
                <span>Control Room</span>
              </Link>
            </nav>

            {/* Apple Blue Pill: File Grievance */}
            <button
              onClick={() => navigate("/report")}
              className="inline-flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-4 py-2 rounded-full transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] shrink-0 active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File Grievance</span>
            </button>

            {/* User Session State */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-black/[0.08]">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-end gap-1">
                    {isOfficer && <ShieldCheck className="w-3 h-3 text-[#0071e3]" />}
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[10px] text-[#86868b]">
                    Ward {user.ward} {isOfficer ? "Officer" : "Citizen"}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout Session"
                  className="p-2 text-[#86868b] hover:text-rose-600 hover:bg-black/[0.04] rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-black/[0.08]">
                <Link
                  to="/login/citizen"
                  className="text-xs font-medium text-[#515154] hover:text-[#1d1d1f] px-3 py-1.5 rounded-full hover:bg-black/[0.04] transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
