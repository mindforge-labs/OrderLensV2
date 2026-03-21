"use client";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to the main app
    const checkAuth = async () => {
      try {
        const { getCurrentUser } = await import('aws-amplify/auth');
        await getCurrentUser();
        router.push("/pos-tray-verification");
      } catch (error) {
        // User not authenticated, stay on login page
      }
    };

    checkAuth();
  }, [router]);

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

        {/* Right Column: Cognito Authenticator */}
        <div className="w-full md:w-[440px]">
          <Authenticator
            signUpAttributes={['email']}
            formFields={{
              signIn: {
                username: {
                  placeholder: 'Enter your email',
                  label: 'Email'
                },
                password: {
                  placeholder: 'Enter your password'
                }
              },
              signUp: {
                email: {
                  placeholder: 'Enter your email',
                  label: 'Email',
                  required: true
                },
                password: {
                  placeholder: 'Create a password'
                },
                confirm_password: {
                  placeholder: 'Confirm your password'
                }
              }
            }}
            components={{
              Header: () => (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-headline font-semibold tracking-tight text-on-surface">
                    Welcome Back
                  </h2>
                  <p className="text-sm mt-2 text-on-surface-variant">
                    Enter your credentials to access the AI core.
                  </p>
                </div>
              )
            }}
          />
        </div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-1 velocity-gradient opacity-80"></div>
      <div className="absolute bottom-12 -left-12 w-64 h-64 rounded-full border border-white/10 -z-10 blur-3xl opacity-30" style={{ background: "rgba(255,255,255,0.05)" }}></div>
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary/10 rounded-full -z-10 blur-3xl opacity-20"></div>
    </div>
  );
}
