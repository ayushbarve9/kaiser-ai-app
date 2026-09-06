import React, { useState, useEffect } from "react";
import { 
  BarChart3, CheckCircle2, Users, ArrowRight, Sparkles, 
  HelpCircle, ThumbsUp, RefreshCw, MessageSquare
} from "lucide-react";

interface PollOption {
  id: string;
  label: string;
  votes: number;
  category: string;
}

export const CivicPollWidget: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollData, setPollData] = useState<PollOption[]>([
    { id: "opt-1", label: "Pothole Cold-Mix Resurfacing on Arterial Roads", votes: 412, category: "Roads" },
    { id: "opt-2", label: "Stormwater Drain De-silting & Manhole Grates", votes: 348, category: "Drainage" },
    { id: "opt-3", label: "Illegal Waste Dumps & Daily Garbage Clearance", votes: 289, category: "Sanitation" },
    { id: "opt-4", label: "Tree Trimming around High-Tension Cables", votes: 194, category: "Safety" },
  ]);

  useEffect(() => {
    const savedVote = localStorage.getItem("mumbai_civic_poll_voted");
    if (savedVote) {
      setSelectedOption(savedVote);
      setHasVoted(true);
    }
  }, []);

  const totalVotes = pollData.reduce((acc, curr) => acc + curr.votes, 0);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setSelectedOption(id);
    setHasVoted(true);
    localStorage.setItem("mumbai_civic_poll_voted", id);

    setPollData((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt))
    );
  };

  const handleResetVote = () => {
    localStorage.removeItem("mumbai_civic_poll_voted");
    setHasVoted(false);
    setSelectedOption(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
              VOICE OF MUMBAI
            </span>
            <span className="text-slate-500 text-xs font-semibold">Weekly Citizen Consensus Poll</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1.5 tracking-tight">
            Which Monsoon Infrastructure Priority Requires Urgent Action?
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Results are summarized and submitted directly to the BMC Municipal Commissioner & Ward AMCs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
          <Users className="w-4 h-4 text-red-600" />
          <span>{totalVotes.toLocaleString()} Citizens Participated</span>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {pollData.map((opt) => {
          const percentage = Math.round((opt.votes / totalVotes) * 100) || 0;
          const isSelected = selectedOption === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={hasVoted}
              className={`w-full text-left relative overflow-hidden rounded-2xl p-4 border transition-all duration-200 group cursor-pointer ${
                isSelected
                  ? "border-red-600 bg-red-50/60 ring-2 ring-red-600/30"
                  : hasVoted
                  ? "border-slate-200 bg-white"
                  : "border-slate-200 bg-white hover:border-red-500 hover:bg-slate-50 shadow-xs"
              }`}
            >
              {/* Animated Background Progress Bar for Voted State */}
              {hasVoted && (
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out ${
                    isSelected ? "bg-red-200/50" : "bg-slate-100"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-slate-300 group-hover:border-red-500"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-red-600 transition-colors">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Category: {opt.category}
                    </span>
                  </div>
                </div>

                {hasVoted && (
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-black block font-mono ${isSelected ? "text-red-600" : "text-slate-900"}`}>
                      {percentage}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium font-mono">
                      {opt.votes} votes
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {hasVoted ? (
            <span className="text-red-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Thank you for casting your vote! Verified via browser session.
            </span>
          ) : (
            <span>Click any option above to cast your citizen priority vote.</span>
          )}
        </div>

        {hasVoted && (
          <button
            onClick={handleResetVote}
            className="text-[11px] text-slate-400 hover:text-slate-700 underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Change vote
          </button>
        )}
      </div>
    </div>
  );
};
