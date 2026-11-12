import type { EstadoSolicitud } from "@/lib/types";

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
