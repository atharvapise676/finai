import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { ProfileEditModal } from "@/components/ProfileEditModal";

export const metadata: Metadata = {
  title: "FinAI — AI-Powered Financial Health & Loan Intelligence Platform",
  description:
    "AI-powered financial insights, loan affordability analysis, EMI calculations, budgeting, and scenario planning — all in one place.",
  keywords: [
    "fintech",
    "financial health",
    "loan affordability",
    "EMI calculator",
    "credit score analyzer",
    "stress testing",
    "budget planner",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen fintech-bg text-slate-100 antialiased flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">
        <I18nProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 py-6">
                {children}
              </main>
              <Footer />
            </div>
            <AuthModal />
            <ProfileEditModal />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
