import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nombres, 
      apellidos, 
      dni, 
      correo, 
      carrera, 
      ano_graduacion, 
      nacionalidad, 
      estudios_posgrado, 
      empleado_o_negocio, 
      campo_estudio 
    } = body;

    // Validación de campos obligatorios
    if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
      return NextResponse.json({ error: 'Nombres es un campo requerido.' }, { status: 400 });
    }
    if (!apellidos || typeof apellidos !== 'string' || apellidos.trim() === '') {
      return NextResponse.json({ error: 'Apellidos es un campo requerido.' }, { status: 400 });
    }
    if (!dni || typeof dni !== 'string' || !/^\d+$/.test(dni)) {
      return NextResponse.json({ error: 'El DNI debe contener únicamente números, sin guiones ni espacios.' }, { status: 400 });
    }
    if (!correo || typeof correo !== 'string' || !correo.includes('@')) {
      return NextResponse.json({ error: 'Por favor ingresa un correo electrónico válido.' }, { status: 400 });
    }
    if (!carrera || typeof carrera !== 'string' || carrera.trim() === '') {
      return NextResponse.json({ error: 'La carrera de estudio es requerida.' }, { status: 400 });
    }
    
    const ano = Number(ano_graduacion);
    if (isNaN(ano) || ano < 1950 || ano > 2100) {
      return NextResponse.json({ error: 'Por favor ingresa un año de graduación válido de 4 números.' }, { status: 400 });
    }

    if (!nacionalidad || typeof nacionalidad !== 'string' || nacionalidad.trim() === '') {
      return NextResponse.json({ error: 'Nacionalidad es requerida.' }, { status: 400 });
    }

    const res = await db.saveResponse({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      correo: correo.trim().toLowerCase(),
      carrera: carrera.trim(),
      ano_graduacion: ano,
      nacionalidad: nacionalidad.trim(),
      estudios_posgrado: Boolean(estudios_posgrado),
      empleado_o_negocio: Boolean(empleado_o_negocio),
      campo_estudio: Boolean(campo_estudio)
    });

    return NextResponse.json({ success: true, data: res }, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/encuestas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al guardar la encuesta de egresado.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rawData = await db.getAllResponses();
    const totalEncuestas = rawData.length;

    let totalEmpleados = 0;
    let totalAfinidad = 0;
    let totalPosgrado = 0;
    let hoyCount = 0;

    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const carreraMap: Record<string, number> = {};
    const nacionalidadMap: Record<string, number> = {};
    const anoMap: Record<number, number> = {};

    rawData.forEach(item => {
      // Contador de empleo
      if (item.empleado_o_negocio) {
        totalEmpleados++;
        // Afinidad en su área laboral
        if (item.campo_estudio) {
          totalAfinidad++;
        }
      }
      
      // Estudios de posgrado
      if (item.estudios_posgrado) {
        totalPosgrado++;
      }

      // Respuestas registradas hoy
      const fecha = new Date(item.fecha_creacion);
      if (fecha >= hoyInicio) {
        hoyCount++;
      }

      // Distribución por carrera
      if (item.carrera) {
        const itemCarreras = item.carrera.split(',').map(c => c.trim()).filter(Boolean);
        itemCarreras.forEach(c => {
          carreraMap[c] = (carreraMap[c] || 0) + 1;
        });
      }

      // Distribución por nacionalidad
      nacionalidadMap[item.nacionalidad] = (nacionalidadMap[item.nacionalidad] || 0) + 1;

      // Distribución por año de graduación
      anoMap[item.ano_graduacion] = (anoMap[item.ano_graduacion] || 0) + 1;
    });

    const empleabilidadRate = totalEncuestas > 0 ? Math.round((totalEmpleados / totalEncuestas) * 100) : 0;
    const afinidadRate = totalEmpleados > 0 ? Math.round((totalAfinidad / totalEmpleados) * 100) : 0;
    const posgradoRate = totalEncuestas > 0 ? Math.round((totalPosgrado / totalEncuestas) * 100) : 0;

    // Clasificar y ordenar departamentos/carreras por cantidad
    const respuestasPorCarrera = Object.keys(carreraMap).map(name => ({
      name,
      cantidad: carreraMap[name]
    })).sort((a, b) => b.cantidad - a.cantidad);

    // Formatear distribución de nacionalidades
    const respuestasPorNacionalidad = Object.keys(nacionalidadMap).map(name => ({
      name,
      cantidad: nacionalidadMap[name]
    }));

    // Formatear respuestas por año de graduación (ordenado cronológicamente)
    const respuestasPorAnoGraduacion = Object.keys(anoMap).map(year => ({
      year: Number(year),
      cantidad: anoMap[Number(year)]
    })).sort((a, b) => a.year - b.year);

    // Historial de respuestas por fecha de envío (últimos 7 días)
    const ultimosDiasMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit' });
      ultimosDiasMap[dateString] = 0;
    }

    rawData.forEach(item => {
      const fecha = new Date(item.fecha_creacion);
      const dateString = fecha.toLocaleDateString('es-HN', { day: '2-digit', month: '2-digit' });
      if (ultimosDiasMap[dateString] !== undefined) {
        ultimosDiasMap[dateString]++;
      }
    });

    const historialRespuestas = Object.keys(ultimosDiasMap).map(fecha => ({
      fecha,
      cantidad: ultimosDiasMap[fecha]
    }));

    return NextResponse.json({
      success: true,
      metrics: {
        totalEncuestas,
        empleabilidadRate,
        afinidadRate,
        posgradoRate,
        hoyCount,
        respuestasPorCarrera,
        respuestasPorNacionalidad,
        respuestasPorAnoGraduacion,
        historialRespuestas,
      },
      data: rawData
    });
  } catch (error) {
    console.error('Error en GET /api/encuestas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener encuestas.' },
      { status: 500 }
    );
  }
}
