import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PlusCircle, Map, LayoutDashboard, ShieldAlert, Building2, Award,
  ShieldCheck, PhoneCall, LogOut, FileText, Lock, Search, Menu, X,
  TrendingUp, Users, ChevronRight,
} from "lucide-react";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenTracker?: () => void;
}

const publicNav = [
  { label: "Home", short: "Home", to: "/", icon: Building2 },
  { label: "Grievances", short: "Issues", to: "/dashboard", icon: LayoutDashboard },
  { label: "Ward map", short: "Map", to: "/map", icon: Map },
  { label: "Ward officers", short: "Officers", to: "/officers", icon: Users },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onOpenTracker }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isOfficer, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  const go = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <div className="utility-brand"><span className="utility-dot" /> BMC Civic Intelligence Network <span className="utility-divider">/</span> 24 wards online</div>
          <div className="utility-links">
            {onOpenTracker && <button onClick={onOpenTracker} className="utility-action"><FileText size={13} /> Track a ticket</button>}
            <a href="tel:1916" className="utility-action"><PhoneCall size={13} /> Helpline <strong>1916</strong></a>
          </div>
        </div>
      </div>

      <div className="shell main-nav">
        <Link to="/" className="wordmark" onClick={() => setMobileOpen(false)}>
          <span className="wordmark-mark"><Building2 size={19} /></span>
          <span><strong>Civic<span>Connect</span></strong><small>Mumbai / public works desk</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {publicNav.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} className={`nav-link ${isActive(to) ? "is-active" : ""}`}>
              <Icon size={15} /><span>{label}</span>
            </Link>
          ))}
          {isOfficer && <Link to="/admin" className={`nav-link nav-link-officer ${isActive("/admin") ? "is-active" : ""}`}><ShieldAlert size={15} /><span>Control room</span></Link>}
        </nav>

        <div className="nav-actions">
          {onOpenCommandPalette && <button onClick={onOpenCommandPalette} className="search-trigger" title="Search wards and shortcuts"><Search size={16} /><span>Search</span><kbd>⌘K</kbd></button>}
          <button onClick={() => go("/report")} className="file-button"><PlusCircle size={16} /><span>File issue</span><ChevronRight size={15} /></button>
          {user ? (
            <div className="user-chip">
              <div className="user-avatar">{isOfficer ? <ShieldCheck size={15} /> : user.name?.charAt(0)?.toUpperCase()}</div>
              <div className="user-copy"><strong>{user.name}</strong><small>{isOfficer ? `Officer · Ward ${user.ward}` : "Citizen account"}</small></div>
              <button onClick={logout} className="icon-button" title="Sign out"><LogOut size={15} /></button>
            </div>
          ) : <Link to="/login" className="signin-link">Sign in</Link>}
          <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>

      {mobileOpen && <div className="mobile-nav-panel">
        <div className="shell mobile-nav-grid">
          {publicNav.map(({ label, short, to, icon: Icon }) => <button key={to} onClick={() => go(to)} className={`mobile-nav-item ${isActive(to) ? "is-active" : ""}`}><Icon size={18} /><span>{label}<small>{short}</small></span><ChevronRight size={16} /></button>)}
          {isOfficer && <button onClick={() => go("/admin")} className="mobile-nav-item"><ShieldAlert size={18} /><span>Control room<small>Officer console</small></span><ChevronRight size={16} /></button>}
          <button onClick={() => go("/report")} className="mobile-nav-item mobile-nav-primary"><PlusCircle size={18} /><span>File a grievance<small>Report a civic issue</small></span><ChevronRight size={16} /></button>
        </div>
      </div>}
    </header>
  );
};
