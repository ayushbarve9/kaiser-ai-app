import React, { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { useAuth } from "../context/AuthContext";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  ShieldAlert, RefreshCw, ShieldCheck, Activity, Clock, 
  BadgeCheck, Building2, MapPin, Phone, UserCheck, AlertTriangle
} from "lucide-react";

export const AdminHub: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "critical" | "reported" | "resolved" | "myward">("myward");

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

  const currentWardId = user?.ward || 9;
  const currentWardData = MUMBAI_WARDS_DATA.find((w) => w.id === currentWardId) || MUMBAI_WARDS_DATA[8];

  const filteredList = complaints.filter((c) => {
    if (filterTab === "myward") return c.ward === currentWardId;
    if (filterTab === "critical") return c.severity >= 75 && c.status !== "Resolved";
    if (filterTab === "reported") return c.status === "Reported" || c.status === "Assigned";
    if (filterTab === "resolved") return c.status === "Resolved";
    return true;
  });

  const criticalCount = complaints.filter((c) => c.severity >= 80 && c.status !== "Resolved").length;
  const reportedCount = complaints.filter((c) => c.status === "Reported").length;
  const myWardCount = complaints.filter((c) => c.ward === currentWardId).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Logged in Officer Credential Strip */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">{user?.name || "Ward Executive Officer"}</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" /> Verified Official
              </span>
            </div>
            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-amber-400 font-bold">Ward {currentWardData.code} ({currentWardData.name})</span>
              <span>•</span>
              <span className="font-mono text-slate-400">Badge ID: {user?.serviceId || `BMC-OFF-${currentWardId < 10 ? '0' + currentWardId : currentWardId}01`}</span>
              <span>•</span>
              <span className="text-slate-400">{user?.department || "Ward Executive Operations"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-right text-xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Jurisdiction Issues</div>
            <div className="text-sm font-extrabold text-amber-400">{myWardCount} Active Cases</div>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
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
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setFilterTab("myward")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filterTab === "myward"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Ward {currentWardData.code} ({myWardCount})
          </button>

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
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Stream
        </button>
      </div>

      {/* Incident List */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Incidents in this Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All complaints under this status are currently handled or no pending emergency work orders found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <ComplaintCard key={item.id} complaint={item} onUpdate={loadAdminData} />
          ))}
        </div>
      )}
    </div>
  );
};
