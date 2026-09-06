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
    { name: "Resolved", value: stats?.resolved || 0, color: "#2b59d1" },
    { name: "In Progress", value: stats?.inProgress || 0, color: "#cfdaf5" },
    { name: "Assigned", value: stats?.assigned || 0, color: "#cecac8" },
    { name: "Reported", value: stats?.reported || 0, color: "#242424" },
  ];

  const activeWardData = wardFilter !== "all"
    ? MUMBAI_WARDS_DATA.find((w) => w.id === Number(wardFilter))
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#f6f3f1] font-mono text-[#242424]">
      {/* Role Banner Indicator — Monad Off-Black Surface */}
      <div className="bg-[#242424] text-white p-8 rounded-[40px] border border-[#242424] border-l-4 border-l-[#2b59d1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2b59d1] flex items-center justify-center text-white font-bold shrink-0">
            {user?.role === "Officer" ? <ShieldCheck className="w-6 h-6 text-white" /> : <UserCheck className="w-6 h-6 text-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-[#cfdaf5] tracking-wider">
                {user?.role === "Officer" ? "Ward Officer Command View" : "Citizen Redressal Dashboard"}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono uppercase border border-white/10">
                {user?.role === "Officer" ? `Assigned Ward ${user.ward}` : "Citywide View"}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-normal text-white mt-1">
              Mumbai Civic Triage & Resolution Index
            </h1>
          </div>
        </div>

        {user?.role === "Officer" && (
          <div className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-full text-white/90 text-xs font-mono max-w-sm">
            <strong className="text-[#cfdaf5]">Officer Access:</strong> Filtered to your ward jurisdiction. Direct dispatch controls enabled for Ward {user.ward}.
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

      {/* Analytics Metrics Cards — Monad 40px Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[40px] border border-[#cecac8] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-medium text-[#797776] uppercase tracking-wider">Total Reports</div>
            <div className="text-3xl font-serif font-normal text-[#242424] mt-1">{stats?.total || 0}</div>
            <div className="text-[10px] font-mono text-[#797776] uppercase mt-0.5">Across selected area</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f6f3f1] text-[#2b59d1] flex items-center justify-center shrink-0 border border-[#cecac8]">
            <Activity className="w-5 h-5 text-[#2b59d1]" />
          </div>
        </div>

        <div className="bg-[#cfdaf5] p-6 rounded-[40px] border border-[#cecac8] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-medium text-[#2b59d1] uppercase tracking-wider">Resolved</div>
            <div className="text-3xl font-serif font-normal text-[#2b59d1] mt-1">{stats?.resolved || 0}</div>
            <div className="text-[10px] font-mono text-[#242424] uppercase mt-0.5">Closed work orders</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2b59d1] text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[40px] border border-[#cecac8] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-medium text-[#797776] uppercase tracking-wider">In Progress</div>
            <div className="text-3xl font-serif font-normal text-[#242424] mt-1">{stats?.inProgress || 0}</div>
            <div className="text-[10px] font-mono text-[#797776] uppercase mt-0.5">Field crew deployed</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f6f3f1] text-[#242424] flex items-center justify-center shrink-0 border border-[#cecac8]">
            <Clock className="w-5 h-5 text-[#2b59d1]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[40px] border border-[#cecac8] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-medium text-[#797776] uppercase tracking-wider">Avg Hazard Score</div>
            <div className="text-3xl font-serif font-normal text-[#242424] mt-1">{stats?.avgSeverity || 75}/100</div>
            <div className="text-[10px] font-mono text-[#797776] uppercase mt-0.5">AI risk density</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f6f3f1] text-[#2b59d1] flex items-center justify-center shrink-0 border border-[#cecac8]">
            <AlertTriangle className="w-5 h-5 text-[#2b59d1]" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-[#cecac8] space-y-4">
          <h3 className="font-serif font-normal text-[#242424] text-xl">Issue Density by Municipal Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryData || []}>
                <XAxis dataKey="name" stroke="#797776" fontSize={11} tickLine={false} fontFamily="JetBrains Mono" />
                <YAxis stroke="#797776" fontSize={11} tickLine={false} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px", fontFamily: "JetBrains Mono" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {stats?.categoryData?.map((entry, index) => {
                    const colors: Record<string, string> = {
                      Pothole: "#2b59d1",
                      Garbage: "#242424",
                      "Water Leakage": "#cfdaf5",
                      Drainage: "#2b59d1",
                      Streetlight: "#797776",
                      Roadwork: "#cecac8",
                      Other: "#4e4d4d",
                    };
                    return <Cell key={`bar-${index}`} fill={colors[entry.name] || "#2b59d1"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-[#cecac8] space-y-4 flex flex-col justify-between">
          <h3 className="font-serif font-normal text-[#242424] text-xl">Resolution Ratio</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff", fontFamily: "JetBrains Mono" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-[#cecac8]">
            {statusPieData.map((st) => (
              <div key={st.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="text-[#4e4d4d] font-mono text-[11px] uppercase">{st.name}: {st.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Control Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-[40px] border border-[#cecac8] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#797776]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, street, landmark, or description..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#f6f3f1] border border-[#cecac8] rounded-full text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
            />
          </form>

          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#242424] bg-[#f6f3f1] hover:bg-[#cfdaf5] border border-[#cecac8] rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2b59d1]" />
            Reset Filters
          </button>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <label className="block text-[#797776] font-medium mb-1 uppercase tracking-wider text-[10px]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#f6f3f1] border border-[#cecac8] rounded-full px-4 py-2 text-[#242424] font-medium focus:outline-none focus:border-[#2b59d1]"
            >
              <option value="all">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[#797776] font-medium mb-1 uppercase tracking-wider text-[10px]">
              Mumbai Ward Jurisdiction
            </label>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full bg-[#f6f3f1] border border-[#cecac8] rounded-full px-4 py-2 text-[#242424] font-medium focus:outline-none focus:border-[#2b59d1]"
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
            <label className="block text-[#797776] font-medium mb-1 uppercase tracking-wider text-[10px]">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#f6f3f1] border border-[#cecac8] rounded-full px-4 py-2 text-[#242424] font-medium focus:outline-none focus:border-[#2b59d1]"
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
            <label className="block text-[#797776] font-medium mb-1 uppercase tracking-wider text-[10px]">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#f6f3f1] border border-[#cecac8] rounded-full px-4 py-2 text-[#242424] font-medium focus:outline-none focus:border-[#2b59d1]"
            >
              <option value="newest">Newest First</option>
              <option value="severity">Highest AI Hazard Score</option>
              <option value="upvotes">Most Citizen Endorsements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#797776] uppercase">
          <span>Showing {complaints.length} matched incidents</span>
          <span>Synced with BMC Database</span>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-[40px] p-14 text-center border border-[#cecac8] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f6f3f1] flex items-center justify-center mx-auto text-[#2b59d1]">
              <Search className="w-6 h-6 text-[#2b59d1]" />
            </div>
            <h3 className="font-serif font-normal text-[#242424] text-xl">No matching civic issues found</h3>
            <p className="text-xs font-mono text-[#797776] max-w-sm mx-auto">
              Try adjusting your search filters or clear your selection to view all ward reports.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-6 py-2.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
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
