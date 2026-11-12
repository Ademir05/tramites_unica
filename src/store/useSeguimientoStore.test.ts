import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  MENSAJE_ACCESO_DENEGADO,
  MENSAJE_ERROR_SERVICIO,
  MENSAJE_NO_ENCONTRADO,
  resetMockData,
} from "@/lib/mock-api";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

const archivoValido = (nombre = "dni.pdf") => ({
  nombre,
  tamano: 1024,
  tipo: "application/pdf",
});

beforeEach(() => {
  resetMockData();
  useSeguimientoStore.getState().iniciarSesion();
  useSeguimientoStore.setState({ simularFallo: false });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("sesión y listado automático · HU-01", () => {
  it("inicia con la sesión de la estudiante y sin datos precargados", () => {
    const estado = useSeguimientoStore.getState();

    expect(estado.sesion?.codigoUniversitario).toBe("20221045");
    expect(estado.sesion?.nombreCompleto).toBe("Ana Lucia Mendoza");
    expect(estado.vista).toBe("idle");
    expect(estado.solicitudes).toEqual([]);
    expect(estado.seleccionada).toBeNull();
  });

  it("carga solo los trámites de la cuenta al entrar al módulo", async () => {
    await useSeguimientoStore.getState().cargarMisTramites();

    const estado = useSeguimientoStore.getState();

    expect(estado.vista).toBe("exito");
    expect(estado.solicitudes).toHaveLength(4);
    expect(
      estado.solicitudes.every(
        (item) => item.estudianteId === estado.sesion?.estudianteId,
      ),
    ).toBe(true);
    expect(estado.seleccionada).toBeNull();
    expect(estado.error).toBeNull();
  });

  it("consulta un código propio y selecciona el detalle", async () => {
    await useSeguimientoStore.getState().consultar("SOL-UNICA-2026-001");

    const estado = useSeguimientoStore.getState();

    expect(estado.vista).toBe("exito");
    expect(estado.solicitudes).toHaveLength(1);
    expect(estado.seleccionada?.codigoSolicitud).toBe("SOL-UNICA-2026-001");
    expect(estado.seleccionada?.estado).toBe("EN_EVALUACION");
    expect(estado.textoConsulta).toBe("SOL-UNICA-2026-001");
    expect(estado.error).toBeNull();
  });

  it("filtra por tipo de trámite y no selecciona si hay varias coincidencias", async () => {
    await useSeguimientoStore.getState().consultar("Certificado");

    const estado = useSeguimientoStore.getState();

    expect(estado.vista).toBe("exito");
    expect(estado.solicitudes).toHaveLength(2);
    expect(estado.seleccionada).toBeNull();
    expect(
      estado.solicitudes.every((item) =>
        item.tipoTramite.includes("Certificado"),
      ),
    ).toBe(true);
  });

  it("bloquea la solicitud ajena con el mensaje exacto y sin datos", async () => {
    await useSeguimientoStore.getState().consultar("SOL-UNICA-2026-002");

    const estado = useSeguimientoStore.getState();

    expect(estado.vista).toBe("prohibido");
    expect(estado.error).toBe(MENSAJE_ACCESO_DENEGADO);
    expect(estado.solicitudes).toEqual([]);
    expect(estado.seleccionada).toBeNull();
  });

  it("muestra el estado no encontrado con el mensaje exacto", async () => {
    await useSeguimientoStore.getState().consultar("SOL-000-XXXX");

    const estado = useSeguimientoStore.getState();

    expect(estado.vista).toBe("no_encontrada");
    expect(estado.error).toBe(MENSAJE_NO_ENCONTRADO);
    expect(estado.solicitudes).toEqual([]);
  });

  it("muestra el error de servicio y se recupera con Reintentar", async () => {
    useSeguimientoStore.setState({ simularFallo: true });

    await useSeguimientoStore.getState().consultar("SOL-UNICA-2026-001");

    expect(useSeguimientoStore.getState().vista).toBe("error_servicio");
    expect(useSeguimientoStore.getState().error).toBe(MENSAJE_ERROR_SERVICIO);

    useSeguimientoStore.setState({ simularFallo: false });
    await useSeguimientoStore.getState().reintentar();

    expect(useSeguimientoStore.getState().vista).toBe("exito");
    expect(useSeguimientoStore.getState().seleccionada?.codigoSolicitud).toBe(
      "SOL-UNICA-2026-001",
    );
  });

  it("limpia el filtro y recupera la lista completa", async () => {
    await useSeguimientoStore.getState().consultar("SOL-UNICA-2026-003");
    expect(useSeguimientoStore.getState().solicitudes).toHaveLength(1);

    await useSeguimientoStore.getState().limpiarFiltro();

    const estado = useSeguimientoStore.getState();
    expect(estado.vista).toBe("exito");
    expect(estado.consulta).toBe("");
    expect(estado.solicitudes).toHaveLength(4);
  });
});

describe("selección y carga de documentos · HU-03", () => {
  it("selecciona una solicitud pendiente y conserva sus requisitos", async () => {
    await useSeguimientoStore.getState().cargarMisTramites();
    useSeguimientoStore
      .getState()
      .seleccionarSolicitud("SOL-UNICA-2026-003");

    const estado = useSeguimientoStore.getState();

    expect(estado.seleccionada?.estado).toBe("PENDIENTE_DOCUMENTOS");
    expect(estado.seleccionada?.documentosPendientes).toEqual([
      "Foto de DNI legible (Ambas caras)",
      "Voucher de pago Banco de la Nación",
    ]);
  });

  it("valida formato, tamaño y duplicados", () => {
    vi.useFakeTimers();
    const agregar = useSeguimientoStore.getState().agregarArchivos;

    const rechazados = agregar([
      { nombre: "notas.txt", tamano: 1024, tipo: "text/plain" },
      {
        nombre: "enorme.pdf",
        tamano: 6 * 1024 * 1024,
        tipo: "application/pdf",
      },
      { nombre: "vacio.pdf", tamano: 0, tipo: "application/pdf" },
    ]);

    expect(rechazados).toHaveLength(3);
    expect(rechazados[0]).toContain("formato no permitido");
    expect(rechazados[1]).toContain("5 MB");
    expect(rechazados[2]).toContain("vacío");

    agregar([archivoValido()]);
    const duplicado = agregar([archivoValido()]);

    expect(duplicado[0]).toContain("ya fue agregado");
    vi.advanceTimersByTime(1000);
  });

  it("simula el progreso hasta marcar el archivo como listo", () => {
    vi.useFakeTimers();

    const rechazados = useSeguimientoStore
      .getState()
      .agregarArchivos([archivoValido("voucher.png")]);

    expect(rechazados).toEqual([]);
    expect(useSeguimientoStore.getState().archivos[0].estado).toBe("subiendo");
    expect(useSeguimientoStore.getState().archivos[0].progreso).toBe(0);

    vi.advanceTimersByTime(1000);

    const archivo = useSeguimientoStore.getState().archivos[0];
    expect(archivo.estado).toBe("listo");
    expect(archivo.progreso).toBe(100);
  });

  it("elimina un archivo adjunto", () => {
    vi.useFakeTimers();
    useSeguimientoStore.getState().agregarArchivos([archivoValido()]);
    vi.advanceTimersByTime(1000);

    const id = useSeguimientoStore.getState().archivos[0].id;

    useSeguimientoStore.getState().eliminarArchivo(id);

    expect(useSeguimientoStore.getState().archivos).toEqual([]);
  });

  it("exige adjuntos antes de enviar la subsanación", async () => {
    await useSeguimientoStore.getState().cargarMisTramites();
    useSeguimientoStore
      .getState()
      .seleccionarSolicitud("SOL-UNICA-2026-003");
    await useSeguimientoStore.getState().enviarSubsanacion();

    expect(useSeguimientoStore.getState().subsanacionEnviada).toBe(false);
    expect(useSeguimientoStore.getState().errorSubsanacion).toContain(
      "al menos un archivo",
    );
  });

  it("envía la subsanación y actualiza la lista y el detalle", async () => {
    await useSeguimientoStore.getState().cargarMisTramites();
    useSeguimientoStore
      .getState()
      .seleccionarSolicitud("SOL-UNICA-2026-003");

    vi.useFakeTimers();
    useSeguimientoStore
      .getState()
      .agregarArchivos([archivoValido("dni-ampliado.pdf")]);
    vi.advanceTimersByTime(1000);
    vi.useRealTimers();

    expect(useSeguimientoStore.getState().archivos[0].estado).toBe("listo");

    await useSeguimientoStore.getState().enviarSubsanacion();

    const estado = useSeguimientoStore.getState();
    const enLista = estado.solicitudes.find(
      (item) => item.codigoSolicitud === "SOL-UNICA-2026-003",
    );

    expect(estado.enviando).toBe(false);
    expect(estado.subsanacionEnviada).toBe(true);
    expect(estado.seleccionada?.estado).toBe("EN_EVALUACION");
    expect(estado.seleccionada?.documentosPendientes).toBeUndefined();
    expect(estado.seleccionada?.documentosRecibidos).toEqual([
      "dni-ampliado.pdf",
    ]);
    expect(enLista?.estado).toBe("EN_EVALUACION");
    expect(estado.errorSubsanacion).toBeNull();
  });
});

describe("cierre de sesión", () => {
  it("limpia los datos y bloquea el acceso al módulo", async () => {
    await useSeguimientoStore.getState().cargarMisTramites();
    expect(useSeguimientoStore.getState().solicitudes).toHaveLength(4);

    useSeguimientoStore.getState().cerrarSesion();

    const estado = useSeguimientoStore.getState();
    expect(estado.sesion).toBeNull();
    expect(estado.vista).toBe("idle");
    expect(estado.solicitudes).toEqual([]);
    expect(estado.seleccionada).toBeNull();
  });
});
