import React from "react";
import { Link } from "react-router-dom";
import { Building2, PhoneCall, CheckCircle2, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t-4 border-orange-500 text-slate-300 text-xs">
      {/* Official Indian Flag Tricolor Header Hairline */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Portal Brand & Government Identification */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded bg-slate-900 border border-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-white font-extrabold text-base tracking-tight block uppercase">
                  BRIHANMUMBAI MUNICIPAL CORP
                </span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block -mt-1">
                  Public Grievance Portal
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Brihanmumbai Municipal Corporation (BMC) official civic grievance redressal, ward officer dispatch, and public SLA tracking platform under Govt. of Maharashtra.
            </p>
            
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold pt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>All 24 Ward Control Rooms Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-1.5">
              Municipal Services
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[12px]">
              <li><Link to="/report" className="hover:text-amber-400 transition-colors">File a Grievance</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">Grievance Index & Search</Link></li>
              <li><Link to="/map" className="hover:text-amber-400 transition-colors">Greater Mumbai Ward Map</Link></li>
              <li><Link to="/top10" className="hover:text-amber-400 transition-colors">Top Priority Triage Queue</Link></li>
              <li><Link to="/officers" className="hover:text-amber-400 transition-colors">Ward Officers Directory</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors">Officer Dispatch Hub</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-1.5">
              Emergency Helplines
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-300 block font-semibold">BMC Control Room (Toll Free):</span>
                  <strong className="text-white font-mono text-xs">1916</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-300 block font-semibold">Disaster Management Cell:</span>
                  <strong className="text-white font-mono text-xs">022-22694725</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-300 block font-semibold">Traffic Police Helpline:</span>
                  <strong className="text-white font-mono text-xs">022-24937755</strong>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Headquarters Address */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-1.5">
              Headquarters
            </h4>
            <div className="text-slate-400 text-[11px] leading-relaxed space-y-2">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>MCGM Head Office, Mahapalika Marg, Opp. CSMT Station, Fort, Mumbai 400001</span>
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-bold">
                  ★ Swachh Bharat Abhiyan
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                  ★ Digital India Initiative
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-slate-900 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Brihanmumbai Municipal Corporation (BMC). Govt. of Maharashtra.</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 font-medium">
            <span>WCAG 2.1 AAA Compliant</span>
            <span>•</span>
            <span>Right to Service Act 2015</span>
            <span>•</span>
            <span>RTI Disclosures</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
