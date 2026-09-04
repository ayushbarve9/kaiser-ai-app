import React from "react";
import { Link } from "react-router-dom";
import { Building2, PhoneCall, CheckCircle2, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t-4 border-[#B45309] text-slate-700 text-xs mt-12">
      {/* Official Indian Flag Tricolor Header Hairline */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Portal Brand & Government Identification */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-500/40 shadow-xs flex items-center justify-center text-[#B45309] font-bold shrink-0">
                <Building2 className="w-5 h-5 text-[#B45309]" />
              </div>
              <div>
                <span className="text-slate-900 font-black text-sm tracking-tight block uppercase">
                  BRIHANMUMBAI MUNICIPAL CORP
                </span>
                <span className="text-[10px] text-[#B45309] font-bold tracking-wider uppercase block -mt-0.5">
                  Public Grievance Portal
                </span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Brihanmumbai Municipal Corporation (BMC) official civic grievance redressal, ward officer dispatch, and public SLA tracking platform under Govt. of Maharashtra.
            </p>
            
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-bold pt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>All 24 Ward Control Rooms Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1.5">
              Municipal Services
            </h4>
            <ul className="space-y-2 text-slate-600 text-[12px] font-medium">
              <li><Link to="/report" className="hover:text-[#B45309] transition-colors">File a Grievance</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#B45309] transition-colors">Grievance Index & Search</Link></li>
              <li><Link to="/map" className="hover:text-[#B45309] transition-colors">Greater Mumbai Ward Map</Link></li>
              <li><Link to="/top10" className="hover:text-[#B45309] transition-colors">Top Priority Triage Queue</Link></li>
              <li><Link to="/officers" className="hover:text-[#B45309] transition-colors">Ward Officers Directory</Link></li>
              <li><Link to="/admin" className="hover:text-[#B45309] transition-colors">Officer Dispatch Hub</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1.5">
              Emergency Helplines
            </h4>
            <ul className="space-y-2.5 text-slate-600 text-[11px]">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-600 block font-medium">BMC Control Room (Toll Free):</span>
                  <strong className="text-slate-900 font-mono text-xs">1916</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-600 block font-medium">Disaster Management Cell:</span>
                  <strong className="text-slate-900 font-mono text-xs">022-22694725</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-600 block font-medium">Traffic Police Helpline:</span>
                  <strong className="text-slate-900 font-mono text-xs">022-24937755</strong>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Headquarters Address */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1.5">
              Headquarters
            </h4>
            <div className="text-slate-600 text-[11px] leading-relaxed space-y-2.5">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                <span>MCGM Head Office, Mahapalika Marg, Opp. CSMT Station, Fort, Mumbai 400001</span>
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-[#B45309] font-bold shadow-xs">
                  ★ Swachh Bharat Abhiyan
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-700 font-bold shadow-xs">
                  ★ Digital India Initiative
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-slate-300 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Brihanmumbai Municipal Corporation (BMC). Govt. of Maharashtra.</p>
          <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium">
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
