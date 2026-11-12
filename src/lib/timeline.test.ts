import { describe, expect, it } from "vitest";

import {
  construirTimeline,
  indicePasoActual,
  porcentajeAvance,
} from "@/lib/timeline";

describe("timeline del trámite UNICA", () => {
  it("marca la evaluación en curso para EN_EVALUACION", () => {
    const pasos = construirTimeline("EN_EVALUACION");

    expect(pasos).toHaveLength(4);
    expect(pasos.map((paso) => paso.estado)).toEqual([
      "completado",
      "actual",
      "pendiente",
      "pendiente",
    ]);
    expect(indicePasoActual(pasos)).toBe(1);
    expect(porcentajeAvance(pasos)).toBe(38);
  });

  it("marca la evaluación observada para PENDIENTE_DOCUMENTOS", () => {
    const pasos = construirTimeline("PENDIENTE_DOCUMENTOS");

    expect(pasos.map((paso) => paso.estado)).toEqual([
      "completado",
      "observado",
      "pendiente",
      "pendiente",
    ]);
    expect(indicePasoActual(pasos)).toBe(1);
    expect(porcentajeAvance(pasos)).toBe(25);
  });

  it("avanza a firma digital con las dos primeras fases completas", () => {
    const pasos = construirTimeline("FIRMA_DIGITAL");

    expect(pasos.map((paso) => paso.estado)).toEqual([
      "completado",
      "completado",
      "actual",
      "pendiente",
    ]);
    expect(indicePasoActual(pasos)).toBe(2);
    expect(porcentajeAvance(pasos)).toBe(63);
  });

  it("completa todas las fases para FINALIZADO", () => {
    const pasos = construirTimeline("FINALIZADO");

    expect(pasos.every((paso) => paso.estado === "completado")).toBe(true);
    expect(indicePasoActual(pasos)).toBe(3);
    expect(porcentajeAvance(pasos)).toBe(100);
  });

  it("mantiene los títulos de las cuatro fases del flujo", () => {
    expect(construirTimeline("EN_EVALUACION").map((paso) => paso.titulo)).toEqual([
      "Registrado",
      "En Evaluación",
      "Firma Digital",
      "Listo para Entrega",
    ]);
  });
});
