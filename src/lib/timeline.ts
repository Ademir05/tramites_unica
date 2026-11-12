import type { EstadoSolicitud } from "@/lib/types";

export type EstadoPaso = "completado" | "actual" | "observado" | "pendiente";

export interface PasoTimeline {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoPaso;
}

const PASOS_BASE = [
  {
    id: "registrado",
    titulo: "Registrado",
    descripcion: "Solicitud recibida en el Campus Virtual UNICA",
  },
  {
    id: "evaluacion",
    titulo: "En Evaluación",
    descripcion: "Revisión de requisitos por el área responsable",
  },
  {
    id: "firma",
    titulo: "Firma Digital",
    descripcion: "Firma y autorización del documento institucional",
  },
  {
    id: "listo",
    titulo: "Listo para Entrega",
    descripcion: "Disponible para recojo o descarga digital",
  },
] as const;

/**
 * Traduce el estado de negocio a las cuatro fases visibles del trámite.
 */
export function construirTimeline(estado: EstadoSolicitud): PasoTimeline[] {
  return PASOS_BASE.map((paso, indice) => {
    let estadoPaso: EstadoPaso = "pendiente";

    if (estado === "FINALIZADO") {
      estadoPaso = "completado";
    } else if (indice === 0) {
      estadoPaso = "completado";
    } else if (indice === 1) {
      estadoPaso =
        estado === "PENDIENTE_DOCUMENTOS"
          ? "observado"
          : estado === "FIRMA_DIGITAL"
            ? "completado"
            : "actual";
    } else if (indice === 2 && estado === "FIRMA_DIGITAL") {
      estadoPaso = "actual";
    }

    return { ...paso, estado: estadoPaso };
  });
}

/** Índice de la fase activa (u observada). */
export function indicePasoActual(pasos: PasoTimeline[]): number {
  const indice = pasos.findIndex(
    (paso) => paso.estado === "actual" || paso.estado === "observado",
  );

  if (indice >= 0) return indice;
  if (pasos.every((paso) => paso.estado === "completado")) {
    return pasos.length - 1;
  }

  return 0;
}

/** Avance estimado del trámite, en porcentaje. */
export function porcentajeAvance(pasos: PasoTimeline[]): number {
  if (!pasos.length) return 0;

  const completados = pasos.filter(
    (paso) => paso.estado === "completado",
  ).length;
  const enCurso = pasos.some((paso) => paso.estado === "actual") ? 0.5 : 0;

  return Math.round(((completados + enCurso) / pasos.length) * 100);
}
