// @vitest-environment jsdom
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { CampusPortal } from "@/components/layout/campus-portal";
import { SeguimientoApp } from "@/components/seguimiento-app";
import {
  MENSAJE_ACCESO_DENEGADO,
  MENSAJE_ERROR_SERVICIO,
  MENSAJE_NO_ENCONTRADO,
  resetMockData,
} from "@/lib/mock-api";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  resetMockData();
  useSeguimientoStore.getState().iniciarSesion();
  useSeguimientoStore.setState({ simularFallo: false });
});

afterEach(() => {
  cleanup();
});

async function buscar(texto: string) {
  const user = userEvent.setup();
  const input = screen.getByLabelText("Código de solicitud o tipo de trámite");

  await user.clear(input);
  await user.type(input, texto);
  await user.click(screen.getByRole("button", { name: /Buscar trámite/i }));

  return user;
}

describe("Campus Virtual UNICA · integración UI", () => {
  it("saluda a la estudiante y lista automáticamente solo sus trámites", async () => {
    render(<SeguimientoApp />);

    expect(screen.getByText("Hola, Ana")).toBeTruthy();

    const listado = await screen.findByRole("region", {
      name: "Mis trámites",
    });

    expect(within(listado).getByText("Constancia de Estudios 2026-II")).toBeTruthy();
    expect(within(listado).getByText("Certificado de Notas")).toBeTruthy();
    expect(within(listado).getByText("Certificado de Bachillerato")).toBeTruthy();
    expect(within(listado).getByText("Constancia de Matrícula 2026-I")).toBeTruthy();
    expect(within(listado).queryByText("SOL-UNICA-2026-002")).toBeNull();
    expect(within(listado).queryByText("SOL-UNICA-2026-099")).toBeNull();
    expect(within(listado).queryByText("Constancia de Egresado")).toBeNull();
    expect(screen.getByText("4 trámites")).toBeTruthy();
  });

  it("consulta un código propio y muestra HU-02, HU-03 y HU-04", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });

    await buscar("SOL-UNICA-2026-001");

    expect(
      await screen.findByRole("heading", {
        name: "Consulta el avance de tu trámite",
      }),
    ).toBeTruthy();

    expect(screen.getAllByText("En Evaluación").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Oficina de Registro y Asuntos Académicos").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Verificación de requisitos de matrícula").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Última actualización: 12/11/2026, 11:20 AM").length,
    ).toBeGreaterThan(0);
  });

  it("bloquea con 403 exacto el código de otro estudiante", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });

    await buscar("SOL-UNICA-2026-002");

    expect(await screen.findByText(MENSAJE_ACCESO_DENEGADO)).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Acceso restringido" }),
    ).toBeTruthy();
    expect(screen.queryByText("Certificado de Notas")).toBeNull();
    expect(screen.queryByText("SOL-UNICA-2026-099")).toBeNull();
  });

  it("muestra el aviso de código inexistente sin datos de terceros", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });

    await buscar("SOL-000-XXXX");

    expect(await screen.findByText(MENSAJE_NO_ENCONTRADO)).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        name: "No encontramos esa solicitud en tu cuenta",
      }),
    ).toBeTruthy();
    expect(screen.getByText(/Búsqueda realizada:/)).toBeTruthy();
  });

  it("muestra error 500 con Reintentar y se recupera", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: /Probar error 500/i }),
    );

    expect(await screen.findByText(MENSAJE_ERROR_SERVICIO)).toBeTruthy();

    await user.click(
      screen.getByRole("button", {
        name: /Desactivar simulación y reintentar/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Consulta el avance de tu trámite",
      }),
    ).toBeTruthy();
    expect(screen.getAllByText("Constancia de Estudios 2026-II").length).toBeGreaterThan(0);
  });

  it("filtra por tipo de trámite sin incluir solicitudes ajenas", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });

    await buscar("Certificado");

    const listado = await screen.findByRole("region", {
      name: /Resultados para/,
    });

    expect(within(listado).getAllByText("Certificado de Notas")).toHaveLength(1);
    expect(
      within(listado).getByText("Certificado de Bachillerato"),
    ).toBeTruthy();
    expect(within(listado).queryByText("Constancia de Estudios 2026-II")).toBeNull();
    expect(within(listado).queryByText("Constancia de Egresado")).toBeNull();
  });

  it("valida el formulario antes de consultar", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /Buscar trámite/i }));

    expect(
      screen.getByText(
        "Ingresa un código de solicitud o el tipo de trámite.",
      ),
    ).toBeTruthy();

    await user.type(
      screen.getByLabelText("Código de solicitud o tipo de trámite"),
      "!!",
    );
    await user.click(screen.getByRole("button", { name: /Buscar trámite/i }));

    expect(
      screen.getByText(/El dato ingresado no es válido/i),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "Consulta el avance de tu trámite" }),
    ).toBeNull();
  });

  it("adjunta un documento y envía la subsanación (HU-03)", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });
    const user = await buscar("SOL-UNICA-2026-003");

    expect(
      await screen.findByText("Documentos pendientes"),
    ).toBeTruthy();
    expect(
      screen.getByText("Foto de DNI legible (Ambas caras)"),
    ).toBeTruthy();
    expect(
      screen.getByText("Voucher de pago Banco de la Nación"),
    ).toBeTruthy();

    const inputArchivo = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const archivo = new File(["contenido de prueba"], "dni-ampliado.pdf", {
      type: "application/pdf",
    });

    await user.upload(inputArchivo, archivo);

    expect(
      await screen.findByText("Archivo cargado", {}, { timeout: 3000 }),
    ).toBeTruthy();

    const botonEnviar = screen.getByRole("button", {
      name: /Enviar subsanación/i,
    });

    await waitFor(
      () => {
        expect((botonEnviar as HTMLButtonElement).disabled).toBe(false);
      },
      { timeout: 3000 },
    );

    await user.click(botonEnviar);

    expect(
      await screen.findByText("Subsanación enviada", {}, { timeout: 3000 }),
    ).toBeTruthy();
    expect(screen.getByText("En revisión")).toBeTruthy();
    expect(screen.getByText("dni-ampliado.pdf")).toBeTruthy();
  });

  it("muestra el estado finalizado y el panel de entrega", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });

    await buscar("SOL-UNICA-2026-005");

    expect(
      await screen.findByText("Tu documento está listo"),
    ).toBeTruthy();
    expect(screen.getByText("Listo para entrega")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Descargar constancia/i }),
    ).toBeTruthy();
  });

  it("muestra la fase de firma digital", async () => {
    render(<SeguimientoApp />);
    await screen.findByRole("region", { name: "Mis trámites" });

    await buscar("SOL-UNICA-2026-004");

    expect(
      await screen.findByRole("heading", {
        name: "Consulta el avance de tu trámite",
      }),
    ).toBeTruthy();
    expect(screen.getAllByText("Firma Digital").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Firma digital y autorización del documento").length,
    ).toBeGreaterThan(0);
  });

  it("cierra sesión y vuelve a ingresar al Campus Virtual", async () => {
    render(<CampusPortal />);

    expect(await screen.findByText("Hola, Ana")).toBeTruthy();
    await screen.findByRole("region", { name: "Mis trámites" });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Cerrar sesión/i }));

    expect(
      screen.getByRole("heading", { name: "Sesión finalizada" }),
    ).toBeTruthy();
    expect(useSeguimientoStore.getState().sesion).toBeNull();

    await user.click(
      screen.getByRole("button", {
        name: /Ingresar con Campus Virtual UNICA/i,
      }),
    );

    expect(await screen.findByText("Hola, Ana")).toBeTruthy();
    expect(
      await screen.findByRole("region", { name: "Mis trámites" }),
    ).toBeTruthy();
  });
});
