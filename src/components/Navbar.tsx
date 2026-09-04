import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  PlusCircle, Map, LayoutDashboard, ShieldAlert, Building2, Award, 
  ShieldCheck, UserCheck, Flame, PhoneCall, Globe, LogOut, FileText,
  Lock, ArrowRight, UserPlus, LogIn, ChevronDown
} from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isOfficer, isCitizen, isAuthenticated, logout, switchRole } = useAuth();
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-300">
      {/* Top National Tricolor Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Official Government Utility & Accessibility Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government Identification */}
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-white tracking-wide">GOVERNMENT OF MAHARASHTRA</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200">Brihanmumbai Municipal Corporation (BMC)</span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:inline-block text-amber-400 font-semibold text-[11px]">
              MyGov Civic Redressal & Dispatch System
            </span>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:1916" className="flex items-center gap-1 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Toll Free Helpline: <strong className="text-amber-300 font-mono">1916</strong></span>
            </a>
            <span className="text-slate-600">|</span>
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Branding Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Official Emblem & Portal Title */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border-2 border-amber-500 flex flex-col items-center justify-center text-white shrink-0 shadow-xs group-hover:border-amber-400 transition-colors">
              <Building2 className="w-6 h-6 text-amber-400" />
              <span className="text-[8px] font-black tracking-widest text-amber-300 uppercase -mt-0.5">BMC</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight uppercase">
                  BRIHANMUMBAI MUNICIPAL CORPORATION
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Public Grievance Redressal & Ward Management Portal (Govt. of Maharashtra)
              </p>
            </div>
          </Link>

          {/* Role Badge, Switcher & Action Controls */}
          <div className="flex items-center gap-3">
            {/* Primary Action: File Grievance */}
            <button
              onClick={() => navigate("/report")}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-2xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File a Grievance</span>
            </button>

            {/* Authenticated State vs Portals Dropdown */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-300">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1.5">
                    {isOfficer && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[10px] font-semibold flex items-center justify-end gap-1">
                    {isOfficer ? (
                      <span className="text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                        Ward {user.ward} Official
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        Ward {user.ward} Resident
                      </span>
                    )}
                  </div>
                </div>

                {/* Role Switch Shortcut */}
                <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                  <button
                    onClick={() => {
                      if (isOfficer) {
                        switchRole("Citizen");
                        navigate("/");
                      } else {
                        navigate("/login/citizen");
                      }
                    }}
                    title="Switch to Citizen View"
                    className={`px-2 py-1 rounded transition-colors ${
                      isCitizen ? "bg-white text-orange-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    onClick={() => {
                      if (isCitizen) {
                        navigate("/login/officer");
                      } else {
                        navigate("/admin");
                      }
                    }}
                    title="Switch to Ward Officer View"
                    className={`px-2 py-1 rounded transition-colors ${
                      isOfficer ? "bg-slate-900 text-amber-400 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Officer
                  </button>
                </div>

                <button
                  onClick={logout}
                  title="Logout Session"
                  className="p-2 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-300">
                <Link
                  to="/login/citizen"
                  className="text-xs font-bold text-slate-800 hover:text-orange-600 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Citizen Login</span>
                </Link>

                <Link
                  to="/login/officer"
                  className="text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-500 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-950" />
                  <span>Officer Portal</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Official Government Navigation Bar */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-xs font-bold overflow-x-auto no-scrollbar">
            <Link
              to="/"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap ${
                isActive("/")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white border-transparent"
              }`}
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                isActive("/dashboard")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white border-transparent"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Grievance Index</span>
            </Link>

            <Link
              to="/map"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                isActive("/map")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white border-transparent"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Ward Map</span>
            </Link>

            <Link
              to="/top10"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                isActive("/top10")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white border-transparent"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Priority List</span>
            </Link>

            <Link
              to="/officers"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                isActive("/officers")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white border-transparent"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Ward Officers Directory</span>
            </Link>

            {/* Officer Control Room Tab: Highlights role permissions */}
            <Link
              to="/admin"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                isActive("/admin")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : isOfficer
                  ? "text-amber-400 hover:bg-slate-800 hover:text-amber-300 border-transparent"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent"
              }`}
            >
              {isOfficer ? (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>Officer Control Room</span>
              {isOfficer && (
                <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/40 text-[9px] font-extrabold rounded text-amber-300">
                  DISPATCH
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
