"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserFinancialProfile } from "@/types";
import { DEMO_USERS } from "@/lib/demo-data";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: UserFinancialProfile;
}

interface AuthContextType {
  user: UserSession | null;
  profile: UserFinancialProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string; monthlyIncome?: number }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserFinancialProfile>) => Promise<boolean>;
  switchDemoUser: (email: string) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
}

const DEFAULT_PROFILE: UserFinancialProfile = {
  name: "Aarav Sharma",
  email: "demo@finai.com",
  monthlyIncome: 85000,
  monthlyExpenses: 32000,
  existingEmi: 8000,
  savings: 180000,
  emergencyFund: 150000,
  creditScore: 780,
  employmentType: "salaried",
  age: 31,
  dependents: 1,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  switchDemoUser: async () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  isProfileModalOpen: false,
  setIsProfileModalOpen: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<UserFinancialProfile | null>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          if (data.user.profile) {
            setProfile(data.user.profile);
          }
        } else {
          // Default to local demo persona if unauthenticated
          setUser({
            id: "demo-user-aarav",
            name: "Aarav Sharma",
            email: "demo@finai.com",
            role: "user",
          });
          setProfile(DEFAULT_PROFILE);
        }
      }
    } catch {
      setUser({
        id: "demo-user-aarav",
        name: "Aarav Sharma",
        email: "demo@finai.com",
        role: "user",
      });
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email: string, password = "demo123") => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        if (data.user.profile) {
          setProfile(data.user.profile);
        }
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (formData: { name: string; email: string; password: string; monthlyIncome?: number }) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        if (data.user.profile) {
          setProfile(data.user.profile);
        }
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setProfile(DEFAULT_PROFILE);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateProfile = async (updated: Partial<UserFinancialProfile>) => {
    try {
      const merged = { ...profile, ...updated };
      setProfile(merged as UserFinancialProfile);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        setIsProfileModalOpen(false);
        return true;
      }
      return true; // Optimistic update
    } catch (err) {
      console.error("Update profile error:", err);
      return false;
    }
  };

  const switchDemoUser = async (email: string) => {
    await login(email, "demo123");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        switchDemoUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
