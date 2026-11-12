import { beforeEach, describe, expect, it } from "vitest";

import {
  MENSAJE_ACCESO_DENEGADO,
  MENSAJE_ERROR_SERVICIO,
  MENSAJE_NO_ENCONTRADO,
  consultarSolicitudesEstudiante,
  enviarSubsanacionApi,
  resetMockData,
} from "@/lib/mock-api";
import { CURRENT_STUDENT_SESSION } from "@/lib/mock-data";

const sesion = CURRENT_STUDENT_SESSION;

beforeEach(() => {
  resetMockData();
});

describe("consultarSolicitudesEstudiante · HU-01", () => {
  it("lista automáticamente solo los trámites del estudiante en sesión", async () => {
    const resultado = await consultarSolicitudesEstudiante("", sesion);

    expect(resultado.success).toBe(true);
    expect(resultado.code).toBe(200);
    expect(resultado.data).toHaveLength(4);
    expect(resultado.data?.every((item) => item.estudianteId === sesion.estudianteId)).toBe(true);
    expect(resultado.data?.map((item) => item.codigoSolicitud)).not.toContain(
      "SOL-UNICA-2026-002",
    );
    expect(resultado.data?.map((item) => item.codigoSolicitud)).not.toContain(
      "SOL-UNICA-2026-099",
    );
  });

  it("devuelve una solicitud propia al consultar su código", async () => {
    const resultado = await consultarSolicitudesEstudiante(
      "SOL-UNICA-2026-001",
      sesion,
    );

    expect(resultado.success).toBe(true);
    expect(resultado.data?.[0].codigoSolicitud).toBe("SOL-UNICA-2026-001");
    expect(resultado.data?.[0].estado).toBe("EN_EVALUACION");
    expect(resultado.data?.[0].areaResponsable).toBe(
      "Oficina de Registro y Asuntos Académicos",
    );
  });

  it("normaliza mayúsculas y espacios del código", async () => {
    const resultado = await consultarSolicitudesEstudiante(
      "  sol-unica-2026-003  ",
      sesion,
    );

    expect(resultado.data?.[0].codigoSolicitud).toBe("SOL-UNICA-2026-003");
    expect(resultado.data?.[0].estado).toBe("PENDIENTE_DOCUMENTOS");
  });

  it("permite buscar por tipo de trámite sin incluir solicitudes ajenas", async () => {
    const resultado = await consultarSolicitudesEstudiante("Certificado", sesion);

    expect(resultado.success).toBe(true);
    expect(resultado.data).toHaveLength(2);
    expect(resultado.data?.map((item) => item.codigoSolicitud).sort()).toEqual([
      "SOL-UNICA-2026-003",
      "SOL-UNICA-2026-004",
    ]);
    expect(resultado.data?.every((item) => item.estudianteId === sesion.estudianteId)).toBe(true);
  });

  it("bloquea con 403 exacto el código de otro estudiante", async () => {
    const resultado = await consultarSolicitudesEstudiante(
      "SOL-UNICA-2026-002",
      sesion,
    );

    expect(resultado.success).toBe(false);
    expect(resultado.code).toBe(403);
    expect(resultado.error).toBe(MENSAJE_ACCESO_DENEGADO);
    expect(resultado.data).toBeUndefined();
  });

  it("bloquea también el otro trámite ajeno de la base ficticia", async () => {
    const resultado = await consultarSolicitudesEstudiante(
      "SOL-UNICA-2026-099",
      sesion,
    );

    expect(resultado.code).toBe(403);
    expect(resultado.data).toBeUndefined();
  });

  it("responde 404 con el mensaje exacto para un código inexistente", async () => {
    const resultado = await consultarSolicitudesEstudiante(
      "SOL-000-XXXX",
      sesion,
    );

    expect(resultado.success).toBe(false);
    expect(resultado.code).toBe(404);
    expect(resultado.error).toBe(MENSAJE_NO_ENCONTRADO);
  });

  it("responde 500 cuando se simula la caída del servicio", async () => {
    const resultado = await consultarSolicitudesEstudiante("", sesion, {
      simularFallo: true,
    });

    expect(resultado.success).toBe(false);
    expect(resultado.code).toBe(500);
    expect(resultado.error).toBe(MENSAJE_ERROR_SERVICIO);
  });

  it("no expone la referencia interna de los datos ficticios", async () => {
    const primera = await consultarSolicitudesEstudiante("", sesion);
    primera.data?.[0].documentosPendientes?.push("Archivo alterado.pdf");

    const segunda = await consultarSolicitudesEstudiante("", sesion);

    expect(
      segunda.data?.some((item) =>
        item.documentosPendientes?.includes("Archivo alterado.pdf"),
      ),
    ).toBe(false);
  });
});

describe("enviarSubsanacionApi · HU-03 / HU-04", () => {
  it("registra los documentos y devuelve el trámite propio a evaluación", async () => {
    const ahora = new Date(2026, 10, 12, 11, 45);

    const resultado = await enviarSubsanacionApi(
      "SOL-UNICA-2026-003",
      sesion,
      [{ nombre: "dni.pdf" }, { nombre: "voucher.png" }],
      { ahora },
    );

    const actualizada = resultado.data?.[0];

    expect(resultado.success).toBe(true);
    expect(actualizada?.estado).toBe("EN_EVALUACION");
    expect(actualizada?.documentosPendientes).toBeUndefined();
    expect(actualizada?.documentosRecibidos).toEqual([
      "dni.pdf",
      "voucher.png",
    ]);
    expect(actualizada?.fechaUltimaActualizacion).toBe("2026-11-12 11:45");
  });

  it("persiste el cambio para consultas posteriores", async () => {
    await enviarSubsanacionApi("SOL-UNICA-2026-003", sesion, [
      { nombre: "dni.pdf" },
    ]);

    const resultado = await consultarSolicitudesEstudiante(
      "SOL-UNICA-2026-003",
      sesion,
    );

    expect(resultado.data?.[0].estado).toBe("EN_EVALUACION");
    expect(resultado.data?.[0].documentosRecibidos).toEqual(["dni.pdf"]);
  });

  it("rechaza la subsanación de una solicitud ajena con 403", async () => {
    const resultado = await enviarSubsanacionApi(
      "SOL-UNICA-2026-002",
      sesion,
      [{ nombre: "dni.pdf" }],
    );

    expect(resultado.code).toBe(403);
    expect(resultado.error).toBe(MENSAJE_ACCESO_DENEGADO);
  });

  it("rechaza la subsanación de un código inexistente", async () => {
    const resultado = await enviarSubsanacionApi(
      "SOL-000-XXXX",
      sesion,
      [{ nombre: "dni.pdf" }],
    );

    expect(resultado.code).toBe(404);
    expect(resultado.error).toBe(MENSAJE_NO_ENCONTRADO);
  });
});
