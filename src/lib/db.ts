import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Instancias globales singleton
let prismaInstance: PrismaClient | null = null;
let pgPoolInstance: Pool | null = null;

// Obtener el cliente de prisma inicializado de manera perezosa (Lazy)
function getPrismaClient(): PrismaClient | null {
  const isDbConfigured = process.env.DATABASE_URL && 
                         !process.env.DATABASE_URL.includes("localhost:51213") &&
                         process.env.DATABASE_URL !== "";

  if (!isDbConfigured) {
    return null;
  }

  if (!prismaInstance) {
    try {
      pgPoolInstance = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes("supabase") || process.env.DATABASE_URL?.includes("neon") 
          ? { rejectUnauthorized: false } 
          : undefined
      });
      const adapter = new PrismaPg(pgPoolInstance);
      prismaInstance = new PrismaClient({ adapter });
    } catch (error) {
      console.error("Error al inicializar Prisma Client con adaptador pg:", error);
      return null;
    }
  }

  return prismaInstance;
}

// Ruta del archivo de base de datos mock local
const MOCK_FILE_PATH = path.join(process.cwd(), 'src/data/responses.json');

export interface EncuestaRespuesta {
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

// Asegurarse de que el archivo mock y carpeta existan inicialmente vacíos para datos reales
function ensureMockFile() {
  const dir = path.dirname(MOCK_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(MOCK_FILE_PATH)) {
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

export const db = {
  // Guarda una respuesta
  async saveResponse(data: {
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
  }): Promise<EncuestaRespuesta> {
    const prismaClient = getPrismaClient();

    if (prismaClient) {
      try {
        const res = await prismaClient.encuestaRespuesta.create({
          data: {
            nombres: data.nombres,
            apellidos: data.apellidos,
            dni: data.dni,
            correo: data.correo,
            carrera: data.carrera,
            ano_graduacion: data.ano_graduacion,
            nacionalidad: data.nacionalidad,
            estudios_posgrado: data.estudios_posgrado,
            empleado_o_negocio: data.empleado_o_negocio,
            campo_estudio: data.campo_estudio
          },
        });
        return res as EncuestaRespuesta;
      } catch (error) {
        console.error("Error al guardar en base de datos. Usando fallback JSON local:", error);
      }
    }

    // Fallback JSON local
    ensureMockFile();
    try {
      const fileContent = fs.readFileSync(MOCK_FILE_PATH, 'utf-8');
      const list: EncuestaRespuesta[] = JSON.parse(fileContent);
      const newRecord: EncuestaRespuesta = {
        id: "alm-" + Math.random().toString(36).substring(2, 8) + "-" + Date.now(),
        fecha_creacion: new Date(),
        nombres: data.nombres,
        apellidos: data.apellidos,
        dni: data.dni,
        correo: data.correo,
        carrera: data.carrera,
        ano_graduacion: data.ano_graduacion,
        nacionalidad: data.nacionalidad,
        estudios_posgrado: data.estudios_posgrado,
        empleado_o_negocio: data.empleado_o_negocio,
        campo_estudio: data.campo_estudio
      };
      list.unshift(newRecord);
      fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
      return newRecord;
    } catch (e) {
      console.error("Error al escribir en archivo JSON mock:", e);
      throw e;
    }
  },

  // Obtiene todas las respuestas
  async getAllResponses(): Promise<EncuestaRespuesta[]> {
    const prismaClient = getPrismaClient();

    if (prismaClient) {
      try {
        const list = await prismaClient.encuestaRespuesta.findMany({
          orderBy: {
            fecha_creacion: 'desc',
          },
        });
        return list as EncuestaRespuesta[];
      } catch (error) {
        console.error("Error al leer de base de datos. Usando fallback JSON local:", error);
      }
    }

    // Fallback JSON local
    ensureMockFile();
    try {
      const fileContent = fs.readFileSync(MOCK_FILE_PATH, 'utf-8');
      const list: any[] = JSON.parse(fileContent);
      return list.map(item => ({
        ...item,
        fecha_creacion: new Date(item.fecha_creacion)
      }));
    } catch (e) {
      console.error("Error al leer archivo JSON mock:", e);
      return [];
    }
  }
};
