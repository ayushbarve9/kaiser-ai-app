import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthGateModal } from "./components/AuthGateModal";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { MapViewPage } from "./pages/MapViewPage";
import { Top10Page } from "./pages/Top10Page";
import { OfficersPage } from "./pages/OfficersPage";
import { ReportPage } from "./pages/ReportPage";
import { ComplaintDetailsPage } from "./pages/ComplaintDetailsPage";
import { AdminHub } from "./pages/AdminHub";
import { Login } from "./pages/Login";
import { CitizenLogin } from "./pages/CitizenLogin";
import { OfficerLogin } from "./pages/OfficerLogin";
import { Register } from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthGateModal />
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
              
              {/* Protected Ward Officer Control Room */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="Officer">
                    <AdminHub />
                  </ProtectedRoute>
                } 
              />

              {/* Dedicated Authentication Portals */}
              <Route path="/login" element={<Login />} />
              <Route path="/login/citizen" element={<CitizenLogin />} />
              <Route path="/login/officer" element={<OfficerLogin />} />
              <Route path="/register" element={<Register />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
