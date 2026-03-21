"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex items-center justify-center relative overflow-hidden">
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
          <Card className="p-10 shadow-[0px_32px_64px_-12px_rgba(0,0,0,0.04)] border-outline-variant/10">
            <CardHeader className="mb-10 text-center md:text-left p-0">
              <CardTitle className="text-2xl font-headline font-semibold tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm mt-2">
                Enter your credentials to access the AI core.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label
                    className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 px-1"
                    htmlFor="email"
                  >
                    Email or Username
                  </Label>
                  <Input
                    className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 placeholder:text-outline/50 focus:border-primary"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="administrator@clinical.ai"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label
                      className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70"
                      htmlFor="password"
                    >
                      Password
                    </Label>
                    <Button
                      variant="link"
                      className="text-xs font-semibold text-primary hover:text-primary-container p-0 h-auto"
                      type="button"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <div className="relative flex items-center">
                    <Input
                      className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 placeholder:text-outline/50 focus:border-primary pr-10"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 text-outline-variant hover:text-on-surface-variant p-1 h-auto"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </Button>
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
                  <Button
                    className="w-full py-4 px-6 velocity-gradient text-on-primary font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    type="submit"
                  >
                    Sign In
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Button>

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

                  <Button
                    variant="outline"
                    className="w-full py-4 px-6 bg-surface-container-high text-primary font-semibold rounded-full hover:bg-surface-container-highest transition-all flex items-center justify-center"
                    type="button"
                  >
                    Request System Access
                  </Button>
                </div>
              </form>
            </CardContent>

            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex justify-between items-center text-[11px] font-medium text-on-surface-variant/50">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                TERMINAL 04 ONLINE
              </span>
              <span>v2.4.0-STABLE</span>
            </div>
          </Card>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-1 velocity-gradient opacity-80"></div>
      <div className="absolute bottom-12 -left-12 w-64 h-64 rounded-full border border-white/10 -z-10 blur-3xl opacity-30" style={{ background: "rgba(255,255,255,0.05)" }}></div>
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary/10 rounded-full -z-10 blur-3xl opacity-20"></div>
    </div>
  );
}
