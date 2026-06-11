"use client";

import React, { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, GraduationCap } from "lucide-react";

const ADMIN_PIN = "USAP2026";

export default function AdminLoginPage() {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem("usap_admin_auth");
    if (auth === "true") {
      window.location.href = "/admin/dashboard";
    }
  }, []);

  // Lockout countdown
  useEffect(() => {
    if (locked && lockTimer > 0) {
      const t = setTimeout(() => setLockTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    }
    if (locked && lockTimer === 0) {
      setLocked(false);
      setAttempts(0);
    }
  }, [locked, lockTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    setLoading(true);
    setError("");

    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 500));

    if (pin === ADMIN_PIN) {
      sessionStorage.setItem("usap_admin_auth", "true");
      window.location.href = "/admin/dashboard";
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setLockTimer(30);
        setError("Demasiados intentos fallidos. Acceso bloqueado por 30 segundos.");
      } else {
        setError(`PIN incorrecto. Te quedan ${3 - newAttempts} intento(s).`);
      }
      setPin("");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-y-auto lg:overflow-hidden bg-grid-pattern animate-fadeInSimple">
      
      {/* ── Header (Floating Navbar Capsule) ── */}
      <div className="w-full px-4 sm:px-6 pt-5 sticky top-0 z-50">
        <header className="w-full max-w-6xl mx-auto rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
          <a href="/" className="flex items-center group" id="nav-login-logo">
            <div className="h-9 w-9 bg-[#0056B3] rounded-lg flex items-center justify-center text-white mr-2.5 shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-tight text-[#0056B3] leading-none">USAP</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Universidad de San Pedro Sula</span>
            </div>
          </a>
          
          <a
            href="/"
            className="text-[10px] font-extrabold text-[#0056B3] hover:text-[#003E80] uppercase tracking-wider transition-colors"
          >
            ← Volver al inicio
          </a>
        </header>
      </div>

      {/* ── Main Container (Centered Login Card) ── */}
      <main className="w-full flex-1 flex items-center justify-center p-4 md:p-6 my-auto">
        <div className="w-full max-w-sm relative z-10 animate-fadeIn">
          <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
            
            {/* Logo and Headings */}
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-[#0056B3]">
                <Shield className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <h1 className="text-lg font-black text-[#1A1A1A] tracking-tight">
                  Acceso Administrativo
                </h1>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Panel de Control · SurveyMetrics Pro
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-pin"
                  className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block"
                >
                  PIN de Seguridad
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="admin-pin"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError("");
                    }}
                    disabled={locked || loading}
                    placeholder="••••••••"
                    autoComplete="off"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-[#E2E8F0] outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2 p-3.5 rounded-xl bg-red-50 text-[11px] font-semibold text-red-700 border border-red-100 animate-fadeIn">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-500" />
                  <span>
                    {locked ? `${error} (${lockTimer}s)` : error}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="btn-admin-login"
                type="submit"
                disabled={!pin || locked || loading}
                className="w-full py-3 bg-[#0056B3] hover:bg-[#003E80] disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : locked ? (
                  `Bloqueado (${lockTimer}s)`
                ) : (
                  "Ingresar"
                )}
              </button>
            </form>

            {/* Footer Note */}
            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
              Uso restringido al personal de calidad académica
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-[#E2E8F0] bg-white py-4 px-6 flex justify-center z-10">
        <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
          <div>
            <span>© {new Date().getFullYear()} Universidad de San Pedro Sula — Todos los derechos reservados.</span>
          </div>
          <div>
            <span className="text-[#0056B3]">SurveyMetrics Pro</span>
            <span className="mx-2 text-slate-200">|</span>
            <span>Powered by Arizona State University®</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
