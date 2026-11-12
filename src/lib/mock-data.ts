import type { EstudianteSesion, SolicitudUNICA } from "@/lib/types";

/** Sesión activa simulada del Campus Virtual UNICA. */
export const CURRENT_STUDENT_SESSION: EstudianteSesion = {
  estudianteId: "20221045",
  nombreCompleto: "Ana Lucia Mendoza",
  codigoUniversitario: "20221045",
  facultad: "Ingeniería de Sistemas - UNICA",
  tokenSimulado: "Bearer jwt-session-token-unica-20221045",
};

/** Identificador del estudiante ajeno usado en las pruebas de seguridad. */
export const ESTUDIANTE_AJENO_ID = "20219999";

/**
 * Base de datos ficticia del sistema.
 * Incluye trámites de la estudiante en sesión y de otro estudiante para
 * validar el aislamiento por `estudianteId` (403 Forbidden).
 */
export const MOCK_SOLICITUDES_DATABASE: SolicitudUNICA[] = [
  {
    codigoSolicitud: "SOL-UNICA-2026-001",
    estudianteId: "20221045",
    tipoTramite: "Constancia de Estudios 2026-II",
    estado: "EN_EVALUACION",
    fechaRegistro: "2026-11-10 08:30",
    fechaUltimaActualizacion: "2026-11-12 11:20",
    areaResponsable: "Oficina de Registro y Asuntos Académicos",
    siguientePaso: "Verificación de requisitos de matrícula",
  },
  {
    codigoSolicitud: "SOL-UNICA-2026-002",
    estudianteId: ESTUDIANTE_AJENO_ID,
    tipoTramite: "Certificado de Notas",
    estado: "EN_EVALUACION",
    fechaRegistro: "2026-11-10 10:00",
    fechaUltimaActualizacion: "2026-11-12 09:00",
    areaResponsable: "Oficina de Registro y Asuntos Académicos",
    siguientePaso: "Evaluación de requisitos",
  },
  {
    codigoSolicitud: "SOL-UNICA-2026-003",
    estudianteId: "20221045",
    tipoTramite: "Certificado de Notas",
    estado: "PENDIENTE_DOCUMENTOS",
    fechaRegistro: "2026-11-09 14:00",
    fechaUltimaActualizacion: "2026-11-11 09:15",
    areaResponsable: "Mesa de Partes Virtual UNICA",
    siguientePaso: "Subsanar foto de DNI y voucher",
    documentosPendientes: [
      "Foto de DNI legible (Ambas caras)",
      "Voucher de pago Banco de la Nación",
    ],
  },
  {
    codigoSolicitud: "SOL-UNICA-2026-004",
    estudianteId: "20221045",
    tipoTramite: "Certificado de Bachillerato",
    estado: "FIRMA_DIGITAL",
    fechaRegistro: "2026-11-07 11:00",
    fechaUltimaActualizacion: "2026-11-12 10:05",
    areaResponsable: "Oficina de Registro y Asuntos Académicos",
    siguientePaso: "Firma digital y autorización del documento",
  },
  {
    codigoSolicitud: "SOL-UNICA-2026-005",
    estudianteId: "20221045",
    tipoTramite: "Constancia de Matrícula 2026-I",
    estado: "FINALIZADO",
    fechaRegistro: "2026-11-04 09:40",
    fechaUltimaActualizacion: "2026-11-11 15:30",
    areaResponsable: "Oficina de Registro y Asuntos Académicos",
    siguientePaso:
      "Constancia disponible para recojo en ventanilla 3 o descarga digital",
  },
  {
    codigoSolicitud: "SOL-UNICA-2026-099",
    estudianteId: ESTUDIANTE_AJENO_ID,
    tipoTramite: "Constancia de Egresado",
    estado: "FINALIZADO",
    fechaRegistro: "2026-11-01 10:00",
    fechaUltimaActualizacion: "2026-11-05 16:00",
    areaResponsable: "Decanato de Facultad",
    siguientePaso: "Entrega física de documento",
  },
];

/** Casos sugeridos para la demostración en la Sprint Review. */
export const CASOS_DEMO = [
  {
    etiqueta: "En evaluación",
    valor: "SOL-UNICA-2026-001",
    descripcion: "Trámite propio en curso",
    tono: "orange" as const,
  },
  {
    etiqueta: "Documentos",
    valor: "SOL-UNICA-2026-003",
    descripcion: "Requiere subsanación",
    tono: "amber" as const,
  },
  {
    etiqueta: "Firma digital",
    valor: "SOL-UNICA-2026-004",
    descripcion: "Pendiente de firma",
    tono: "sky" as const,
  },
  {
    etiqueta: "Finalizado",
    valor: "SOL-UNICA-2026-005",
    descripcion: "Listo para entrega",
    tono: "emerald" as const,
  },
  {
    etiqueta: "Solicitud ajena",
    valor: "SOL-UNICA-2026-002",
    descripcion: "Prueba de seguridad 403",
    tono: "red" as const,
  },
  {
    etiqueta: "Buscar por tipo",
    valor: "Certificado",
    descripcion: "Filtro por tipo de trámite",
    tono: "slate" as const,
  },
  {
    etiqueta: "Código inexistente",
    valor: "SOL-000-XXXX",
    descripcion: "Caso 404",
    tono: "slate" as const,
  },
];
