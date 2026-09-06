import React, { useState } from "react";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { WardOverviewCard } from "../components/WardOverviewCard";
import { useNavigate } from "react-router-dom";
import { 
  Award, Search, Building2, Phone, Star, ArrowUpRight
} from "lucide-react";

export const OfficersPage: React.FC = () => {
  const [selectedWardId, setSelectedWardId] = useState<number>(9); // Default H-West
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Sort officers by rank
  const sortedWards = [...MUMBAI_WARDS_DATA].sort((a, b) => a.officer.rank - b.officer.rank);

  const filteredWards = sortedWards.filter((w) => {
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.code.toLowerCase().includes(q) ||
      w.officer.name.toLowerCase().includes(q) ||
      w.areaDescription.toLowerCase().includes(q)
    );
  });

  const activeWard = MUMBAI_WARDS_DATA.find((w) => w.id === selectedWardId) || MUMBAI_WARDS_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" /> Municipal Officer Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Mumbai Ward Officers Directory & Performance Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Real-time performance metrics for Assistant Municipal Commissioners (AMCs) across all 24 BMC wards, resolution throughput, and official control room helplines.
        </p>
      </div>

      {/* Selected Ward Inspection Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
            <Building2 className="w-4 h-4 text-red-600" /> Ward Officer Profile
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Select any ward below to view executive details
          </span>
        </div>

        <WardOverviewCard
          ward={activeWard}
          onReportIssueInWard={() => navigate(`/report?ward=${activeWard.id}`)}
        />
      </div>

      {/* Leaderboard & All Wards Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-950 flex items-center gap-2 uppercase tracking-tight">
              <Award className="w-4 h-4 text-red-600" /> All 24 Ward Officers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by problem-solving throughput, SLA compliance %, and citizen satisfaction rating
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ward or officer name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Grid of All 24 Ward Officers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWards.map((w) => {
            const isSelected = w.id === selectedWardId;
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWardId(w.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "bg-red-50/50 border-red-600 shadow-sm ring-1 ring-red-600"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.officer.avatar}
                      alt={w.officer.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                        Ward {w.code}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">{w.officer.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">{w.name}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Rank</span>
                    <span className="text-xs font-bold text-red-600 flex items-center justify-end gap-0.5">
                      <Award className="w-3.5 h-3.5" /> #{w.officer.rank}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Solved</span>
                    <span className="font-bold text-slate-900">{w.officer.problemsSolved}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">SLA Rate</span>
                    <span className="font-bold text-red-600">{w.officer.resolutionRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Rating</span>
                    <span className="font-bold text-slate-900 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {w.officer.citizenSatisfaction}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                  <span className="text-[11px] font-semibold flex items-center gap-1 text-slate-500">
                    <Phone className="w-3 h-3 text-red-600" /> {w.officer.contact}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWardId(w.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
