"use client";

import React, { useState } from "react";
import { 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Building,
  ArrowUpRight,
  Check,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  ShieldCheck,
  X
} from "lucide-react";

// Listado exacto de las carreras del Google Form
const CARRERAS = [
  "Arquitectura",
  "Ingeniería Industrial",
  "Ingeniería Industrial y de Sistemas",
  "Ingeniería en Operaciones y Logística",
  "Ingeniería en Gestión Industrial y de Procesos",
  "Ingeniería en Tecnología Electrónica",
  "Ingeniería en Tecnologías Computacionales",
  "Ingeniería en Tecnologías de la Información y las Comunicaciones",
  "Ingeniería en Desarrollo de Aplicaciones",
  "Ingeniería en Analítica de Datos e Inteligencia de Negocios",
  "Ingeniería en Animación y Diseño Digital",
  "Ingeniería Agronómica Administrativa",
  "Licenciatura en Informática Administrativa",
  "Licenciatura en Administración de Tecnologías de Información",
  "Licenciatura en Negocios Electrónicos",
  "Licenciatura en Diseño Gráfico",
  "Técnico Universitario en Diseño Gráfico",
  "Técnico Universitario en Big Data",
  "Licenciatura en Derecho",
  "Licenciatura en Administración de Empresas",
  "Licenciatura en Administración Financiera y Bancaria",
  "Licenciatura en Dirección Estratégica del Talento Humano",
  "Licenciatura en Gerencia de Negocios y Emprendimiento",
  "Licenciatura en Mercadotecnia",
  "Licenciatura en Mercadotecnia y Medios Digitales (o Diseño Digital)",
  "Licenciatura en Ciencias de la Comunicación y Publicidad",
  "Licenciatura en Administración Turística",
  "Técnico en Administración de la Producción",
  "Técnico en Administración de Ventas",
  "Técnico en Turismo",
  "Maestría en Gestión y Dirección de Empresas",
  "Maestría en Administración Industrial",
  "Maestría en Derecho Procesal Civil"
];

export default function EncuestaPage() {
  const [step, setStep] = useState(1);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [correo, setCorreo] = useState("");
  const [carrera, setCarrera] = useState("");
  const [anoGraduacion, setAnoGraduacion] = useState("");
  const [nacionalidad, setNacionalidad] = useState("Hondureña");
  const [estudiosPosgrado, setEstudiosPosgrado] = useState<boolean | null>(null);
  const [empleadoONegocio, setEmpleadoONegocio] = useState<boolean | null>(null);
  const [campoEstudio, setCampoEstudio] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const nextStep = () => {
    if (step === 1) {
      if (!nombres.trim()) {
        setError("Por favor, ingresa tus nombres.");
        return;
      }
      if (!apellidos.trim()) {
        setError("Por favor, ingresa tus apellidos.");
        return;
      }
      if (!dni.trim()) {
        setError("Por favor, ingresa tu número de DNI.");
        return;
      }
      if (!/^\d+$/.test(dni)) {
        setError("El DNI debe contener solo números, sin guiones ni espacios.");
        return;
      }
      if (!correo.trim()) {
        setError("Por favor, ingresa tu correo electrónico.");
        return;
      }
      if (!correo.includes("@") || !correo.includes(".")) {
        setError("Por favor, ingresa un correo electrónico válido.");
        return;
      }
      if (!nacionalidad.trim()) {
        setError("Por favor, ingresa tu nacionalidad.");
        return;
      }
    }

    if (step === 2) {
      if (!carrera) {
        setError("Por favor, selecciona la carrera que estudiaste.");
        return;
      }
      if (!anoGraduacion.trim()) {
        setError("Por favor, ingresa tu año de graduación.");
        return;
      }
      if (!/^\d{4}$/.test(anoGraduacion)) {
        setError("El año de graduación debe ser de 4 dígitos (ejemplo: 2026).");
        return;
      }
      const anoNum = Number(anoGraduacion);
      if (anoNum < 1960 || anoNum > new Date().getFullYear() + 5) {
        setError("Por favor, ingresa un año de graduación coherente.");
        return;
      }
    }

    if (step === 3) {
      if (estudiosPosgrado === null) {
        setError("Por favor, responde la pregunta sobre estudios de posgrado.");
        return;
      }
      if (empleadoONegocio === null) {
        setError("Por favor, responde la pregunta sobre tu estado de empleo/negocio.");
        return;
      }
      if (campoEstudio === null) {
        setError("Por favor, responde la pregunta sobre afinidad con tu campo de estudio.");
        return;
      }
    }

    setError("");
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/encuestas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombres,
          apellidos,
          dni,
          correo,
          carrera,
          ano_graduacion: Number(anoGraduacion),
          nacionalidad,
          estudios_posgrado: estudiosPosgrado,
          empleado_o_negocio: empleadoONegocio,
          campo_estudio: campoEstudio
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStep(5); // Éxito
      } else {
        setError(result.error || "Ocurrió un error al enviar tu formulario.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setNombres("");
    setApellidos("");
    setDni("");
    setCorreo("");
    setCarrera("");
    setAnoGraduacion("");
    setNacionalidad("Hondureña");
    setEstudiosPosgrado(null);
    setEmpleadoONegocio(null);
    setCampoEstudio(null);
    setError("");
  };

  const progressPercent = ((step - 1) / 4) * 100;

  // Icons and titles for visual stepper timeline
  const stepsData = [
    { title: "Identidad", desc: "Datos de egresado", icon: <User className="h-4 w-4" /> },
    { title: "Académico", desc: "Estudios en USAP", icon: <GraduationCap className="h-4 w-4" /> },
    { title: "Seguimiento", desc: "Posgrado y Empleo", icon: <Briefcase className="h-4 w-4" /> },
    { title: "Revisión", desc: "Confirmar datos", icon: <ClipboardCheck className="h-4 w-4" /> }
  ];

  return (
    <div className="w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-[#F8FAFC] relative overflow-y-auto lg:overflow-hidden bg-grid-pattern">
      
      {/* ── Header (Floating Navbar Capsule) ── */}
      <div className="w-full px-4 sm:px-6 pt-5 sticky top-0 z-50">
        <header className="w-full max-w-6xl mx-auto rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
          <a href="/" className="flex items-center group" id="nav-survey-logo">
            <div className="h-9 w-9 bg-[#0056B3] rounded-lg flex items-center justify-center text-white mr-2.5 shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5 text-amber-450" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-black tracking-tight text-[#0056B3] leading-none">USAP</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Universidad de San Pedro Sula</span>
            </div>
          </a>
          
          <div className="flex items-center space-x-1.5 text-[10px] font-extrabold text-slate-500 bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-lg uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Conexión Segura</span>
          </div>
        </header>
      </div>

      {/* ── Main Container (Viewport Height Centered) ── */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-4 md:p-6 my-auto max-w-3xl mx-auto">
        
        {/* Visual Timeline Stepper */}
        {step < 5 && (
          <div className="w-full max-w-xl mb-6 hidden sm:block">
            <div className="flex justify-between items-center relative">
              
              {/* Background Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              
              {/* Active/Completed Connecting Line */}
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-[#0056B3] -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />

              {stepsData.map((s, idx) => {
                const sNum = idx + 1;
                const isCompleted = step > sNum;
                const isActive = step === sNum;
                
                return (
                  <div key={idx} className="flex flex-col items-center z-10 relative">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isCompleted 
                        ? "bg-[#0056B3] border-[#0056B3] text-white shadow-sm"
                        : isActive
                          ? "bg-white border-[#0056B3] text-[#0056B3] ring-4 ring-blue-50 font-bold"
                          : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.icon}
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase mt-1.5 tracking-wider ${
                      isActive ? "text-[#0056B3]" : isCompleted ? "text-[#0056B3]" : "text-slate-400"
                    }`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col min-h-[440px] animate-fadeIn transition-all duration-300">
          
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                <span className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <X className="h-3 w-3 text-red-600" />
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Stepper Content */}
            <div className="flex-1 flex flex-col justify-center">

              {/* PASO 1: IDENTIFICACIÓN */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold text-[#0056B3] uppercase tracking-widest block">Paso 1 de 4</span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                      Información de Identificación
                    </h1>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Completa tus datos personales para iniciar la validación de tu expediente como egresado de la universidad.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label htmlFor="nombres-input" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Nombres *</label>
                      <input
                        type="text"
                        id="nombres-input"
                        placeholder="Ingresa tus nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="apellidos-input" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Apellidos *</label>
                      <input
                        type="text"
                        id="apellidos-input"
                        placeholder="Ingresa tus apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="dni-input" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">DNI / Identificación *</label>
                      <input
                        type="text"
                        id="dni-input"
                        placeholder="Ej: 0501199801234"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                      />
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">Sin espacios ni guiones</span>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="correo-input" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Correo Electrónico *</label>
                      <input
                        type="email"
                        id="correo-input"
                        placeholder="correo@ejemplo.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="nacionalidad-input" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Nacionalidad *</label>
                      <input
                        type="text"
                        id="nacionalidad-input"
                        placeholder="Ej: Hondureña"
                        value={nacionalidad}
                        onChange={(e) => setNacionalidad(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: TRAYECTORIA ACADÉMICA */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold text-[#0056B3] uppercase tracking-widest block">Paso 2 de 4</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                      Información Académica USAP
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Selecciona la carrera o programa de posgrado del cual te has titulado en nuestra institución.
                    </p>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="space-y-1.5">
                      <label htmlFor="carrera-select" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Programa Cursado *</label>
                      <div className="relative">
                        <select
                          id="carrera-select"
                          value={carrera}
                          onChange={(e) => setCarrera(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-700 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-bold appearance-none cursor-pointer"
                        >
                          <option value="">-- Selecciona tu Carrera --</option>
                          {CARRERAS.map((carr, idx) => (
                            <option key={idx} value={carr}>{carr}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                          <Building className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-w-xs">
                      <label htmlFor="grad-year-input" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Año de Graduación *</label>
                      <input
                        type="text"
                        id="grad-year-input"
                        placeholder="Ej: 2026"
                        maxLength={4}
                        value={anoGraduacion}
                        onChange={(e) => setAnoGraduacion(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0056B3] focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold"
                      />
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">4 dígitos numéricos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: PREGUNTAS DE SEGUIMIENTO */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold text-[#0056B3] uppercase tracking-widest block">Paso 3 de 4</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                      Estudios y Situación Laboral
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Queremos conocer tu trayectoria profesional durante los primeros meses después de tu egreso.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 overflow-y-auto max-h-[280px] pr-1">
                    {/* Pregunta 1 */}
                    <div className="space-y-2 pb-2 border-b border-slate-100">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-700 leading-normal">
                        ¿Ha iniciado estudios de posgrado en los 12 meses siguientes a su graduación? *
                      </p>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          id="posgrado-si"
                          onClick={() => setEstudiosPosgrado(true)}
                          className={`flex-1 py-2.5 px-4 border rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            estudiosPosgrado === true
                              ? "bg-blue-50/50 text-[#0056B3] border-[#0056B3] font-bold shadow-sm"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50/20 font-semibold"
                          }`}
                        >
                          <span className="text-xs">Sí, inicié posgrado</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            estudiosPosgrado === true ? "bg-[#0056B3] border-[#0056B3] text-white" : "border-slate-200"
                          }`}>
                            {estudiosPosgrado === true && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                        <button
                          type="button"
                          id="posgrado-no"
                          onClick={() => setEstudiosPosgrado(false)}
                          className={`flex-1 py-2.5 px-4 border rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            estudiosPosgrado === false
                              ? "bg-blue-50/50 text-[#0056B3] border-[#0056B3] font-bold shadow-sm"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50/20 font-semibold"
                          }`}
                        >
                          <span className="text-xs">No he iniciado</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            estudiosPosgrado === false ? "bg-[#0056B3] border-[#0056B3] text-white" : "border-slate-200"
                          }`}>
                            {estudiosPosgrado === false && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Pregunta 2 */}
                    <div className="space-y-2 pb-2 border-b border-slate-100">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-700 leading-normal">
                        ¿Usted se ha encontrado empleado o ha iniciado un negocio dentro de los 24 meses posteriores a su graduación? *
                      </p>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          id="empleado-si"
                          onClick={() => setEmpleadoONegocio(true)}
                          className={`flex-1 py-2.5 px-4 border rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            empleadoONegocio === true
                              ? "bg-blue-50/50 text-[#0056B3] border-[#0056B3] font-bold shadow-sm"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50/20 font-semibold"
                          }`}
                        >
                          <span className="text-xs">Sí, con empleo/negocio</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            empleadoONegocio === true ? "bg-[#0056B3] border-[#0056B3] text-white" : "border-slate-200"
                          }`}>
                            {empleadoONegocio === true && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                        <button
                          type="button"
                          id="empleado-no"
                          onClick={() => setEmpleadoONegocio(false)}
                          className={`flex-1 py-2.5 px-4 border rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            empleadoONegocio === false
                              ? "bg-blue-50/50 text-[#0056B3] border-[#0056B3] font-bold shadow-sm"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50/20 font-semibold"
                          }`}
                        >
                          <span className="text-xs">No he laborado</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            empleadoONegocio === false ? "bg-[#0056B3] border-[#0056B3] text-white" : "border-slate-200"
                          }`}>
                            {empleadoONegocio === false && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Pregunta 3 */}
                    <div className="space-y-2 pb-1">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-700 leading-normal">
                        ¿La actividad profesional que realizó dentro de los 24 meses posteriores requería educación superior o era de su campo de estudio? *
                      </p>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          id="campo-si"
                          onClick={() => setCampoEstudio(true)}
                          className={`flex-1 py-2.5 px-4 border rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            campoEstudio === true
                              ? "bg-blue-50/50 text-[#0056B3] border-[#0056B3] font-bold shadow-sm"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50/20 font-semibold"
                          }`}
                        >
                          <span className="text-xs">Sí, afín al campo</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            campoEstudio === true ? "bg-[#0056B3] border-[#0056B3] text-white" : "border-slate-200"
                          }`}>
                            {campoEstudio === true && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                        <button
                          type="button"
                          id="campo-no"
                          onClick={() => setCampoEstudio(false)}
                          className={`flex-1 py-2.5 px-4 border rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                            campoEstudio === false
                              ? "bg-blue-50/50 text-[#0056B3] border-[#0056B3] font-bold shadow-sm"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50/20 font-semibold"
                          }`}
                        >
                          <span className="text-xs">No es afín</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                            campoEstudio === false ? "bg-[#0056B3] border-[#0056B3] text-white" : "border-slate-200"
                          }`}>
                            {campoEstudio === false && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4: CONFIRMACIÓN Y REVISIÓN */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-extrabold text-[#0056B3] uppercase tracking-widest block">Paso 4 de 4</span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                      Verificación de Datos
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Revisa con cuidado tu información antes del envío oficial de la encuesta al sistema de base de datos.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-3.5 text-xs text-slate-600 max-h-[260px] overflow-y-auto">
                    <div className="pb-3 border-b border-slate-200/50 grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Nombre Completo</span>
                        <span className="text-[#0056B3] font-extrabold text-sm sm:text-base">{nombres} {apellidos}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">DNI / Identidad</span>
                        <span className="text-slate-700 font-bold">{dni}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Correo Electrónico</span>
                        <span className="text-slate-700 font-bold truncate block">{correo}</span>
                      </div>
                    </div>

                    <div className="pb-3 border-b border-slate-200/50 space-y-2.5">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Carrera Académica</span>
                        <span className="text-slate-700 font-bold flex items-center text-xs">
                          <Building className="h-4 w-4 mr-2 text-[#0056B3]" />
                          {carrera}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Año de Graduación</span>
                          <span className="text-slate-700 font-bold">{anoGraduacion}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Nacionalidad</span>
                          <span className="text-slate-700 font-bold">{nacionalidad}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 font-semibold">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Estudios de posgrado (12m):</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          estudiosPosgrado ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-red-50 text-red-700 border border-red-200/50"
                        }`}>{estudiosPosgrado ? "Sí" : "No"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Empleado o negocio (24m):</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          empleadoONegocio ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-red-50 text-red-700 border border-red-200/50"
                        }`}>{empleadoONegocio ? "Sí" : "No"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Actividad afín a su campo:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          campoEstudio ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-red-50 text-red-700 border border-red-200/50"
                        }`}>{campoEstudio ? "Sí" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 5: PANTALLA DE ÉXITO */}
              {step === 5 && (
                <div className="text-center py-4 space-y-5">
                  <div className="flex justify-center animate-pulse">
                    <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 text-emerald-600">
                      <Check className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0056B3] tracking-tight">
                      ¡Registro Completado!
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      La información ha sido guardada de forma estrictamente confidencial. Valoramos enormemente tu tiempo para esta encuesta académica de egresados de la Universidad de San Pedro Sula.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs mx-auto">
                    <button
                      type="button"
                      id="btn-restart"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#0056B3] hover:bg-[#003E80] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex-1"
                    >
                      Nuevo Formulario
                    </button>
                    <a
                      href="/"
                      id="link-home"
                      className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 text-slate-500 hover:text-[#0056B3] hover:bg-slate-50 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 flex-1"
                    >
                      <span>Volver al inicio</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Stepper Navigation Buttons */}
            {step < 5 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                <div>
                  {step > 1 ? (
                    <button
                      type="button"
                      id="btn-back"
                      onClick={prevStep}
                      disabled={isLoading}
                      className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-[#0056B3] hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Atrás</span>
                    </button>
                  ) : (
                    <div />
                  )}
                </div>

                <div>
                  {step < 4 ? (
                    <button
                      type="button"
                      id="btn-next"
                      onClick={nextStep}
                      className="px-5 py-2 bg-[#0056B3] hover:bg-[#003E80] text-white text-xs font-extrabold rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Siguiente</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="btn-submit"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-5 py-2 bg-[#0056B3] hover:bg-[#003E80] text-white text-xs font-extrabold rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-75"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Enviar Encuesta</span>
                          <CheckCircle className="h-3.5 w-3.5 text-amber-500" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

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
