import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { useAuth } from "../context/AuthContext";
import { SeverityMeter } from "../components/SeverityMeter";
import { MumbaiMap } from "../components/MumbaiMap";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  ThumbsUp, MessageSquare, MapPin, Clock, Sparkles, ShieldCheck, 
  Send, ArrowLeft, CheckCircle2, AlertCircle, Building2, User, Phone, Mail, Lock
} from "lucide-react";

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Official officer update state
  const [officialStatus, setOfficialStatus] = useState<string>("In Progress");
  const [officialComment, setOfficialComment] = useState("");
  const [isUpdatingOfficial, setIsUpdatingOfficial] = useState(false);

  useEffect(() => {
    if (id) {
      loadComplaintDetails();
    }
  }, [id]);

  const loadComplaintDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await complaintService.getById(id!);
      setComplaint(res.data);
      setOfficialStatus(res.data.status);
    } catch (err) {
      console.error("Failed to load complaint details", err);
      setError("Complaint record not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!complaint) return;
    try {
      const res = await complaintService.upvote(complaint.id);
      setComplaint({
        ...complaint,
        upvote_count: res.data.upvote_count,
        upvotes: res.data.upvotes,
      });
    } catch (err) {
      console.error("Upvote error", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !complaint) return;

    setIsPostingComment(true);
    try {
      await complaintService.addComment(
        complaint.id,
        commentText.trim(),
        user?.name || "Resident Citizen",
        user?.role === "Officer" ? "BMC Ward Officer" : "Resident"
      );
      setCommentText("");
      loadComplaintDetails();
    } catch (err) {
      console.error("Add comment error", err);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleOfficialStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setIsUpdatingOfficial(true);
    try {
      const res = await complaintService.update(complaint.id, {
        status: officialStatus,
        officialComment: officialComment.trim() || undefined,
      });
      setComplaint(res.data);
      setOfficialComment("");
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdatingOfficial(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0D7377]/20 border-t-[#0D7377] rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-600">Loading BMC Complaint Dossier...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Complaint Not Found</h2>
        <p className="text-sm text-gray-600">The requested civic complaint dossier does not exist.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-[#0D7377] text-white font-bold text-xs rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const wardInfo = MUMBAI_WARDS_DATA.find((w) => w.id === complaint.ward) || MUMBAI_WARDS_DATA[0];
  const isUserOfficerInThisWard = user?.role === "Officer" && user?.ward === complaint.ward;
  const isUserOfficerInOtherWard = user?.role === "Officer" && user?.ward !== complaint.ward;

  const timelineSteps = ["Reported", "Assigned", "In Progress", "Resolved"];
  const currentStepIndex = timelineSteps.indexOf(complaint.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Complaints List
      </button>

      {/* Ward Jurisdiction Warning Banner for Officers */}
      {isUserOfficerInOtherWard && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Ward Jurisdiction Note:</strong> This issue belongs to <strong>Ward {complaint.ward} ({complaint.wardName})</strong>. As Ward {user?.ward} Executive, you have view-only access.
            </span>
          </div>
          <span className="px-2.5 py-1 bg-amber-200 font-bold rounded-lg shrink-0">
            View Only Mode
          </span>
        </div>
      )}

      {/* Main Header & Title */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {complaint.id}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-50 text-[#0D7377] border border-teal-200">
              {complaint.category}
            </span>
          </div>

          <span className="text-xs font-mono text-gray-500">
            Filed on {new Date(complaint.createdAt).toLocaleString("en-IN")}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
          {complaint.title}
        </h1>

        {/* Status Timeline Bar */}
        <div className="pt-2 pb-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Official Municipal Resolution Lifecycle
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? "bg-[#0D7377] text-white border-[#0D7377] font-extrabold shadow-sm"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold"
                      : "bg-gray-50 text-gray-400 border-gray-200 font-medium"
                  }`}
                >
                  <div className="text-xs">{step}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Diagnostic Summary Card */}
        {complaint.aiSummary && (
          <div className="bg-gradient-to-r from-teal-950 to-slate-900 text-white p-5 rounded-2xl border border-teal-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Triage Assessment</span>
            </div>

            <p className="text-sm text-slate-200 italic font-medium leading-relaxed">
              "{complaint.aiSummary}"
            </p>

            <div className="pt-2 border-t border-teal-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Assigned BMC Department</span>
                <strong className="text-white text-sm">{complaint.assignedDepartment}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Target SLA Window</span>
                <strong className="text-emerald-300 text-sm">{complaint.slaDays} Days Resolution SLA</strong>
              </div>
            </div>
          </div>
        )}

        {/* Severity Bar & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Incident Description</h3>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>

            <div className="pt-2">
              <SeverityMeter score={complaint.severity} size="lg" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <MapPin className="w-4 h-4 text-[#0D7377]" />
                <span>{complaint.wardName}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" />
                <span>Reporter: {complaint.reporterName}</span>
              </div>
            </div>

            {/* Ward Officer Direct Contact Box */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs space-y-1">
              <div className="flex items-center gap-3">
                <img
                  src={wardInfo.officer.avatar}
                  alt={wardInfo.officer.name}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">In Charge Ward Officer</span>
                  <span className="font-extrabold text-gray-900">{wardInfo.officer.name}</span>
                </div>
              </div>
              <a
                href={`tel:${wardInfo.officer.contact}`}
                className="px-3 py-1.5 bg-[#0D7377] text-white font-bold rounded-lg flex items-center gap-1 hover:bg-[#14919B]"
              >
                <Phone className="w-3.5 h-3.5" /> Call Officer
              </a>
            </div>

            {/* Upvote CTA */}
            <div className="pt-2">
              <button
                onClick={handleUpvote}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D7377] hover:bg-[#14919B] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Upvote Issue ({complaint.upvote_count})</span>
              </button>
            </div>
          </div>

          {/* Photo Preview & Map Pin */}
          <div className="space-y-4">
            {complaint.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 h-52 bg-gray-100 relative">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    const fallbacks: Record<string, string> = {
                      Pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
                      Garbage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
                      "Water Leakage": "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80",
                      Streetlight: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
                      Drainage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
                      Roadwork: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
                    };
                    target.src = fallbacks[complaint.category] || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <MumbaiMap
              center={[complaint.latitude, complaint.longitude]}
              zoom={14}
              height="200px"
              complaints={[complaint]}
            />
          </div>
        </div>
      </div>

      {/* Official Officer Controls Panel (Active ONLY for Officers in this Ward) */}
      {isUserOfficerInThisWard && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Ward {complaint.ward} Executive Action Console</span>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-md uppercase">
              Official Jurisdiction Access
            </span>
          </div>

          <form onSubmit={handleOfficialStatusUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-900 uppercase mb-1">Update Resolution Status</label>
                <select
                  value={officialStatus}
                  onChange={(e) => setOfficialStatus(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Reported">Reported</option>
                  <option value="Assigned">Assigned to Field Crew</option>
                  <option value="In Progress">In Progress (Work Order Dispatched)</option>
                  <option value="Resolved">Resolved (Site Inspected & Fixed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 uppercase mb-1">Official Response / Dispatch Note</label>
                <input
                  type="text"
                  value={officialComment}
                  onChange={(e) => setOfficialComment(e.target.value)}
                  placeholder="e.g. Dispatched cold-mix asphalt patching team under Work Order #882."
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingOfficial}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
            >
              Update Official Dossier & Save
            </button>
          </form>
        </div>
      )}

      {/* Community Comments Thread */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-md space-y-6">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#0D7377]" />
          Citizen Feedback & Work Log ({complaint.comments.length})
        </h3>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Post a location update or citizen inquiry..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
          />
          <button
            type="submit"
            disabled={isPostingComment || !commentText.trim()}
            className="px-4 py-2.5 bg-[#0D7377] hover:bg-[#14919B] text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Post
          </button>
        </form>

        {/* Comment Thread */}
        <div className="space-y-3 pt-2">
          {complaint.comments.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border text-xs space-y-1 ${
                c.userRole.includes("Officer") || c.userRole.includes("Official")
                  ? "bg-amber-50/80 border-amber-200/80"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className={c.userRole.includes("Officer") ? "text-amber-900" : "text-gray-900"}>
                  {c.userName} ({c.userRole})
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {new Date(c.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
