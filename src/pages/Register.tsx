import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { User, Mail, Lock, Building2, ShieldCheck, ArrowRight } from "lucide-react";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Citizen" | "Officer">("Citizen");
  const [ward, setWard] = useState<number>(9);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, ward, role });
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
          <h2 className="text-2xl font-black text-gray-900">Create KAISER Account</h2>
          <p className="text-xs text-gray-600">Register as a Resident Citizen or Assigned Ward Officer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector pills */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setRole("Citizen")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === "Citizen" ? "bg-white text-[#0D7377] shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Resident Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole("Officer")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === "Officer" ? "bg-amber-500 text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Ward Officer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "Officer" ? "AMC Vinayak Vispute" : "Aarav Sharma"}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
              />
            </div>
          </div>

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
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {role === "Officer" ? "Assigned Officer Ward Jurisdiction" : "Primary Resident Ward"}
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
            >
              {MUMBAI_WARDS_DATA.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D7377] hover:bg-[#14919B] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-[#0D7377] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
