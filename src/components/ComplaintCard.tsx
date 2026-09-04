import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Complaint } from "../types";
import { SeverityMeter } from "./SeverityMeter";
import { ThumbsUp, MessageSquare, MapPin, Clock, ArrowRight, ShieldCheck, Cpu, Tag } from "lucide-react";
import { complaintService } from "../services/api";

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate?: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onUpdate }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(complaint.upvote_count);
  const [isUpvoted, setIsUpvoted] = useState(complaint.upvotes.includes("usr-citizen-current"));
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoting) return;

    setIsUpvoting(true);
    const nextState = !isUpvoted;
    setIsUpvoted(nextState);
    setUpvotes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (nextState) {
        await complaintService.upvote(complaint.id);
      } else {
        await complaintService.removeUpvote(complaint.id);
      }
      onUpdate?.();
    } catch {
      // Rollback on network issue
      setIsUpvoted(!nextState);
      setUpvotes((prev) => (nextState ? prev - 1 : prev + 1));
    } finally {
      setIsUpvoting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold";
      case "In Progress":
        return "bg-amber-100 text-amber-950 border-amber-300 font-bold";
      case "Assigned":
        return "bg-blue-100 text-blue-950 border-blue-300 font-bold";
      default:
        return "bg-slate-100 text-slate-900 border-slate-300 font-bold";
    }
  };

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const refCode = `#BMC-2026-${complaint.id.slice(0, 5).toUpperCase()}`;

  return (
    <div
      onClick={() => navigate(`/complaint/${complaint.id}`)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-blue-700"
    >
      <div className="p-5 space-y-3">
        {/* Ticket Ref Header */}
        <div className="flex items-center justify-between gap-2 text-[11px] pb-1 border-b border-slate-100">
          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {refCode}
          </span>
          <span className="text-slate-600 font-mono font-medium flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {formattedDate}
          </span>
        </div>

        {/* Top Header Metadata */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {complaint.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${getStatusStyle(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-[10px] font-bold border border-blue-200 shrink-0">
            SLA: 24h
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors line-clamp-2">
          {complaint.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        {/* AI Triage Briefing */}
        {complaint.aiSummary && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-800 flex items-start gap-2">
            <Cpu className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
            <p className="line-clamp-1 font-medium">
              <strong className="text-slate-900 font-bold">Assessment:</strong> {complaint.aiSummary}
            </p>
          </div>
        )}

        {/* Severity Bar */}
        <div>
          <SeverityMeter score={complaint.severity} size="sm" />
        </div>

        {/* Location & Ward Jurisdiction */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
          <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
          <span className="font-bold text-slate-900 truncate">{complaint.wardName}</span>
          <span className="text-slate-300">•</span>
          <span className="truncate text-slate-600">{complaint.locationAddress}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            aria-label={`Support issue, ${upvotes} upvotes`}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-bold transition-all active:scale-95 ${
              isUpvoted
                ? "bg-blue-900 text-white border-blue-900 shadow-2xs"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? "fill-current" : ""}`} />
            <span>{upvotes} Citizen Endorsements</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{complaint.comment_count}</span>
          </div>
        </div>

        <span className="text-blue-900 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Inspect Ticket <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

