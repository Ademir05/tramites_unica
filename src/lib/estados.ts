import type { EstadoSolicitud, SolicitudUNICA } from "@/lib/types";

export interface MetaEstado {
  etiqueta: string;
  descripcion: string;
  tono: "brand" | "warning" | "info" | "success";
}

export const META_ESTADO: Record<EstadoSolicitud, MetaEstado> = {
  EN_EVALUACION: {
    etiqueta: "En Evaluación",
    descripcion:
      "Tu solicitud está registrada y se encuentra en evaluación por el área responsable de la UNICA.",
    tono: "brand",
  },
  PENDIENTE_DOCUMENTOS: {
    etiqueta: "Pendiente de Documentos",
    descripcion:
      "Necesitamos que cargues los requisitos observados para continuar con tu trámite.",
    tono: "warning",
  },
  FIRMA_DIGITAL: {
    etiqueta: "Firma Digital",
    descripcion:
      "El documento se encuentra en la etapa de firma y autorización institucional.",
    tono: "info",
  },
  FINALIZADO: {
    etiqueta: "Finalizado",
    descripcion:
      "Tu trámite concluyó. El documento está disponible para entrega o descarga digital.",
    tono: "success",
  },
};

export interface EstadoSimulado {
  /** Indica si la URL incluyó el parámetro STATUS. */
  solicitado: boolean;
  /** Estado válido resuelto; null cuando el valor no se reconoce. */
  estado: EstadoSolicitud | null;
  /** Valor original recibido, útil para mostrar el aviso de modo demo. */
  valor: string | null;
}

const ALIAS_ESTADO: Record<string, EstadoSolicitud> = {
  EN_EVALUACION: "EN_EVALUACION",
  EVALUACION: "EN_EVALUACION",
  EN_PROCESO: "EN_EVALUACION",
  PROCESO: "EN_EVALUACION",
  PENDIENTE_DOCUMENTOS: "PENDIENTE_DOCUMENTOS",
  PENDIENTE_DE_DOCUMENTOS: "PENDIENTE_DOCUMENTOS",
  DOCUMENTOS_PENDIENTES: "PENDIENTE_DOCUMENTOS",
  PENDIENTE: "PENDIENTE_DOCUMENTOS",
  FIRMA_DIGITAL: "FIRMA_DIGITAL",
  FIRMA: "FIRMA_DIGITAL",
  FINALIZADO: "FINALIZADO",
  FINALIZADA: "FINALIZADO",
  LISTO_PARA_ENTREGA: "FINALIZADO",
  ENTREGADO: "FINALIZADO",
};

const DOCUMENTOS_PENDIENTES_DEMO = [
  "Foto de DNI legible (Ambas caras)",
  "Voucher de pago Banco de la Nación",
];

/**
 * Resuelve el query param `STATUS` usado para demostrar estados.
 * Acepta valores con comillas, espacios y alias habituales.
 */
export function parsearEstadoSimulado(
  valor?: string | string[] | null,
): EstadoSimulado {
  const original = Array.isArray(valor) ? valor[0] : valor;

  if (!original?.trim()) {
    return { solicitado: false, estado: null, valor: null };
  }

  const limpio = original
    .trim()
    .replace(/^["']|["']$/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return {
    solicitado: true,
    estado: ALIAS_ESTADO[limpio] ?? null,
    valor: original,
  };
}

/**
 * Devuelve una copia de la solicitud con el estado forzado para la demo.
 * Ajusta los datos dependientes para que el detalle sea coherente.
 */
export function aplicarEstadoSimulado(
  solicitud: SolicitudUNICA,
  estado: EstadoSolicitud,
): SolicitudUNICA {
  if (solicitud.estado === estado) return solicitud;

  const base: SolicitudUNICA = {
    ...solicitud,
    estado,
    documentosPendientes: undefined,
    documentosRecibidos: undefined,
  };

  switch (estado) {
    case "PENDIENTE_DOCUMENTOS":
      return {
        ...base,
        siguientePaso: "Subsanar los requisitos observados",
        documentosPendientes: [...DOCUMENTOS_PENDIENTES_DEMO],
      };
    case "FIRMA_DIGITAL":
      return {
        ...base,
        siguientePaso: "Firma digital y autorización del documento",
      };
    case "FINALIZADO":
      return {
        ...base,
        siguientePaso:
          "Constancia disponible para recojo en ventanilla 3 o descarga digital",
      };
    default:
      return {
        ...base,
        siguientePaso: "Evaluación de requisitos por el área responsable",
      };
  }
}
