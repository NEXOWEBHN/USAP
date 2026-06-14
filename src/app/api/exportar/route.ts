import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const rawData = await db.getAllResponses();

    // Mapear los datos de egresados a una estructura de Excel limpia
    const dataForExcel = rawData.map((item, index) => {
      const fecha = new Date(item.fecha_creacion);
      const fechaFormateada = fecha.toLocaleDateString('es-HN') + ' ' + fecha.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' });

      return {
        'Número': index + 1,
        'Fecha Registro': fechaFormateada,
        'Nombres': item.nombres,
        'Apellidos': item.apellidos,
        'DNI': item.dni,
        'Correo Electrónico': item.correo,
        'Carrera': item.carrera,
        'Año Graduación': item.ano_graduacion,
        'Nacionalidad': item.nacionalidad,
        'Estudios de Posgrado (12m)': item.estudios_posgrado ? 'Sí' : 'No',
        'Empleado o Negocio (24m)': item.empleado_o_negocio ? 'Sí' : 'No',
        'Afinidad Campo de Estudio': item.campo_estudio ? 'Sí' : 'No',
      };
    });

    // Crear hoja y libro de trabajo con SheetJS
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    
    // Configurar los anchos de columna óptimos
    const colWidths = [
      { wch: 8 },  // Número
      { wch: 22 }, // Fecha Registro
      { wch: 20 }, // Nombres
      { wch: 20 }, // Apellidos
      { wch: 18 }, // DNI
      { wch: 25 }, // Correo Electrónico
      { wch: 35 }, // Carrera
      { wch: 15 }, // Año Graduación
      { wch: 15 }, // Nacionalidad
      { wch: 25 }, // Posgrado
      { wch: 25 }, // Empleado
      { wch: 28 }, // Afinidad
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Egresados USAP');

    // Escribir a un buffer binario
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Configurar cabeceras HTTP para descarga automática
    const headers = new Headers();
    headers.append(
      'Content-Disposition',
      'attachment; filename="Reporte_Egresados_USAP.xlsx"'
    );
    headers.append(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    return new Response(buffer, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Error al generar Excel:', error);
    return NextResponse.json(
      { error: 'Error interno al generar el reporte Excel de Egresados.' },
      { status: 500 }
    );
  }
}
