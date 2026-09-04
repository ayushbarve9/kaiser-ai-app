import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  PlusCircle, Map, LayoutDashboard, ShieldAlert, Building2, Award, 
  ShieldCheck, UserCheck, Flame, PhoneCall, Globe, LogOut, FileText
} from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();

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
              MyGov Civic Redressal System
            </span>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center gap-4 text-[11px]">
            <a href="tel:1916" className="flex items-center gap-1 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Toll Free Helpline: <strong className="text-amber-300 font-mono">1916</strong></span>
            </a>


          </div>
        </div>
      </div>

      {/* Main Header Branding Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Official Emblem & Portal Title */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border-2 border-amber-500 flex flex-col items-center justify-center text-white shrink-0 shadow-xs">
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

          {/* Role Switcher & Action Controls */}
          <div className="flex items-center gap-3">
            {/* Citizen vs Officer View Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs font-semibold">
              <button
                onClick={() => switchRole("Citizen")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  user?.role !== "Officer"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Citizen View
              </button>
              <button
                onClick={() => switchRole("Officer")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  user?.role === "Officer"
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Ward Officer
              </button>
            </div>

            {/* Primary Action */}
            <button
              onClick={() => navigate("/report")}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-2xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File a Grievance</span>
            </button>

            {/* Auth State */}
            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-300">
                <div className="text-right hidden xl:block">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {user.role === "Officer" ? `Ward ${user.ward} Officer` : `Ward ${user.ward} Citizen`}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold text-slate-800 hover:text-slate-950 px-3 py-2 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
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

            <Link
              to="/admin"
              className={`px-4 py-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                isActive("/admin")
                  ? "bg-slate-800 text-amber-400 border-amber-400"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white border-transparent"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Officer Control Room</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
