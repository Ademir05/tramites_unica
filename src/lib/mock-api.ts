import { formatearFechaApi } from "@/lib/format";
import { MOCK_SOLICITUDES_DATABASE } from "@/lib/mock-data";
import type { EstudianteSesion, SolicitudUNICA } from "@/lib/types";

export const MENSAJE_ACCESO_DENEGADO =
  "Acceso restringido: Esta solicitud no pertenece a tu cuenta institucional";

export const MENSAJE_NO_ENCONTRADO =
  "No se encontró ninguna solicitud asociada a tu cuenta con ese código";

export const MENSAJE_ERROR_SERVICIO =
  "Servicio no disponible momentáneamente.";

/** Latencia simulada de red. En pruebas se elimina para no ralentizar la suite. */
const LATENCIA_CONSULTA = process.env.NODE_ENV === "test" ? 0 : 800;
const LATENCIA_SUBSANACION = process.env.NODE_ENV === "test" ? 0 : 1200;

export interface ResultadoConsulta {
  success: boolean;
  data?: SolicitudUNICA[];
  error?: string;
  code?: number;
}

export interface OpcionesConsulta {
  simularFallo?: boolean;
  latencia?: number;
}

export interface OpcionesSubsanacion {
  simularFallo?: boolean;
  latencia?: number;
  ahora?: Date;
}

export interface DocumentoRecibido {
  nombre: string;
}

const esperar = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Copia mutable de la base ficticia: refleja cambios durante la sesión. */
const solicitudesRuntime: SolicitudUNICA[] = structuredClone(
  MOCK_SOLICITUDES_DATABASE,
);

const normalizar = (valor: string) =>
  valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const ordenarPorActualizacion = (solicitudes: SolicitudUNICA[]) =>
  [...solicitudes].sort((a, b) =>
    b.fechaUltimaActualizacion.localeCompare(a.fechaUltimaActualizacion),
  );

function clonar(solicitud: SolicitudUNICA): SolicitudUNICA {
  return {
    ...solicitud,
    documentosPendientes: solicitud.documentosPendientes
      ? [...solicitud.documentosPendientes]
      : undefined,
    documentosRecibidos: solicitud.documentosRecibidos
      ? [...solicitud.documentosRecibidos]
      : undefined,
  };
}

/**
 * Consulta segura de solicitudes:
 * - Sin parámetro devuelve únicamente los trámites del estudiante en sesión.
 * - Un código de otro estudiante devuelve 403 sin exponer datos.
 * - Un código desconocido devuelve 404.
 * - Permite filtrar por código parcial o tipo de trámite.
 */
export async function consultarSolicitudesEstudiante(
  codigoConsulta: string,
  session: EstudianteSesion,
  opciones: OpcionesConsulta = {},
): Promise<ResultadoConsulta> {
  const latencia = opciones.latencia ?? LATENCIA_CONSULTA;
  if (latencia > 0) await esperar(latencia);

  if (opciones.simularFallo) {
    return {
      success: false,
      error: MENSAJE_ERROR_SERVICIO,
      code: 500,
    };
  }

  if (!session?.estudianteId) {
    return {
      success: false,
      error: "La sesión del Campus Virtual no es válida.",
      code: 401,
    };
  }

  const propias = solicitudesRuntime.filter(
    (solicitud) => solicitud.estudianteId === session.estudianteId,
  );
  const consulta = codigoConsulta.trim();

  if (!consulta) {
    return {
      success: true,
      data: ordenarPorActualizacion(propias).map(clonar),
      code: 200,
    };
  }

  const codigoNormalizado = consulta.toUpperCase();
  const existente = solicitudesRuntime.find(
    (solicitud) => solicitud.codigoSolicitud.toUpperCase() === codigoNormalizado,
  );

  // Control de acceso: el código existe, pero pertenece a otra cuenta.
  if (existente && existente.estudianteId !== session.estudianteId) {
    return {
      success: false,
      error: MENSAJE_ACCESO_DENEGADO,
      code: 403,
    };
  }

  if (existente) {
    return { success: true, data: [clonar(existente)], code: 200 };
  }

  const termino = normalizar(consulta);
  const coincidencias = ordenarPorActualizacion(
    propias.filter(
      (solicitud) =>
        normalizar(solicitud.codigoSolicitud).includes(termino) ||
        normalizar(solicitud.tipoTramite).includes(termino),
    ),
  );

  if (coincidencias.length === 0) {
    return {
      success: false,
      error: MENSAJE_NO_ENCONTRADO,
      code: 404,
    };
  }

  return { success: true, data: coincidencias.map(clonar), code: 200 };
}

/**
 * Registra la subsanación de una solicitud propia.
 * Valida la titularidad antes de modificar cualquier dato.
 */
export async function enviarSubsanacionApi(
  codigoSolicitud: string,
  session: EstudianteSesion,
  documentos: DocumentoRecibido[],
  opciones: OpcionesSubsanacion = {},
): Promise<ResultadoConsulta> {
  const latencia = opciones.latencia ?? LATENCIA_SUBSANACION;
  if (latencia > 0) await esperar(latencia);

  if (opciones.simularFallo) {
    return {
      success: false,
      error: MENSAJE_ERROR_SERVICIO,
      code: 500,
    };
  }

  if (!session?.estudianteId) {
    return {
      success: false,
      error: "La sesión del Campus Virtual no es válida.",
      code: 401,
    };
  }

  const indice = solicitudesRuntime.findIndex(
    (solicitud) =>
      solicitud.codigoSolicitud.toUpperCase() ===
      codigoSolicitud.trim().toUpperCase(),
  );

  if (indice === -1) {
    return {
      success: false,
      error: MENSAJE_NO_ENCONTRADO,
      code: 404,
    };
  }

  const solicitud = solicitudesRuntime[indice];

  if (solicitud.estudianteId !== session.estudianteId) {
    return {
      success: false,
      error: MENSAJE_ACCESO_DENEGADO,
      code: 403,
    };
  }

  const actualizada: SolicitudUNICA = {
    ...solicitud,
    estado: "EN_EVALUACION",
    fechaUltimaActualizacion: formatearFechaApi(opciones.ahora ?? new Date()),
    siguientePaso:
      "Revisión de la documentación adjunta por la Mesa de Partes Virtual UNICA",
    documentosPendientes: undefined,
    documentosRecibidos: documentos.map((documento) => documento.nombre),
  };

  solicitudesRuntime[indice] = actualizada;

  return { success: true, data: [clonar(actualizada)], code: 200 };
}

/** Restaura la base ficticia. Utilizado por las pruebas automatizadas. */
export function resetMockData(): void {
  solicitudesRuntime.splice(0, solicitudesRuntime.length);
  solicitudesRuntime.push(...structuredClone(MOCK_SOLICITUDES_DATABASE));
}
