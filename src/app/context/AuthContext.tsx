import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "citizen" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users database
const MOCK_USERS: User[] = [
  { id: "1", name: "Alex Johnson", email: "citizen@smartcity.com", role: "citizen", avatar: "AJ" },
  { id: "2", name: "Sarah Admin", email: "admin@smartcity.com", role: "admin", avatar: "SA" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("smartcity_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.role === role);
    if (found || password.length >= 6) {
      const loginUser = found || {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        role,
        avatar: email.substring(0, 2).toUpperCase(),
      };
      setUser(loginUser);
      localStorage.setItem("smartcity_user", JSON.stringify(loginUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, _password: string, role: UserRole): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 800));
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: name.substring(0, 2).toUpperCase(),
    };
    setUser(newUser);
    localStorage.setItem("smartcity_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartcity_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
