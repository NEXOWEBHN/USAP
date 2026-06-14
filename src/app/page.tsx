import React from "react";
import { ClipboardList, ArrowRight, BookOpen, Briefcase, Award, GraduationCap, CheckCircle2, ShieldCheck, BarChart4 } from "lucide-react";

/* ── Metadata ──────────────────────────────────────────────── */
export const metadata = {
  title: "USAP | Encuesta de Seguimiento de Egresados",
  description:
    "Plataforma oficial de seguimiento de egresados de la Universidad de San Pedro Sula. Comparte tu experiencia y ayúdanos a mejorar la calidad educativa.",
};

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-y-auto lg:overflow-hidden bg-grid-pattern">
      
      {/* ── Navbar (Floating Matte White Capsule) ── */}
      <div className="w-full px-4 sm:px-6 pt-5 sticky top-0 z-50">
        <nav className="w-full max-w-6xl mx-auto rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
          <a href="/" className="flex items-center group" id="nav-home-logo">
            <img src="/logo-usap.png" alt="USAP Logo" className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]" />
          </a>
        </nav>
      </div>

      {/* ── Main Content Split Panel (No Scroll Container) ── */}
      <main className="w-full max-w-6xl mx-auto px-6 py-6 lg:py-0 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 my-auto">
        
        {/* Left Side: Branding & Trust */}
        <div className="w-full lg:w-1/2 space-y-6 flex flex-col items-start text-left animate-fadeIn">
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] tracking-tight leading-[1.12]">
            Seguimiento de <br />
            <span className="text-[#0056B3]">
              Egresados USAP
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
            Tu trayectoria profesional y opiniones son la base de nuestra mejora continua. Comparte tu experiencia en solo <strong className="text-slate-700 font-bold">3 minutos</strong> y ayúdanos a impulsar la calidad académica.
          </p>
        </div>

        {/* Right Side: Step-by-Step Card Flow */}
        <div className="w-full lg:w-5/12 flex justify-center animate-fadeIn-d1">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6.5 shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col justify-between space-y-6">
            
            <div className="space-y-1.5">
              <h2 className="text-sm font-extrabold text-[#1A1A1A] uppercase tracking-wider">
                Estructura del Formulario
              </h2>
              <p className="text-slate-450 text-[11px] leading-tight">
                Diseño ágil y rápido de completar en 4 fases secuenciales.
              </p>
            </div>

            {/* Micro Steps timeline */}
            <div className="space-y-3">
              {[
                { num: "01", title: "Identificación", desc: "Datos de contacto, DNI y correo" },
                { num: "02", title: "Trayecto Académico", desc: "Programa cursado y año de egreso" },
                { num: "03", title: "Situación Laboral", desc: "Posgrado, empleo y afinidad actual" },
                { num: "04", title: "Revisión y Envío", desc: "Confirmación final de respuestas" }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-[10px] font-black text-[#0056B3] bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 mt-0.5">{item.num}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-[11.5px] font-extrabold text-slate-800 leading-none">{item.title}</span>
                    <span className="text-[9.5px] text-slate-400 font-bold mt-1 leading-none">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Survey Action */}
            <div className="space-y-3.5 pt-2">
              <a
                href="/encuesta"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-primary"
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#0056B3] hover:bg-[#003E80] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm group cursor-pointer"
              >
                <span>Completar mi Encuesta</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="text-center">
                <a
                  href="/admin/login"
                  className="text-[10px] text-slate-400 hover:text-[#0056B3] font-bold uppercase tracking-wider transition-colors"
                >
                  Acceso de Calidad Académica →
                </a>
              </div>
            </div>

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
            <span>Powered by Arizona State University®</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
