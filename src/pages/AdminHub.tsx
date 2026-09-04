import React, { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { 
  ShieldAlert, RefreshCw, ShieldCheck, Activity, Clock 
} from "lucide-react";

export const AdminHub: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "critical" | "reported" | "resolved">("critical");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getAll({ sortBy: "severity" });
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = complaints.filter((c) => {
    if (filterTab === "critical") return c.severity >= 75 && c.status !== "Resolved";
    if (filterTab === "reported") return c.status === "Reported" || c.status === "Assigned";
    if (filterTab === "resolved") return c.status === "Resolved";
    return true;
  });

  const criticalCount = complaints.filter((c) => c.severity >= 80 && c.status !== "Resolved").length;
  const reportedCount = complaints.filter((c) => c.status === "Reported").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-xl border border-slate-800 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>BMC Official Officer Dispatch Hub</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Brihanmumbai Municipal Corporation Dispatch Console
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
          Monitor incoming citizen reports across all 24 wards, review automated Gemini AI severity triage, and dispatch work orders to ward maintenance crews.
        </p>

        {/* Quick Officer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 border-t-2 border-t-rose-500">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Critical Hazard Work Orders</div>
            <div className="text-xl font-bold text-rose-400 mt-0.5">{criticalCount}</div>
            <div className="text-[10px] text-slate-400">Urgent dispatch required</div>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 border-t-2 border-t-amber-500">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Pending Crew Dispatch</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{reportedCount}</div>
            <div className="text-[10px] text-slate-400">Unassigned reports</div>
          </div>

          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 border-t-2 border-t-emerald-500 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Target Resolution SLA</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">24-48 hrs</div>
            <div className="text-[10px] text-slate-400">Active compliance window</div>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setFilterTab("critical")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filterTab === "critical"
                ? "bg-rose-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Critical Risk ({criticalCount})
          </button>

          <button
            onClick={() => setFilterTab("reported")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filterTab === "reported"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending Crew Dispatch ({reportedCount})
          </button>

          <button
            onClick={() => setFilterTab("resolved")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filterTab === "resolved"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Resolved Work Orders
          </button>

          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filterTab === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Incidents ({complaints.length})
          </button>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Stream
        </button>
      </div>

      {/* Incident List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((item) => (
          <ComplaintCard key={item.id} complaint={item} onUpdate={loadAdminData} />
        ))}
      </div>
    </div>
  );
};
