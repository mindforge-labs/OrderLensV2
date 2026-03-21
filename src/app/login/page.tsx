"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/pos-tray-verification");
  };

  return (
    <body className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-surface-container-low"></div>
        <div className="absolute top-0 right-0 w-[60%] h-full bg-surface-container-lowest skew-x-12 origin-top-right"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#c2c6d6 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-16">
        {/* Left Column: Branding */}
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 velocity-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-2xl">clinical_notes</span>
              </div>
              <span className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
                System Access
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-on-surface leading-tight">
              OrderLens
            </h1>
            <p className="text-xl font-medium text-on-surface-variant/80 tracking-tight">
              Retail Verification Suite
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary mt-1">verified_user</span>
              <div>
                <h3 className="font-semibold text-on-surface">Precision Verification</h3>
                <p className="text-sm text-on-surface-variant">
                  High-fidelity AI audits for enterprise retail environments with 99.9% accuracy.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary mt-1">security</span>
              <div>
                <h3 className="font-semibold text-on-surface">Secure Terminal Access</h3>
                <p className="text-sm text-on-surface-variant">
                  Encrypted biometric and multi-factor authentication for terminal 04 core systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="w-full md:w-[440px]">
          <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0px_32px_64px_-12px_rgba(0,0,0,0.04)] border border-outline-variant/10">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-headline font-semibold text-on-surface tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-on-surface-variant mt-2">
                Enter your credentials to access the AI core.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 block px-1"
                  htmlFor="email"
                >
                  Email or Username
                </label>
                <div className="group relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-1 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:border-primary transition-all font-body text-sm outline-none"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="administrator@clinical.ai"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label
                    className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 block"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <button
                    className="text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                    type="button"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="group relative flex items-center">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-1 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:border-primary transition-all font-body text-sm outline-none"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    className="absolute right-1 text-outline-variant hover:text-on-surface-variant transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/5">
                <span
                  className="material-symbols-outlined text-primary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant/60">
                  Encrypted Session: Active
                </span>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  className="w-full py-4 px-6 velocity-gradient text-on-primary font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                  type="submit"
                >
                  Sign In
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface-container-lowest px-4 text-outline/60 font-medium">
                      New to Curator?
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-4 px-6 bg-surface-container-high text-primary font-semibold rounded-full hover:bg-surface-container-highest transition-all flex items-center justify-center"
                  type="button"
                >
                  Request System Access
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-between items-center text-[11px] font-medium text-on-surface-variant/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                TERMINAL 04 ONLINE
              </span>
              <span>v2.4.0-STABLE</span>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-1 velocity-gradient opacity-80"></div>
      <div className="absolute bottom-12 -left-12 w-64 h-64 rounded-full border border-white/10 -z-10 blur-3xl opacity-30" style={{ background: "rgba(255,255,255,0.05)" }}></div>
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary/10 rounded-full -z-10 blur-3xl opacity-20"></div>
    </body>
  );
}
