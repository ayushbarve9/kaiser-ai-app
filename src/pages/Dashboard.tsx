import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint, Stats } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { WardOverviewCard } from "../components/WardOverviewCard";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  Activity, CheckCircle2, Clock, AlertTriangle, Search, RotateCcw, ShieldCheck, UserCheck 
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const defaultWard = user?.role === "Officer" ? String(user.ward || 9) : searchParams.get("ward") || "all";
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [wardFilter, setWardFilter] = useState(defaultWard);
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    loadDashboardData();
  }, [statusFilter, wardFilter, categoryFilter, sortBy]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, statsRes] = await Promise.all([
        complaintService.getAll({
          status: statusFilter,
          ward: wardFilter,
          category: categoryFilter,
          sortBy,
          q: searchQuery,
        }),
        complaintService.getStats(),
      ]);
      setComplaints(complaintsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDashboardData();
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setWardFilter("all");
    setCategoryFilter("all");
    setSortBy("newest");
    setSearchQuery("");
    setSearchParams({});
  };

  const statusPieData = [
    { name: "Resolved", value: stats?.resolved || 0, color: "#10B981" },
    { name: "In Progress", value: stats?.inProgress || 0, color: "#0284C7" },
    { name: "Assigned", value: stats?.assigned || 0, color: "#F59E0B" },
    { name: "Reported", value: stats?.reported || 0, color: "#64748B" },
  ];

  const activeWardData = wardFilter !== "all"
    ? MUMBAI_WARDS_DATA.find((w) => w.id === Number(wardFilter))
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Role Banner Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 border-t-4 border-t-orange-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold shrink-0 border border-slate-700 shadow-xs">
            {user?.role === "Officer" ? <ShieldCheck className="w-6 h-6 text-orange-400" /> : <UserCheck className="w-6 h-6 text-amber-300" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
                {user?.role === "Officer" ? "Ward Officer Command View" : "Citizen Portal Dashboard"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-extrabold uppercase border border-slate-700">
                {user?.role === "Officer" ? `Assigned Ward ${user.ward}` : "Citywide View"}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-0.5 tracking-tight">
              Mumbai Civic Triage & Resolution Index
            </h1>
          </div>
        </div>

        {user?.role === "Officer" && (
          <div className="px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-200 text-xs font-medium max-w-sm shadow-2xs">
            <strong className="text-orange-400">Officer Access:</strong> Filtered to your ward jurisdiction. Direct dispatch controls enabled for Ward {user.ward}.
          </div>
        )}
      </div>

      {/* Selected Ward Overview Card */}
      {activeWardData && (
        <WardOverviewCard
          ward={activeWardData}
          onReportIssueInWard={() => navigate(`/report?ward=${activeWardData.id}`)}
        />
      )}

      {/* Analytics Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-t-2 border-t-slate-700">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Reports</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats?.total || 0}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across selected area</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-t-2 border-t-emerald-600">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resolved</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{stats?.resolved || 0}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Closed work orders</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-t-2 border-t-sky-600">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-bold text-sky-600 mt-1">{stats?.inProgress || 0}</div>
            <div className="text-[11px] text-sky-700 mt-0.5">Crew on site</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-t-2 border-t-rose-600">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Hazard Score</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{stats?.avgSeverity || 75}/100</div>
            <div className="text-[11px] text-rose-700 mt-0.5">AI risk density</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Issue Density by Municipal Category</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryData || []}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Resolution Ratio</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", border: "none", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {statusPieData.map((st) => (
              <div key={st.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="text-slate-600 font-medium">{st.name}: {st.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Control Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, street, landmark, or description..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </form>

          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">
              Mumbai Ward Jurisdiction
            </label>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Mumbai Wards (24 Wards)</option>
              {MUMBAI_WARDS_DATA.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Categories</option>
              <option value="Pothole">Potholes</option>
              <option value="Garbage">Garbage</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Drainage">Drainage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Roadwork">Roadwork</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wider text-[10px]">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="newest">Newest First</option>
              <option value="severity">Highest AI Hazard Score</option>
              <option value="upvotes">Most Citizen Upvotes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {complaints.length} matched incidents</span>
          <span>Synced with BMC Triage Database</span>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No matching civic issues found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search filters or clear your selection to view all ward reports.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((item) => (
              <ComplaintCard key={item.id} complaint={item} onUpdate={loadDashboardData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
