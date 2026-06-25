import React from "react";
import { ArrowRight, BookOpen, Briefcase, Award, GraduationCap } from "lucide-react";

/* ── Metadata ──────────────────────────────────────────────── */
export const metadata = {
  title: "USAP | Encuesta Alumni USAP",
  description:
    "Encuesta oficial de la Asociación Alumni USAP de la Universidad de San Pedro Sula. Fortaleciendo el vínculo con nuestros graduados.",
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
          
          {/* Institution Greeting Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-extrabold text-[#0056B3] uppercase tracking-wider">
              Dirección de Vinculación y Extensión
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] tracking-tight leading-[1.12]">
            Encuesta <br />
            <span className="text-[#0056B3]">
              USAP-Alumni
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg">
            Uno de nuestros objetivos institucionales es la creación de la <strong>Asociación Alumni USAP</strong>, con el propósito de fortalecer los vínculos con nuestros graduados, conocer su trayectoria profesional y potenciar su experiencia, logros y vocación para seguir impactando positivamente a nuestra comunidad universitaria.
          </p>

          {/* Time estimate */}
          <div className="flex items-center space-x-3 p-3 bg-[#FAF9F5] border border-[#E2E8F0] rounded-xl max-w-sm">
            <span className="text-xs font-bold text-slate-700">
              ⏱️ Completar esta encuesta le tomará aproximadamente <strong className="text-[#0056B3] font-extrabold">5 minutos</strong>.
            </span>
          </div>
        </div>

        {/* Right Side: Benefits Card */}
        <div className="w-full lg:w-5/12 flex justify-center animate-fadeIn-d1">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col justify-between space-y-5">
            
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold text-[#1A1A1A] uppercase tracking-widest">
                Al formar parte de Alumni USAP, podrá:
              </h2>
            </div>

            {/* Benefits List */}
            <div className="space-y-3.5">
              {[
                { 
                  icon: <BookOpen className="h-4.5 w-4.5 text-[#0056B3]" />, 
                  title: "Red de Contactos", 
                  desc: "Ampliar su red de contactos profesionales" 
                },
                { 
                  icon: <Briefcase className="h-4.5 w-4.5 text-[#0056B3]" />, 
                  title: "Oportunidades", 
                  desc: "Acceder a oportunidades laborales y de desarrollo profesional" 
                },
                { 
                  icon: <Award className="h-4.5 w-4.5 text-[#0056B3]" />, 
                  title: "Participación Activa", 
                  desc: "Participar en eventos, mentorías y proyectos con impacto social" 
                },
                { 
                  icon: <GraduationCap className="h-4.5 w-4.5 text-[#0056B3]" />, 
                  title: "Alma Mater", 
                  desc: "Mantener vivo el vínculo con su alma mater" 
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col text-left justify-center min-h-[40px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0056B3]">{item.title}</span>
                    <span className="text-[11.5px] text-slate-500 font-semibold mt-0.5 leading-snug">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Share invitation and CTA */}
            <div className="space-y-4 pt-1">
              <a
                href="/encuesta"
                id="hero-cta-primary"
                className="w-full inline-flex items-center justify-center space-x-2 bg-[#0056B3] hover:bg-[#003E80] text-white text-xs sm:text-sm font-bold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm group cursor-pointer"
              >
                <span>Completar mi Encuesta</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <p className="text-[10px] text-slate-400 font-bold text-center leading-normal">
                📢 Le invitamos a compartir esta encuesta con otros compañeros de su promoción.
              </p>

              <div className="text-center pt-1">
                <a
                  href="/admin/login"
                  className="text-[9px] text-slate-400 hover:text-[#0056B3] font-bold uppercase tracking-wider transition-colors"
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
