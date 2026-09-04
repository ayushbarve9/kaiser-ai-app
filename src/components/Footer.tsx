import React from "react";
import { Link } from "react-router-dom";
import { Building2, PhoneCall, CheckCircle2, MapPin, ChevronRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] border-t border-black/[0.08] text-[#86868b] text-xs mt-16">
      {/* Official Indian Flag Tricolor Header Hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Portal Brand & Government Identification */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white border border-black/[0.06] shadow-2xs flex items-center justify-center text-[#0071e3] shrink-0">
                <Building2 className="w-5 h-5 text-[#0071e3]" />
              </div>
              <div>
                <span className="text-[#1d1d1f] font-semibold text-sm tracking-tight block">
                  CivicConnect
                </span>
                <span className="text-[10px] text-[#0071e3] font-medium tracking-tight block -mt-0.5">
                  BMC Public Grievance Portal
                </span>
              </div>
            </div>
            <p className="text-[#86868b] leading-relaxed text-[11px]">
              Brihanmumbai Municipal Corporation (BMC) official grievance redressal and ward management platform.
            </p>
            
            <div className="flex items-center gap-1.5 text-[11px] text-[#34c759] font-medium pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>All 24 Ward Control Rooms Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] text-[12px] tracking-tight border-b border-black/[0.06] pb-1.5">
              Municipal Services
            </h4>
            <ul className="space-y-2 text-[#515154] text-[12px] font-normal">
              <li><Link to="/report" className="hover:text-[#0071e3] transition-colors">File a Grievance</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#0071e3] transition-colors">Grievance Index & Search</Link></li>
              <li><Link to="/map" className="hover:text-[#0071e3] transition-colors">Greater Mumbai Ward Map</Link></li>
              <li><Link to="/top10" className="hover:text-[#0071e3] transition-colors">Top Priority Triage Queue</Link></li>
              <li><Link to="/officers" className="hover:text-[#0071e3] transition-colors">Ward Officers Directory</Link></li>
              <li><Link to="/admin" className="hover:text-[#0071e3] transition-colors">Officer Dispatch Hub</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] text-[12px] tracking-tight border-b border-black/[0.06] pb-1.5">
              Emergency Helplines
            </h4>
            <ul className="space-y-2 text-[#515154] text-[11px]">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#86868b] block">BMC Control Room (Toll Free):</span>
                  <strong className="text-[#1d1d1f] font-mono text-xs">1916</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#86868b] block">Disaster Management:</span>
                  <strong className="text-[#1d1d1f] font-mono text-xs">022-22694725</strong>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#86868b] block">Traffic Police:</span>
                  <strong className="text-[#1d1d1f] font-mono text-xs">022-24937755</strong>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Headquarters */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-[#1d1d1f] text-[12px] tracking-tight border-b border-black/[0.06] pb-1.5">
              Headquarters
            </h4>
            <div className="text-[#86868b] text-[11px] leading-relaxed space-y-2.5">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                <span>MCGM Head Office, Mahapalika Marg, Opp. CSMT Station, Fort, Mumbai 400001</span>
              </p>

              <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[#1d1d1f] font-medium shadow-2xs">
                  Swachh Bharat
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.06] text-[#0071e3] font-medium shadow-2xs">
                  Digital India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 border-t border-black/[0.06] text-[11px] text-[#86868b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Brihanmumbai Municipal Corporation (BMC). Govt. of Maharashtra.</p>
          <div className="flex flex-wrap items-center gap-3 text-[#86868b] font-normal">
            <span>WCAG 2.1 AAA</span>
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
