import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Building2, UserCheck, Shield, ArrowRight } from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setLoading(true);
    try {
      await login(demoEmail);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-md w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0D7377] to-[#14919B] rounded-2xl flex items-center justify-center mx-auto text-white font-bold shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sign In to KAISER AI</h2>
          <p className="text-xs text-gray-600">Access Mumbai Municipal Issue Triage & Resolution Platform</p>
        </div>

        {/* Quick Demo Credentials Buttons */}
        <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200/80 space-y-2.5">
          <div className="text-[11px] font-bold text-[#0D7377] uppercase tracking-wider text-center">
            ⚡ Quick 1-Click Demo Login
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("aarav@example.com")}
              className="px-3 py-2 bg-white hover:bg-teal-100/60 border border-teal-200 text-[#0D7377] font-bold text-xs rounded-xl transition-all shadow-2xs text-left"
            >
              <UserCheck className="w-3.5 h-3.5 mb-1 text-[#0D7377]" />
              <div>Resident Citizen</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo("admin@civic.com")}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-2xs text-left"
            >
              <Shield className="w-3.5 h-3.5 mb-1" />
              <div>BMC Official</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D7377] hover:bg-[#14919B] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#0D7377] font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
