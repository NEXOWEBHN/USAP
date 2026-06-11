"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  FileSpreadsheet, 
  RotateCw, 
  Users, 
  BookOpen,
  Briefcase,
  Search,
  Filter,
  ChevronDown, 
  ChevronUp, 
  FileCheck,
  LogOut,
  GraduationCap,
  Calendar,
  MapPin,
  Mail,
  UserCheck
} from "lucide-react";

interface AlumniResponse {
  id: string;
  fecha_creacion: Date;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  carrera: string;
  ano_graduacion: number;
  nacionalidad: string;
  estudios_posgrado: boolean;
  empleado_o_negocio: boolean;
  campo_estudio: boolean;
}

interface Metrics {
  totalEncuestas: number;
  empleabilidadRate: number;
  afinidadRate: number;
  posgradoRate: number;
  hoyCount: number;
  respuestasPorCarrera: { name: string; cantidad: number }[];
  respuestasPorNacionalidad: { name: string; cantidad: number }[];
  respuestasPorAnoGraduacion: { year: number; cantidad: number }[];
  historialRespuestas: { fecha: string; cantidad: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AlumniResponse[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [expandedRow, setExpandedRow] = useState<Record<string, boolean>>({});
  const [authChecked, setAuthChecked] = useState(false);

  // ── Auth guard ──
  useEffect(() => {
    const auth = sessionStorage.getItem("usap_admin_auth");
    if (auth !== "true") {
      window.location.replace("/admin/login");
    } else {
      setAuthChecked(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("usap_admin_auth");
    window.location.href = "/admin/login";
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/encuestas");
      const result = await response.json();
      if (response.ok && result.success) {
        setData(result.data);
        setMetrics(result.metrics);
      } else {
        setError(result.error || "No se pudieron cargar los datos.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red al obtener las respuestas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) fetchData();
  }, [authChecked]);

  if (!authChecked) return null;

  const toggleRow = (id: string) => {
    setExpandedRow(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const respuestasFiltradas = data.filter(item => {
    const cumpleCarrera = filtroCarrera === "todos" || item.carrera === filtroCarrera;
    const cumpleBusqueda = !busqueda || 
      item.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.dni.includes(busqueda) ||
      item.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.carrera.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleCarrera && cumpleBusqueda;
  });

  const carrerasUnicas = Array.from(new Set(data.map(item => item.carrera))).sort();

  const handleExport = () => {
    window.location.href = "/api/exportar";
  };

  return (
    <div className="w-full h-screen max-h-screen flex flex-col bg-[#F8FAFC] overflow-hidden bg-grid-pattern animate-fadeInSimple">
      
      {/* ── Header (Floating Capsule) ── */}
      <div className="w-full px-4 sm:px-6 pt-5 shrink-0 z-50">
        <header className="w-full max-w-7xl mx-auto rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
          <div className="flex items-center space-x-3.5">
            <a href="/" className="flex items-center group" id="nav-dashboard-logo">
              <div className="h-9 w-9 bg-[#0056B3] rounded-lg flex items-center justify-center text-white mr-2.5 transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black tracking-tight text-[#0056B3] leading-none">USAP</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Universidad de San Pedro Sula</span>
              </div>
            </a>
            
            <div className="border-l border-slate-200 pl-4 py-0.5">
              <h1 className="font-extrabold text-sm text-[#1A1A1A] tracking-tight flex items-center gap-1.5">
                Panel Administrativo
              </h1>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Seguimiento de Egresados</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              id="btn-refresh"
              onClick={fetchData}
              disabled={isLoading}
              className="px-3.5 py-2 border border-[#E2E8F0] bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-500 font-bold rounded-lg transition-all flex items-center space-x-1.5 text-xs cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            
            <button
              id="btn-export-excel"
              onClick={handleExport}
              className="px-4 py-2 bg-[#0056B3] hover:bg-[#003E80] text-white font-bold rounded-lg transition-all flex items-center space-x-1.5 text-xs cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-sky-450" />
              <span>Exportar Excel</span>
            </button>

            <button
              id="btn-logout"
              onClick={handleLogout}
              className="px-3.5 py-2 border border-transparent hover:border-slate-200 text-slate-400 hover:text-red-700 hover:bg-slate-50 font-bold rounded-lg transition-all flex items-center space-x-1.5 text-xs cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </header>
      </div>

      {/* ── Main Content Area ── */}
      <main className="w-full flex-1 min-h-0 flex flex-col p-4 md:p-6 space-y-4 max-w-7xl mx-auto overflow-hidden">
        
        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex justify-between items-center animate-fadeIn shrink-0 shadow-sm">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              {error}
            </span>
            <button onClick={() => setError("")} className="hover:underline font-extrabold uppercase text-[10px]">Cerrar</button>
          </div>
        )}

        {/* Loading Shimmer Skeleton */}
        {isLoading && !metrics ? (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3 shadow-sm">
                  <div className="h-3.5 w-1/2 bg-slate-100 rounded animate-pulse" />
                  <div className="h-7 w-1/3 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              <div className="h-full bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse" />
              <div className="h-full bg-white rounded-xl border border-[#E2E8F0] p-6 animate-pulse lg:col-span-2" />
            </div>
          </div>
        ) : (
          <>
            {/* 1. KPIs Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              
              {/* Total Encuestas */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">Total Encuestados</span>
                  <div className="bg-slate-50 text-[#0056B3] p-2 rounded-lg border border-slate-100">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-[#1A1A1A] leading-none">{metrics?.totalEncuestas}</span>
                  <span className="text-[10px] text-slate-400 block font-bold mt-0.5">Egresados en sistema</span>
                </div>
              </div>

              {/* Tasa Empleabilidad */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">Tasa Empleabilidad</span>
                  <div className="bg-slate-50 text-[#0056B3] p-2 rounded-lg border border-slate-100">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-[#1A1A1A] leading-none">{metrics?.empleabilidadRate}%</span>
                  <span className="text-[10px] text-slate-400 block font-bold mt-0.5">Con empleo o negocio (24m)</span>
                </div>
              </div>

              {/* Afinidad de Campo */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">Afinidad de Campo</span>
                  <div className="bg-slate-50 text-[#0056B3] p-2 rounded-lg border border-slate-100">
                    <FileCheck className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-[#1A1A1A] leading-none">{metrics?.afinidadRate}%</span>
                  <span className="text-[10px] text-slate-400 block font-bold mt-0.5">Trabajan en su carrera</span>
                </div>
              </div>

              {/* Continuidad Posgrado */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[9px] font-extrabold uppercase tracking-widest">Estudios Posgrado</span>
                  <div className="bg-slate-50 text-[#0056B3] p-2 rounded-lg border border-slate-100">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-[#1A1A1A] leading-none">{metrics?.posgradoRate}%</span>
                  <span className="text-[10px] text-slate-400 block font-bold mt-0.5">Iniciaron posgrado (12m)</span>
                </div>
              </div>
            </section>

            {/* 2. Unified Content Grid Layout (SaaS Style) */}
            <section className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
              
              {/* Left Column: Stacked Charts */}
              <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto pr-1">
                
                {/* Chart 1: Distribución por Año */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between shrink-0">
                  <div>
                    <div className="flex items-center space-x-2 text-slate-800">
                      <TrendingUp className="h-4 w-4 text-[#0056B3]" />
                      <h3 className="font-extrabold text-[12px] tracking-tight text-[#1A1A1A]">Tendencia por Año de Graduación</h3>
                    </div>
                    <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Volumen de respuestas por cohorte</p>
                  </div>

                  <div className="flex-1 flex items-end justify-center relative mt-4">
                    {metrics?.respuestasPorAnoGraduacion && metrics.respuestasPorAnoGraduacion.length > 0 ? (
                      (() => {
                        const chartWidth = 280;
                        const chartHeight = 110;
                        const padding = 15;
                        
                        const maxCantidad = Math.max(...metrics.respuestasPorAnoGraduacion.map(a => a.cantidad), 4);
                        
                        const points = metrics.respuestasPorAnoGraduacion.map((item, i) => {
                          const x = padding + (i * (chartWidth - padding * 2)) / (metrics.respuestasPorAnoGraduacion.length - 1 || 1);
                          const y = chartHeight - padding - (item.cantidad * (chartHeight - padding * 2)) / maxCantidad;
                          return { x, y, val: item.cantidad, label: item.year };
                        });

                        const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");
                        const areaPoints = `${points[0].x},${chartHeight - padding} ${polylinePoints} ${points[points.length - 1].x},${chartHeight - padding}`;

                        return (
                          <div className="w-full flex flex-col items-center">
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
                              <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#0056B3" stopOpacity="0.03" />
                                  <stop offset="100%" stopColor="#0056B3" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              
                              {/* Horizontal dotted gridlines */}
                              {[0, 0.33, 0.66, 1].map((ratio, i) => {
                                const yGrid = padding + ratio * (chartHeight - padding * 2);
                                return (
                                  <line 
                                    key={i} 
                                    x1={padding} 
                                    y1={yGrid} 
                                    x2={chartWidth - padding} 
                                    y2={yGrid} 
                                    stroke="#E2E8F0" 
                                    strokeWidth="1" 
                                    strokeDasharray="2 3" 
                                  />
                                );
                              })}
                              
                              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#E2E8F0" strokeWidth="1" />
                              
                              <polygon points={areaPoints} fill="url(#areaGrad)" />
                              
                              <polyline
                                fill="none"
                                stroke="#0056B3"
                                strokeWidth="2"
                                points={polylinePoints}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              
                              {points.map((p, idx) => (
                                <g key={idx} className="group">
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="2.5"
                                    fill="#FFFFFF"
                                    stroke="#0056B3"
                                    strokeWidth="1.5"
                                    className="cursor-pointer transition-all"
                                  />
                                </g>
                              ))}
                            </svg>
                            
                            <div className="w-full flex justify-between px-2 mt-1 text-[8.5px] font-extrabold text-slate-400">
                              {points.map((p, i) => (
                                <span key={i}>{p.label}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-[10px] text-slate-400 py-6">Sin datos de graduación.</p>
                    )}
                  </div>
                </div>

                {/* Chart 2: Egresados por Carrera */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between shrink-0">
                  <div>
                    <div className="flex items-center space-x-2 text-slate-800">
                      <BarChart3 className="h-4 w-4 text-[#0056B3]" />
                      <h3 className="font-extrabold text-[12px] tracking-tight text-[#1A1A1A]">Egresados por Carrera (Top 5)</h3>
                    </div>
                    <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Distribución de encuestas por carrera</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-2.5 pt-3">
                    {metrics?.respuestasPorCarrera && metrics.respuestasPorCarrera.length > 0 ? (
                      (() => {
                        const topCarreras = metrics.respuestasPorCarrera.slice(0, 5);
                        const maxCant = Math.max(...topCarreras.map(c => c.cantidad), 1);
                        
                        return topCarreras.map((carr, i) => {
                          const percent = (carr.cantidad / maxCant) * 100;
                          return (
                            <div key={i} className="space-y-1 text-xs">
                              <div className="flex justify-between font-bold text-slate-700 text-[10px]">
                                <span className="truncate max-w-[170px]" title={carr.name}>{carr.name}</span>
                                <span className="text-[#0056B3] font-extrabold shrink-0 ml-1">
                                  {carr.cantidad}
                                </span>
                              </div>
                              <div className="w-full bg-[#FAF9F5] h-1.5 rounded-full overflow-hidden flex border border-[#E2E8F0]">
                                <div 
                                  className="bg-[#0056B3] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()
                    ) : (
                      <p className="text-[10px] text-slate-400 text-center py-6">No hay registros de carreras aún.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Generous Data Table */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-5.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] h-full flex flex-col overflow-hidden">
                
                {/* Table Control Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] shrink-0">
                  <div>
                    <h3 className="font-extrabold text-xs text-[#1A1A1A] tracking-tight flex items-center space-x-2">
                      <span>Egresados Registrados</span>
                      <span className="bg-[#FAF9F5] border border-[#E2E8F0] text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {respuestasFiltradas.length} de {data.length}
                      </span>
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Listado histórico de respuestas</p>
                  </div>

                  {/* Table Filters */}
                  <div className="flex flex-col sm:flex-row gap-2.5 items-center w-full sm:w-auto">
                    <div className="relative w-full sm:w-44">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        id="search-input"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs outline-none focus:border-[#0056B3] transition-all text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="relative w-full sm:w-auto flex items-center space-x-1">
                      <Filter className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
                      <label htmlFor="carrera-filter" className="sr-only">Filtrar por carrera</label>
                      <select
                        id="carrera-filter"
                        value={filtroCarrera}
                        onChange={(e) => setFiltroCarrera(e.target.value)}
                        className="w-full sm:w-44 py-1.5 pl-2.5 pr-7 border border-[#E2E8F0] rounded-lg text-xs outline-none bg-white focus:border-[#0056B3] font-bold text-slate-600 truncate appearance-none cursor-pointer"
                      >
                        <option value="todos">Todas las carreras</option>
                        {carrerasUnicas.map((carr, idx) => (
                          <option key={idx} value={carr}>{carr}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Element (Scrollable Container) */}
                <div className="flex-1 min-h-0 overflow-y-auto mt-4 pr-1">
                  {respuestasFiltradas.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-slate-100 text-[9px] font-extrabold text-slate-400 tracking-wider uppercase bg-white">
                          <th className="py-2.5 px-2">Nombre</th>
                          <th className="py-2.5 px-2">Carrera</th>
                          <th className="py-2.5 px-2 text-center">Año</th>
                          <th className="py-2.5 px-2 text-center">Posgrado</th>
                          <th className="py-2.5 px-2 text-center">Empleado</th>
                          <th className="py-2.5 px-2 text-center">Afinidad</th>
                          <th className="py-2.5 px-2 text-center">Detalle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {respuestasFiltradas.map((item) => {
                          const isExpanded = !!expandedRow[item.id];
                          const date = new Date(item.fecha_creacion);
                          const displayDate = date.toLocaleDateString("es-HN") + " " + date.toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" });

                          return (
                            <React.Fragment key={item.id}>
                              <tr className="hover:bg-slate-50/50 transition-all font-semibold text-slate-700">
                                <td className="py-3 px-2">
                                  <div className="text-slate-800 font-extrabold">{item.nombres} {item.apellidos}</div>
                                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">{item.correo}</div>
                                </td>
                                <td className="py-3 px-2 text-[#0056B3] font-extrabold max-w-[160px] truncate" title={item.carrera}>{item.carrera}</td>
                                <td className="py-3 px-2 text-center text-slate-600">{item.ano_graduacion}</td>
                                
                                {/* Status Badges */}
                                <td className="py-3 px-2 text-center">
                                  {item.estudios_posgrado ? (
                                    <span className="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase">
                                      Sí
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase">
                                      No
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-2 text-center">
                                  {item.empleado_o_negocio ? (
                                    <span className="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase">
                                      Sí
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase">
                                      No
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-2 text-center">
                                  {item.campo_estudio ? (
                                    <span className="inline-flex items-center text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase">
                                      Sí
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase">
                                      No
                                    </span>
                                  )}
                                </td>

                                {/* Expand Row Button */}
                                <td className="py-3 px-2 text-center">
                                  <button
                                    id={`row-toggle-${item.id}`}
                                    onClick={() => toggleRow(item.id)}
                                    className="text-slate-400 hover:text-[#0056B3] font-bold p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                  >
                                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                  </button>
                                </td>
                              </tr>
                              
                              {/* Expanded details */}
                              {isExpanded && (
                                <tr className="bg-slate-50/10">
                                  <td colSpan={7} className="py-3 px-5 border-b border-[#E2E8F0]">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold py-1">
                                      <div className="space-y-0.5">
                                        <span className="text-slate-400 block text-[8.5px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                          <UserCheck className="h-3.5 w-3.5 text-[#0056B3]" />
                                          DNI / Identidad
                                        </span>
                                        <span className="text-[#1A1A1A] font-extrabold text-xs">{item.dni}</span>
                                      </div>
                                      
                                      <div className="space-y-0.5">
                                        <span className="text-slate-400 block text-[8.5px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                          <MapPin className="h-3.5 w-3.5 text-[#0056B3]" />
                                          Nacionalidad
                                        </span>
                                        <span className="text-[#1A1A1A] font-extrabold text-xs">{item.nacionalidad}</span>
                                      </div>

                                      <div className="space-y-0.5">
                                        <span className="text-slate-400 block text-[8.5px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                          <Calendar className="h-3.5 w-3.5 text-[#0056B3]" />
                                          Fecha Reg.
                                        </span>
                                        <span className="text-slate-600 font-bold block">{displayDate}</span>
                                      </div>

                                      <div className="space-y-0.5">
                                        <span className="text-slate-400 block text-[8.5px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                                          <Mail className="h-3.5 w-3.5 text-[#0056B3]" />
                                          Contacto
                                        </span>
                                        <a href={`mailto:${item.correo}`} className="text-[#0056B3] hover:underline font-extrabold flex items-center gap-1 text-xs">
                                          <span>Enviar Correo</span>
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <p className="font-extrabold text-xs bg-transparent">No se encontraron egresados</p>
                      <p className="text-[10px]">Ajusta tus parámetros de búsqueda o cambia la carrera seleccionada.</p>
                    </div>
                  )}
                </div>
              </div>

            </section>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-[#E2E8F0] bg-white py-3.5 px-6 flex justify-center shrink-0">
        <div className="w-full max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
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
