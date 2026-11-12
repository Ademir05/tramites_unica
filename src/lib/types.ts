/** Sesión simulada del Campus Virtual UNICA. */
export interface EstudianteSesion {
  estudianteId: string;
  nombreCompleto: string;
  codigoUniversitario: string;
  facultad: string;
  tokenSimulado: string;
}

/** Estados del flujo de trámites de la UNICA. */
export type EstadoSolicitud =
  | "EN_EVALUACION"
  | "PENDIENTE_DOCUMENTOS"
  | "FIRMA_DIGITAL"
  | "FINALIZADO";

/** Contrato de una solicitud académica de la UNICA. */
export interface SolicitudUNICA {
  codigoSolicitud: string;
  /** Clave de aislamiento: solo el titular puede consultar la solicitud. */
  estudianteId: string;
  tipoTramite: string;
  estado: EstadoSolicitud;
  /** Formato: YYYY-MM-DD HH:mm */
  fechaRegistro: string;
  /** Formato: YYYY-MM-DD HH:mm */
  fechaUltimaActualizacion: string;
  areaResponsable: string;
  siguientePaso: string;
  documentosPendientes?: string[];
  /** Extensión del prototipo para evidenciar la subsanación. */
  documentosRecibidos?: string[];
}
