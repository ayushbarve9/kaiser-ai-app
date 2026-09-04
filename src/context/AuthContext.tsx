import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<User>;
  register: (data: { name: string; email: string; role: UserRole; ward: number; department?: string; phone?: string }) => Promise<User>;
  logout: () => void;
  switchRole: (role: "Citizen" | "Officer") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("civic_token");
    if (token) {
      verifyToken();
    } else {
      // Default demo citizen session for instant app experience
      const defaultUser: User = {
        id: "usr-citizen-1",
        name: "Aarav Sharma",
        email: "aarav@example.com",
        role: "Citizen",
        ward: 9,
      };
      setUser(defaultUser);
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const res = await api.get<{ user: User }>("/auth/verify");
      setUser(res.data.user);
    } catch {
      localStorage.removeItem("civic_token");
      setUser({
        id: "usr-citizen-1",
        name: "Aarav Sharma",
        email: "aarav@example.com",
        role: "Citizen",
        ward: 9,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password?: string, role?: UserRole): Promise<User> => {
    const res = await api.post<{ token: string; user: User }>("/auth/login", { email, password, role });
    const { token, user: loggedUser } = res.data;
    localStorage.setItem("civic_token", token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: { name: string; email: string; role: UserRole; ward: number; department?: string; phone?: string }): Promise<User> => {
    const res = await api.post<{ token: string; user: User }>("/auth/register", data);
    const { token, user: registeredUser } = res.data;
    localStorage.setItem("civic_token", token);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("civic_token");
    setUser({
      id: "usr-guest",
      name: "Guest Citizen",
      email: "guest@civic.com",
      role: "Citizen",
      ward: 9,
    });
  };

  const switchRole = (role: "Citizen" | "Officer") => {
    if (role === "Officer") {
      login("officer.hwest@civic.com", "password", "Officer");
    } else {
      login("aarav@example.com", "password", "Citizen");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
