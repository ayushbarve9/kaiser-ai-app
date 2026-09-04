import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { MapViewPage } from "./pages/MapViewPage";
import { Top10Page } from "./pages/Top10Page";
import { OfficersPage } from "./pages/OfficersPage";
import { ReportPage } from "./pages/ReportPage";
import { ComplaintDetailsPage } from "./pages/ComplaintDetailsPage";
import { AdminHub } from "./pages/AdminHub";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#F4F7F6] text-[#0B1C24]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/officers" element={<OfficersPage />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/top10" element={<Top10Page />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
              <Route path="/admin" element={<AdminHub />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
