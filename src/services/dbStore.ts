import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: "Citizen" | "Officer" | "Admin";
  ward: number;
  department?: string;
  phone?: string;
  serviceId?: string;
  createdAt: string;
}

// Supabase Client Initialization (if environment variables are supplied)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase Connected Successfully:", supabaseUrl);
  } catch (e) {
    console.warn("⚠️ Supabase Client Initialization Warning:", e);
  }
} else {
  console.log("ℹ️ Running in Local Persistent Database Mode (Set SUPABASE_URL & SUPABASE_ANON_KEY to enable Supabase Cloud sync)");
}

export function isSupabaseConnected(): boolean {
  return supabase !== null;
}

// Password hashing utilities using SHA-256 with salt
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return calculatedHash === hash;
}

// Persistent File Store Helper
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Pre-seeded verified demo accounts with secure password hashes
const initialSalt = "kaiser_secure_salt_2026";
const citizenPass = hashPassword("citizen123", initialSalt);
const officerPass = hashPassword("officer123", initialSalt);

const defaultUsers: StoredUser[] = [
  {
    id: "usr-admin-1",
    name: "AMC Vinayak Vispute",
    email: "officer.hwest@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 9,
    department: "H-West Ward Executive Office",
    phone: "+91 98200 11009",
    serviceId: "BMC-OFF-0901",
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
  },
  {
    id: "usr-admin-2",
    name: "AMC Kiran Dighavkar",
    email: "officer.gnorth@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 11,
    department: "G-North Ward Executive Office",
    phone: "+91 98200 11011",
    serviceId: "BMC-OFF-1102",
    createdAt: new Date(Date.now() - 3600000 * 200).toISOString(),
  },
  {
    id: "usr-admin-3",
    name: "AMC Shivdas Gurav",
    email: "officer.award@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 1,
    department: "A-Ward Executive Office",
    phone: "+91 98200 11001",
    serviceId: "BMC-OFF-0103",
    createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
  },
  {
    id: "usr-citizen-1",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    passwordHash: citizenPass.hash,
    salt: initialSalt,
    role: "Citizen",
    ward: 9,
    phone: "+91 98765 43210",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
  {
    id: "usr-citizen-2",
    name: "Priya Mehta",
    email: "priya@example.com",
    passwordHash: citizenPass.hash,
    salt: initialSalt,
    role: "Citizen",
    ward: 11,
    phone: "+91 98765 43211",
    createdAt: new Date(Date.now() - 3600000 * 90).toISOString(),
  },
];

export function loadUsers(): StoredUser[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load users from file, initializing defaults", e);
  }

  // Save default users
  saveUsers(defaultUsers);
  return defaultUsers;
}

export function saveUsers(usersList: StoredUser[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write users file", e);
  }
}

// Database Service Interface
export const dbService = {
  getUsers: (): StoredUser[] => {
    return loadUsers();
  },

  findUserByEmail: (email: string): StoredUser | undefined => {
    const users = loadUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  findUserById: (id: string): StoredUser | undefined => {
    const users = loadUsers();
    return users.find((u) => u.id === id);
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: "Citizen" | "Officer" | "Admin";
    ward: number;
    phone?: string;
    department?: string;
    serviceId?: string;
  }): Promise<StoredUser> => {
    const users = loadUsers();
    
    // Check duplicate
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists. Please sign in instead.");
    }

    const { hash, salt } = hashPassword(userData.password);
    const isOfficer = userData.role === "Officer";

    const newUser: StoredUser = {
      id: `usr-${isOfficer ? "officer" : "citizen"}-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash: hash,
      salt: salt,
      role: userData.role,
      ward: Number(userData.ward) || 9,
      phone: userData.phone?.trim() || "",
      department: userData.department?.trim() || (isOfficer ? `Ward ${userData.ward || 9} Executive Operations` : ""),
      serviceId: userData.serviceId?.trim() || (isOfficer ? `BMC-OFF-${userData.ward < 10 ? '0' + userData.ward : userData.ward}99` : ""),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Sync to Supabase if connected
    if (supabase) {
      try {
        await supabase.from("users").upsert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          ward: newUser.ward,
          phone: newUser.phone,
          department: newUser.department,
          service_id: newUser.serviceId,
          created_at: newUser.createdAt,
        });
      } catch (sbErr) {
        console.warn("Supabase user sync error (offline fallback preserved):", sbErr);
      }
    }

    return newUser;
  },

  verifyUserCredentials: (
    email: string, 
    password: string, 
    requiredRole?: "Citizen" | "Officer"
  ): { user: StoredUser | null; error?: string } => {
    const user = dbService.findUserByEmail(email);
    if (!user) {
      return { user: null, error: "Account not found with this email. Please create an account via Sign Up." };
    }

    if (requiredRole && user.role !== requiredRole) {
      return { 
        user: null, 
        error: `This account is registered as a ${user.role}. Please log in through the ${user.role} Portal.` 
      };
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return { user: null, error: "Incorrect password. Please verify your credentials and try again." };
    }

    return { user };
  }
};
