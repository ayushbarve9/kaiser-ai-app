import React, { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { MumbaiMap } from "../components/MumbaiMap";
import { ComplaintCard } from "../components/ComplaintCard";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { MapPin, Search, Filter, Layers } from "lucide-react";

export const MapViewPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    loadMapData();
  }, [selectedWard, selectedCategory]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getAll({
        ward: selectedWard,
        category: selectedCategory,
        q: searchQuery,
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load map data", err);
    } finally {
      setLoading(false);
    }
  };

  const mapCenter: [number, number] = activeComplaint
    ? [activeComplaint.latitude, activeComplaint.longitude]
    : [19.076, 72.877];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Map Header & Quick Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0D7377]" />
            Mumbai Live Geospatial Infrastructure Incident Map
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Geospatial tracking of potholes, garbage dumps, water leaks, and streetlighting failures across all 24 wards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
          >
            <option value="all">All Mumbai Wards (24 Wards)</option>
            {MUMBAI_WARDS_DATA.map((w) => (
              <option key={w.id} value={w.id}>
                Ward {w.code} - {w.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
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
      </div>

      {/* Split Map View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* Left Side: Scrollable Incident Cards List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/80 p-4 flex flex-col h-full overflow-hidden shadow-sm">
          <div className="pb-3 mb-3 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Mapped Incidents ({complaints.length})</span>
            <span className="text-gray-400 font-normal">Click card to locate on map pin</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {complaints.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveComplaint(item)}
                className={`transition-all rounded-2xl ${
                  activeComplaint?.id === item.id ? "ring-2 ring-[#0D7377] scale-[0.99]" : ""
                }`}
              >
                <ComplaintCard complaint={item} onUpdate={loadMapData} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map Canvas */}
        <div className="lg:col-span-7 h-full">
          <MumbaiMap complaints={complaints} height="700px" center={mapCenter} zoom={activeComplaint ? 14 : 12} />
        </div>
      </div>
    </div>
  );
};
