"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useI18n, Language } from "@/lib/i18n";
import { DEMO_USERS } from "@/lib/demo-data";
import {
  Shield,
  Activity,
  Calculator,
  Compass,
  PieChart,
  Target,
  Zap,
  Bot,
  FileText,
  Sliders,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, logout, switchDemoUser, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth();
  const { language, setLanguage, t } = useI18n();

  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: t.dashboard, icon: Activity },
    { href: "/affordability", label: t.affordability, icon: Compass },
    { href: "/calculator", label: t.calculator, icon: Calculator },
    { href: "/budget", label: t.budget, icon: PieChart },
    { href: "/goals", label: t.goals, icon: Target },
    { href: "/stress-test", label: t.stressTest, icon: Zap },
    { href: "/assistant", label: t.aiAssistant, icon: Bot, highlight: true },
    { href: "/documents", label: t.documents, icon: FileText },
    { href: "/admin", label: t.admin, icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">Fin<span className="text-emerald-400">AI</span></span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Financial Health Intelligence</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : link.highlight
                    ? "text-cyan-400 hover:bg-cyan-500/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : link.highlight ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Demo Persona Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setIsDemoDropdownOpen(!isDemoDropdownOpen);
                setIsLangDropdownOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="truncate max-w-[120px]">{profile?.name || "Demo Persona"}</span>
              <ChevronDown className="h-3 w-3 text-emerald-400/80" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Demo Persona
                </div>
                <div className="space-y-1">
                  {DEMO_USERS.map((d) => (
                    <button
                      key={d.email}
                      onClick={() => {
                        switchDemoUser(d.email);
                        setIsDemoDropdownOpen(false);
                      }}
                      className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                        user?.email === d.email
                          ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                          : "text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">{d.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">₹{d.monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{d.tagline}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsDemoDropdownOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5 transition-all"
              title="Select Language"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold uppercase">{language}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-xl z-50">
                {[
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "mr", label: "मराठी" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as Language);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-all ${
                      language === l.code ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsDemoDropdownOpen(false);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 p-1.5 text-xs text-slate-200 hover:bg-white/5 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                  <div className="border-b border-white/5 px-2.5 py-2">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <p className="mt-1 text-[10px] text-emerald-400 font-mono">
                      Income: ₹{profile?.monthlyIncome.toLocaleString()} | Score: {profile?.creditScore}
                    </p>
                  </div>
                  <div className="mt-1 space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/5"
                    >
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Edit Financial Profile</span>
                    </button>
                    <Link
                      href="/methodology"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/5"
                    >
                      <Compass className="h-3.5 w-3.5 text-slate-400" />
                      <span>Scoring Methodology</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-400" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/25 hover:bg-emerald-400 transition-all"
            >
              {t.login}
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur-2xl">
          <nav className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
