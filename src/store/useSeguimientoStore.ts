import { create } from "zustand";

import {
  MENSAJE_ERROR_SERVICIO,
  consultarSolicitudesEstudiante,
  enviarSubsanacionApi,
} from "@/lib/mock-api";
import { CURRENT_STUDENT_SESSION } from "@/lib/mock-data";
import type { EstudianteSesion, SolicitudUNICA } from "@/lib/types";

export type Vista =
  | "idle"
  | "cargando"
  | "exito"
  | "no_encontrada"
  | "prohibido"
  | "error_servicio";

export type EstadoArchivo = "subiendo" | "listo";

export interface ArchivoAdjunto {
  id: string;
  nombre: string;
  tamano: number;
  tipo: string;
  estado: EstadoArchivo;
  progreso: number;
}

export interface ArchivoEntrante {
  nombre: string;
  tamano: number;
  tipo: string;
}

export const TAMANO_MAXIMO = 5 * 1024 * 1024;
export const TIPOS_PERMITIDOS = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export interface SeguimientoState {
  sesion: EstudianteSesion | null;
  vista: Vista;
  /** Texto actual del campo de búsqueda. */
  textoConsulta: string;
  /** Último valor consultado (usado por reintentos y mensajes). */
  consulta: string;
  solicitudes: SolicitudUNICA[];
  seleccionada: SolicitudUNICA | null;
  error: string | null;
  simularFallo: boolean;
  archivos: ArchivoAdjunto[];
  enviando: boolean;
  subsanacionEnviada: boolean;
  errorSubsanacion: string | null;
  errorValidacion: string | null;
  cargarMisTramites: () => Promise<void>;
  consultar: (entrada: string) => Promise<void>;
  reintentar: () => Promise<void>;
  limpiarFiltro: () => Promise<void>;
  seleccionarSolicitud: (codigoSolicitud: string) => void;
  volverALista: () => void;
  iniciarSesion: () => void;
  cerrarSesion: () => void;
  setTextoConsulta: (valor: string) => void;
  setErrorValidacion: (mensaje: string | null) => void;
  setSimularFallo: (valor: boolean) => void;
  agregarArchivos: (archivos: ArchivoEntrante[]) => string[];
  eliminarArchivo: (id: string) => void;
  enviarSubsanacion: () => Promise<void>;
}

/** Evita que una respuesta antigua sobrescriba una consulta más reciente. */
let consultaActual = 0;

const crearId = () =>
  `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const iniciarCarga = (
  id: string,
  set: (
    partial:
      | Partial<SeguimientoState>
      | ((state: SeguimientoState) => Partial<SeguimientoState>),
  ) => void,
  get: () => SeguimientoState,
) => {
  const temporizador = setInterval(() => {
    const archivo = get().archivos.find((item) => item.id === id);

    if (!archivo) {
      clearInterval(temporizador);
      return;
    }

    const progreso = Math.min(100, archivo.progreso + 20);
    set((state) => ({
      archivos: state.archivos.map((item) =>
        item.id === id
          ? {
              ...item,
              progreso,
              estado: progreso >= 100 ? "listo" : "subiendo",
            }
          : item,
      ),
    }));

    if (progreso >= 100) clearInterval(temporizador);
  }, 130);
};

export const useSeguimientoStore = create<SeguimientoState>()((set, get) => ({
  sesion: CURRENT_STUDENT_SESSION,
  vista: "idle",
  textoConsulta: "",
  consulta: "",
  solicitudes: [],
  seleccionada: null,
  error: null,
  simularFallo: false,
  archivos: [],
  enviando: false,
  subsanacionEnviada: false,
  errorSubsanacion: null,
  errorValidacion: null,

  cargarMisTramites: async () => {
    const sesion = get().sesion;
    if (!sesion) return;

    const solicitudId = ++consultaActual;

    set({
      vista: "cargando",
      textoConsulta: "",
      consulta: "",
      solicitudes: [],
      seleccionada: null,
      error: null,
      errorValidacion: null,
      archivos: [],
      enviando: false,
      subsanacionEnviada: false,
      errorSubsanacion: null,
    });

    const resultado = await consultarSolicitudesEstudiante("", sesion, {
      simularFallo: get().simularFallo,
    });

    if (solicitudId !== consultaActual) return;

    if (resultado.success && resultado.data) {
      set({ vista: "exito", solicitudes: resultado.data, error: null });
      return;
    }

    if (resultado.code === 404) {
      set({
        vista: "no_encontrada",
        error: resultado.error,
      });
      return;
    }

    if (resultado.code === 403) {
      set({ vista: "prohibido", error: resultado.error });
      return;
    }

    set({
      vista: "error_servicio",
      error: resultado.error ?? MENSAJE_ERROR_SERVICIO,
    });
  },

  consultar: async (entrada) => {
    const limpio = entrada.trim();
    const sesion = get().sesion;
    if (!limpio || !sesion) return;

    const solicitudId = ++consultaActual;

    set({
      vista: "cargando",
      textoConsulta: limpio,
      consulta: limpio,
      solicitudes: [],
      seleccionada: null,
      error: null,
      errorValidacion: null,
      archivos: [],
      enviando: false,
      subsanacionEnviada: false,
      errorSubsanacion: null,
    });

    const resultado = await consultarSolicitudesEstudiante(limpio, sesion, {
      simularFallo: get().simularFallo,
    });

    if (solicitudId !== consultaActual) return;

    if (resultado.success && resultado.data) {
      set({
        vista: "exito",
        solicitudes: resultado.data,
        seleccionada:
          resultado.data.length === 1 ? resultado.data[0] : null,
        error: null,
      });
      return;
    }

    if (resultado.code === 403) {
      set({ vista: "prohibido", error: resultado.error });
      return;
    }

    if (resultado.code === 404) {
      set({ vista: "no_encontrada", error: resultado.error });
      return;
    }

    set({
      vista: "error_servicio",
      error: resultado.error ?? MENSAJE_ERROR_SERVICIO,
    });
  },

  reintentar: async () => {
    const { consulta } = get();
    if (!consulta) {
      await get().cargarMisTramites();
      return;
    }
    await get().consultar(consulta);
  },

  limpiarFiltro: async () => {
    await get().cargarMisTramites();
  },

  seleccionarSolicitud: (codigoSolicitud) => {
    const solicitud = get().solicitudes.find(
      (item) => item.codigoSolicitud === codigoSolicitud,
    );

    if (!solicitud) return;

    set({
      seleccionada: solicitud,
      archivos: [],
      enviando: false,
      subsanacionEnviada: false,
      errorSubsanacion: null,
    });
  },

  volverALista: () =>
    set({
      seleccionada: null,
      archivos: [],
      enviando: false,
      subsanacionEnviada: false,
      errorSubsanacion: null,
    }),

  iniciarSesion: () => {
    consultaActual += 1;
    set({
      sesion: CURRENT_STUDENT_SESSION,
      vista: "idle",
      textoConsulta: "",
      consulta: "",
      solicitudes: [],
      seleccionada: null,
      error: null,
      errorValidacion: null,
      simularFallo: false,
      archivos: [],
      enviando: false,
      subsanacionEnviada: false,
      errorSubsanacion: null,
    });
  },

  cerrarSesion: () => {
    consultaActual += 1;
    set({
      sesion: null,
      vista: "idle",
      textoConsulta: "",
      consulta: "",
      solicitudes: [],
      seleccionada: null,
      error: null,
      errorValidacion: null,
      simularFallo: false,
      archivos: [],
      enviando: false,
      subsanacionEnviada: false,
      errorSubsanacion: null,
    });
  },

  setTextoConsulta: (valor) => set({ textoConsulta: valor }),

  setErrorValidacion: (mensaje) => set({ errorValidacion: mensaje }),

  setSimularFallo: (valor) => set({ simularFallo: valor }),

  agregarArchivos: (archivos) => {
    const rechazados: string[] = [];
    const nuevos: ArchivoAdjunto[] = [];
    const existentes = get().archivos;

    for (const archivo of archivos) {
      if (!TIPOS_PERMITIDOS.includes(archivo.tipo)) {
        rechazados.push(
          `“${archivo.nombre}”: formato no permitido. Usa PDF, JPG o PNG.`,
        );
        continue;
      }

      if (archivo.tamano > TAMANO_MAXIMO) {
        rechazados.push(`“${archivo.nombre}”: supera el límite de 5 MB.`);
        continue;
      }

      if (archivo.tamano <= 0) {
        rechazados.push(`“${archivo.nombre}”: el archivo está vacío.`);
        continue;
      }

      const duplicado =
        existentes.some((item) => item.nombre === archivo.nombre) ||
        nuevos.some((item) => item.nombre === archivo.nombre);

      if (duplicado) {
        rechazados.push(`“${archivo.nombre}”: ya fue agregado.`);
        continue;
      }

      nuevos.push({
        id: crearId(),
        nombre: archivo.nombre,
        tamano: archivo.tamano,
        tipo: archivo.tipo,
        estado: "subiendo",
        progreso: 0,
      });
    }

    if (!nuevos.length) return rechazados;

    set((state) => ({
      archivos: [...state.archivos, ...nuevos],
      errorSubsanacion: null,
    }));

    for (const archivo of nuevos) {
      iniciarCarga(archivo.id, set, get);
    }

    return rechazados;
  },

  eliminarArchivo: (id) =>
    set((state) => ({
      archivos: state.archivos.filter((archivo) => archivo.id !== id),
      errorSubsanacion: null,
    })),

  enviarSubsanacion: async () => {
    const {
      seleccionada: solicitudSeleccionada,
      sesion,
      archivos,
      enviando,
      subsanacionEnviada,
    } = get();

    if (!solicitudSeleccionada || !sesion || enviando || subsanacionEnviada) {
      return;
    }

    if (!archivos.length) {
      set({
        errorSubsanacion:
          "Adjunta al menos un archivo antes de enviar la subsanación.",
      });
      return;
    }

    if (archivos.some((archivo) => archivo.estado !== "listo")) {
      set({
        errorSubsanacion:
          "Espera a que los archivos terminen de cargarse para continuar.",
      });
      return;
    }

    set({ enviando: true, errorSubsanacion: null });

    const resultado = await enviarSubsanacionApi(
      solicitudSeleccionada.codigoSolicitud,
      sesion,
      archivos.map((archivo) => ({ nombre: archivo.nombre })),
    );

    if (get().sesion !== sesion) return;

    if (resultado.success && resultado.data?.[0]) {
      const actualizada = resultado.data[0];

      set((state) => ({
        seleccionada: actualizada,
        solicitudes: state.solicitudes.map((item) =>
          item.codigoSolicitud === actualizada.codigoSolicitud
            ? actualizada
            : item,
        ),
        enviando: false,
        subsanacionEnviada: true,
        errorSubsanacion: null,
      }));
      return;
    }

    set({
      enviando: false,
      errorSubsanacion:
        resultado.error ??
        "No se pudieron enviar los documentos. Intenta nuevamente.",
    });
  },
}));
