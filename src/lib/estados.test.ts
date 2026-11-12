import { describe, expect, it } from "vitest";

import { aplicarEstadoSimulado, parsearEstadoSimulado } from "@/lib/estados";
import { MOCK_SOLICITUDES_DATABASE } from "@/lib/mock-data";

const solicitudBase = MOCK_SOLICITUDES_DATABASE[0];

describe("parsearEstadoSimulado", () => {
  it("acepta el estado en mayúsculas y con comillas", () => {
    expect(parsearEstadoSimulado('"FINALIZADO"')).toEqual({
      solicitado: true,
      estado: "FINALIZADO",
      valor: '"FINALIZADO"',
    });
  });

  it("normaliza minúsculas, espacios y tildes", () => {
    expect(parsearEstadoSimulado("pendiente de documentos").estado).toBe(
      "PENDIENTE_DOCUMENTOS",
    );
    expect(parsearEstadoSimulado("En Evaluación").estado).toBe("EN_EVALUACION");
    expect(parsearEstadoSimulado("firma-digital").estado).toBe("FIRMA_DIGITAL");
  });

  it("mantiene alias de estados anteriores", () => {
    expect(parsearEstadoSimulado("EN_PROCESO").estado).toBe("EN_EVALUACION");
    expect(parsearEstadoSimulado("listo_para_entrega").estado).toBe(
      "FINALIZADO",
    );
  });

  it("ignora un valor desconocido", () => {
    expect(parsearEstadoSimulado("NO_EXISTE")).toEqual({
      solicitado: true,
      estado: null,
      valor: "NO_EXISTE",
    });
  });

  it("no marca la simulación cuando el parámetro está vacío", () => {
    expect(parsearEstadoSimulado(undefined)).toEqual({
      solicitado: false,
      estado: null,
      valor: null,
    });
  });
});

describe("aplicarEstadoSimulado", () => {
  it("devuelve la misma solicitud si el estado coincide", () => {
    expect(aplicarEstadoSimulado(solicitudBase, "EN_EVALUACION")).toBe(
      solicitudBase,
    );
  });

  it("genera requisitos y siguiente paso para PENDIENTE_DOCUMENTOS", () => {
    const simulada = aplicarEstadoSimulado(solicitudBase, "PENDIENTE_DOCUMENTOS");

    expect(simulada.estado).toBe("PENDIENTE_DOCUMENTOS");
    expect(simulada.documentosPendientes).toHaveLength(2);
    expect(simulada.documentosRecibidos).toBeUndefined();
    expect(simulada.siguientePaso).toContain("Subsanar");
  });

  it("limpia documentos al simular FIRMA_DIGITAL o FINALIZADO", () => {
    const firma = aplicarEstadoSimulado(solicitudBase, "FIRMA_DIGITAL");
    const finalizado = aplicarEstadoSimulado(solicitudBase, "FINALIZADO");

    expect(firma.documentosPendientes).toBeUndefined();
    expect(firma.documentosRecibidos).toBeUndefined();
    expect(firma.siguientePaso).toContain("Firma digital");
    expect(finalizado.documentosPendientes).toBeUndefined();
    expect(finalizado.siguientePaso).toContain("ventanilla 3");
  });

  it("no modifica la solicitud original", () => {
    const simulada = aplicarEstadoSimulado(solicitudBase, "FINALIZADO");

    expect(simulada).not.toBe(solicitudBase);
    expect(solicitudBase.estado).toBe("EN_EVALUACION");
  });
});
