import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  PlusCircle, Map, LayoutDashboard, ShieldAlert, Building2, Award, 
  ShieldCheck, UserCheck, Flame, PhoneCall, Globe, LogOut, FileText,
  Lock, ArrowRight, UserPlus, LogIn, ChevronDown, ChevronRight, Search, Command
} from "lucide-react";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onOpenTracker }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isOfficer, isCitizen, isAuthenticated, logout, switchRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? "bg-[#f6f3f1]/95 backdrop-blur-md border-b border-[#cecac8]" 
        : "bg-[#f6f3f1]/90 backdrop-blur-md border-b border-[#cecac8]"
    }`}>
      {/* Top Ink Ground Announcement & Government Identity Bar */}
      <div className="bg-[#000000] text-[#f6f3f1] px-4 py-2 text-[11px] font-mono border-b border-[#242424]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Monad Monospace Editorial Identification */}
          <div className="flex items-center gap-3">
            <span className="bg-[#2b59d1] text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              GOVERNMENT OF MAHARASHTRA
            </span>
            <span className="text-[#cecac8]/40">|</span>
            <span className="text-[#cfdaf5] uppercase tracking-wider">Brihanmumbai Municipal Corporation</span>
            <span className="hidden md:inline-block text-[#cecac8]/40">|</span>
            <span className="hidden md:inline-block text-[#cecac8] uppercase tracking-wider">
              Civic Action Journal
            </span>
          </div>

          {/* Utility Controls */}
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
            {onOpenTracker && (
              <button
                onClick={onOpenTracker}
                className="text-[#cfdaf5] hover:text-white transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <FileText className="w-3 h-3 text-[#cfdaf5]" />
                <span>Track Ticket</span>
              </button>
            )}
            <span className="text-[#cecac8]/40">|</span>
            <a href="tel:1916" className="flex items-center gap-1.5 text-[#cfdaf5] hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-[#cfdaf5]" />
              <span>Helpline: <strong className="text-white font-mono font-bold">1916</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Branding Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Official Monad Emblem & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#2b59d1] flex items-center justify-center text-white shrink-0 group-hover:bg-[#2247ab] transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-normal text-[#242424] text-lg sm:text-xl tracking-tight">
                  CivicConnect
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#cfdaf5] border border-[#cecac8] text-[10px] font-mono font-medium text-[#242424] uppercase tracking-wider">
                  MONAD V2
                </span>
              </div>
              <p className="text-[11px] text-[#797776] font-mono uppercase tracking-wider">
                Public Grievance & 24-Ward Journal
              </p>
            </div>
          </Link>

          {/* Monospace Editorial Nav Links + Pill CTAs */}
          <div className="flex items-center gap-3">
            {/* Streamlined Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#242424]">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  isActive("/")
                    ? "bg-[#242424] text-white font-medium"
                    : "hover:bg-[#cecac8]/30 text-[#4e4d4d]"
                }`}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  isActive("/dashboard")
                    ? "bg-[#242424] text-white font-medium"
                    : "hover:bg-[#cecac8]/30 text-[#4e4d4d]"
                }`}
              >
                Grievances
              </Link>
              <Link
                to="/map"
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  isActive("/map")
                    ? "bg-[#242424] text-white font-medium"
                    : "hover:bg-[#cecac8]/30 text-[#4e4d4d]"
                }`}
              >
                Ward Map
              </Link>
              <Link
                to="/officers"
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  isActive("/officers")
                    ? "bg-[#242424] text-white font-medium"
                    : "hover:bg-[#cecac8]/30 text-[#4e4d4d]"
                }`}
              >
                Officers
              </Link>
              <Link
                to="/admin"
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive("/admin")
                    ? "bg-[#242424] text-white font-medium"
                    : isOfficer
                    ? "bg-[#cfdaf5] text-[#242424] font-medium border border-[#cecac8]"
                    : "hover:bg-[#cecac8]/30 text-[#4e4d4d]"
                }`}
              >
                {isOfficer ? <ShieldAlert className="w-3.5 h-3.5 text-[#2b59d1]" /> : <Lock className="w-3.5 h-3.5 text-[#797776]" />}
                <span>Control Room</span>
              </Link>
            </nav>

            {/* Quick Command Palette Button */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ffffff] hover:bg-[#cecac8]/30 text-[#242424] rounded-full text-[11px] font-mono uppercase tracking-wider border border-[#cecac8] transition-colors cursor-pointer"
                title="Search Wards (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-[#2b59d1]" />
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 bg-[#f6f3f1] rounded border border-[#cecac8] text-[9px] font-mono text-[#797776]">
                  Ctrl K
                </kbd>
              </button>
            )}

            {/* Primary Action Button — Monad Lake Blue Pill with ▸ */}
            <button
              onClick={() => navigate("/report")}
              className="inline-flex items-center gap-2 bg-[#2b59d1] hover:bg-[#2247ab] text-white text-[11px] font-mono uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shrink-0 active:scale-[0.98] cursor-pointer pop-btn"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>File Grievance</span>
              <span className="text-white/80">▸</span>
            </button>

            {/* User Session State */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#cecac8]">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-mono font-medium text-[#242424] flex items-center justify-end gap-1">
                    {isOfficer && <ShieldCheck className="w-3.5 h-3.5 text-[#2b59d1]" />}
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[10px] text-[#797776] font-mono uppercase">
                    Ward {user.ward} {isOfficer ? "Officer" : "Citizen"}
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout Session"
                  className="p-2 text-[#797776] hover:text-[#242424] hover:bg-[#cecac8]/40 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#cecac8]">
                <Link
                  to="/login/citizen"
                  className="text-[11px] font-mono uppercase tracking-wider text-[#242424] hover:bg-[#cecac8]/40 bg-[#cfdaf5] border border-[#cecac8] px-3.5 py-1.5 rounded-full transition-colors"
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
