import { describe, expect, it } from "vitest";

import {
  enmascararDni,
  formatearFechaApi,
  formatearFechaCorta,
  formatearFechaHora,
  formatearFechaHoraCorta,
  formatearTamano,
  tiempoRelativo,
} from "@/lib/format";

describe("formateo de fechas", () => {
  it("formatea la última actualización tal como exige HU-04", () => {
    expect(formatearFechaHora("2026-11-12 10:30")).toBe(
      "12 de noviembre de 2026, 10:30 AM",
    );
  });

  it("formatea la última actualización en formato compacto para la cabecera", () => {
    expect(formatearFechaHoraCorta("2026-11-12 11:20")).toBe(
      "12/11/2026, 11:20 AM",
    );
  });

  it("convierte correctamente el mediodía y la medianoche a 12 horas", () => {
    expect(formatearFechaHora("2026-11-12 13:05")).toBe(
      "12 de noviembre de 2026, 1:05 PM",
    );
    expect(formatearFechaHora("2026-11-12 00:05")).toBe(
      "12 de noviembre de 2026, 12:05 AM",
    );
  });

  it("genera la fecha corta de registro", () => {
    expect(formatearFechaCorta("2026-11-10 09:00")).toBe("10/11/2026");
  });

  it("serializa fechas al formato de la API ficticia", () => {
    expect(formatearFechaApi(new Date(2026, 10, 12, 10, 30))).toBe(
      "2026-11-12 10:30",
    );
  });

  it("devuelve un guion para valores inválidos", () => {
    expect(formatearFechaHora("sin-fecha")).toBe("—");
    expect(formatearFechaCorta("")).toBe("—");
    expect(formatearFechaHoraCorta("sin-fecha")).toBe("—");
  });
});

describe("tiempo relativo", () => {
  const ahora = new Date(2026, 10, 12, 12, 30);

  it("calcula horas y minutos transcurridos", () => {
    expect(tiempoRelativo("2026-11-12 10:30", ahora)).toBe("hace 2 horas");
    expect(tiempoRelativo("2026-11-12 12:00", ahora)).toBe("hace 30 minutos");
    expect(tiempoRelativo("2026-11-12 12:30", ahora)).toBe("hace un momento");
  });

  it("calcula días transcurridos", () => {
    expect(tiempoRelativo("2026-11-11 12:30", ahora)).toBe("hace 1 día");
    expect(tiempoRelativo("2026-11-09 12:30", ahora)).toBe("hace 3 días");
  });
});

describe("formatos auxiliares", () => {
  it("formatea tamaños de archivo en español", () => {
    expect(formatearTamano(512)).toBe("512 B");
    expect(formatearTamano(340 * 1024)).toBe("340 KB");
    expect(formatearTamano(1.2 * 1024 * 1024)).toBe("1,2 MB");
  });

  it("enmascara el DNI para no exponer el número completo", () => {
    expect(enmascararDni("44556677")).toBe("••••6677");
    expect(enmascararDni(undefined)).toBe("—");
  });
});
