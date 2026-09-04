import React, { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { WardOverviewCard } from "../components/WardOverviewCard";
import { useNavigate } from "react-router-dom";
import { Flame, Trophy, Award } from "lucide-react";

export const Top10Page: React.FC = () => {
  const [topComplaints, setTopComplaints] = useState<Complaint[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopData();
  }, [selectedWard]);

  const loadTopData = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getTop10(selectedWard);
      setTopComplaints(res.data);
    } catch (err) {
      console.error("Failed to load top 10 data", err);
    } finally {
      setLoading(false);
    }
  };

  const activeWardData = selectedWard !== "all" 
    ? MUMBAI_WARDS_DATA.find((w) => w.id === Number(selectedWard)) 
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-xl border border-slate-800 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Priority Leaderboard</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Top Priority Incidents Across Mumbai Wards
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
          Weighted index combining AI structural hazard score and citizen upvote velocity. High ranking incidents trigger urgent priority notifications to ward officers.
        </p>

        {/* Ward Selector Filter */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Ward Jurisdiction:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-900 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-500"
          >
            <option value="all">Entire City of Mumbai (All 24 BMC Wards)</option>
            {MUMBAI_WARDS_DATA.map((w) => (
              <option key={w.id} value={w.id}>
                Ward {w.code} - {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Ward Officer & Weather Panel */}
      {activeWardData && (
        <WardOverviewCard
          ward={activeWardData}
          onReportIssueInWard={() => navigate(`/report?ward=${activeWardData.id}`)}
        />
      )}

      {/* Leaderboard List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium bg-white rounded-xl border border-slate-200">
            Calculating priority rankings...
          </div>
        ) : topComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium bg-white rounded-xl border border-slate-200">
            No active issues registered in this ward yet.
          </div>
        ) : (
          topComplaints.map((item, index) => {
            const rank = index + 1;
            let rankBadge = "bg-slate-100 text-slate-700 border-slate-200";
            let RankIcon = Award;

            if (rank === 1) {
              rankBadge = "bg-amber-500 text-slate-950 border-amber-600 font-black shadow-xs";
              RankIcon = Trophy;
            } else if (rank === 2) {
              rankBadge = "bg-slate-200 text-slate-900 border-slate-300 font-bold";
              RankIcon = Award;
            } else if (rank === 3) {
              rankBadge = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
              RankIcon = Flame;
            }

            return (
              <div key={item.id} className="relative flex flex-col md:flex-row items-stretch gap-4">
                {/* Leaderboard Rank Pill */}
                <div className="md:w-16 shrink-0 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center ${rankBadge}`}>
                    <RankIcon className="w-4 h-4 mb-0.5" />
                    <span className="text-[11px] font-bold">#{rank}</span>
                  </div>
                </div>

                {/* Main Card */}
                <div className="flex-1">
                  <ComplaintCard complaint={item} onUpdate={loadTopData} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
