"use client";

import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { DemoPanel } from "@/components/demo-panel";
import { ResultadoSolicitud } from "@/components/resultado-solicitud";
import { SearchForm } from "@/components/search-form";
import { SolicitudCard } from "@/components/solicitud-card";
import { EmptyState } from "@/components/states/empty-state";
import { LoadingState } from "@/components/states/loading-state";
import { NotFoundState } from "@/components/states/not-found-state";
import { SecurityState } from "@/components/states/security-state";
import { ServiceErrorState } from "@/components/states/service-error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

const ESTADOS_CON_ERROR = ["prohibido", "no_encontrada", "error_servicio"];

export function SeguimientoApp() {
  const sesion = useSeguimientoStore((state) => state.sesion);
  const vista = useSeguimientoStore((state) => state.vista);
  const solicitudes = useSeguimientoStore((state) => state.solicitudes);
  const seleccionada = useSeguimientoStore((state) => state.seleccionada);
  const consulta = useSeguimientoStore((state) => state.consulta);
  const cargarMisTramites = useSeguimientoStore(
    (state) => state.cargarMisTramites,
  );
  const limpiarFiltro = useSeguimientoStore((state) => state.limpiarFiltro);
  const seleccionarSolicitud = useSeguimientoStore(
    (state) => state.seleccionarSolicitud,
  );

  const resultadoRef = useRef<HTMLDivElement>(null);
  const detalleRef = useRef<HTMLDivElement>(null);
  const codigoSeleccionado = seleccionada?.codigoSolicitud ?? null;

  useEffect(() => {
    void cargarMisTramites();
  }, [cargarMisTramites]);

  useEffect(() => {
    if (!codigoSeleccionado) return;

    const temporizador = window.setTimeout(() => {
      detalleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => window.clearTimeout(temporizador);
  }, [codigoSeleccionado]);

  useEffect(() => {
    if (!ESTADOS_CON_ERROR.includes(vista)) return;

    const temporizador = window.setTimeout(() => {
      resultadoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => window.clearTimeout(temporizador);
  }, [vista]);

  const cargando = vista === "idle" || vista === "cargando";
  const primerNombre = sesion?.nombreCompleto.split(" ")[0] ?? "estudiante";

  const total = solicitudes.length;
  const enCurso = solicitudes.filter(
    (solicitud) =>
      solicitud.estado === "EN_EVALUACION" ||
      solicitud.estado === "FIRMA_DIGITAL",
  ).length;
  const porSubsanar = solicitudes.filter(
    (solicitud) => solicitud.estado === "PENDIENTE_DOCUMENTOS",
  ).length;
  const finalizados = solicitudes.filter(
    (solicitud) => solicitud.estado === "FINALIZADO",
  ).length;

  const resumen = [
    {
      etiqueta: "Trámites",
      valor: total,
      Icono: FileText,
      clase: "bg-unica-orange-light text-unica-orange-dark ring-unica-orange-border",
    },
    {
      etiqueta: "En curso",
      valor: enCurso,
      Icono: Clock3,
      clase: "bg-sky-50 text-sky-700 ring-sky-200",
    },
    {
      etiqueta: "Por subsanar",
      valor: porSubsanar,
      Icono: AlertTriangle,
      clase: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    {
      etiqueta: "Finalizados",
      valor: finalizados,
      Icono: CheckCircle2,
      clase: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
  ];

  return (
    <main
      id="contenido"
      className="mx-auto w-full max-w-6xl px-4 pb-10 pt-7 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-fade-up">
          <Badge variant="brand" className="px-2.5 py-1">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Campus Virtual UNICA · Mis trámites
          </Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Hola, {primerNombre}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Consulta el avance de tus constancias y certificados, el área
            responsable y los documentos pendientes.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span
            className="h-2 w-2 rounded-full bg-emerald-500"
            aria-hidden
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Sesión institucional
            </p>
            <p className="text-[11px] font-medium text-slate-600">
              {sesion?.codigoUniversitario} · {sesion?.facultad}
            </p>
          </div>
        </div>
      </div>

      <Card className="mt-5 border-slate-200/80 p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-unica-orange-light text-unica-orange-dark ring-1 ring-unica-orange-border sm:flex">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight text-slate-900">
              Busca entre tus trámites
            </h2>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              Ingresa un código de solicitud o el tipo de trámite. Solo se
              mostrarán las solicitudes asociadas a tu cuenta institucional.
            </p>
          </div>
        </div>

        <SearchForm />
        <DemoPanel />
      </Card>

      <div ref={resultadoRef} className="mt-7 scroll-mt-24">
        {cargando ? <LoadingState /> : null}

        {vista === "exito" && solicitudes.length === 0 ? <EmptyState /> : null}

        {vista === "exito" && solicitudes.length > 0 ? (
          <div className="animate-fade-in space-y-5">
            {!consulta ? (
              <section aria-label="Resumen de tus trámites">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {resumen.map(({ etiqueta, valor, Icono, clase }) => (
                    <Card key={etiqueta} className="border-slate-200/80">
                      <CardContent className="flex items-center gap-3 p-3.5">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${clase}`}
                        >
                          <Icono className="h-4 w-4" aria-hidden />
                        </div>
                        <div>
                          <p className="text-xl font-bold leading-none text-slate-900">
                            {valor}
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                            {etiqueta}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="titulo-listado">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-unica-orange-dark">
                    {consulta ? "Resultado de búsqueda" : "Solicitudes registradas"}
                  </p>
                  <h2
                    id="titulo-listado"
                    className="mt-0.5 text-lg font-bold text-slate-900"
                  >
                    {consulta ? `Resultados para “${consulta}”` : "Mis trámites"}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {consulta
                      ? `${solicitudes.length} ${solicitudes.length === 1 ? "coincidencia" : "coincidencias"} dentro de tu cuenta.`
                      : "Solicitudes asociadas a tu cuenta institucional."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="neutral">
                    {solicitudes.length}{" "}
                    {solicitudes.length === 1 ? "trámite" : "trámites"}
                  </Badge>
                  {consulta ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void limpiarFiltro()}
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                      Limpiar filtro
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {solicitudes.map((solicitud) => (
                  <SolicitudCard
                    key={solicitud.codigoSolicitud}
                    solicitud={solicitud}
                    activa={
                      seleccionada?.codigoSolicitud ===
                      solicitud.codigoSolicitud
                    }
                    onSeleccionar={seleccionarSolicitud}
                  />
                ))}
              </div>

              {!seleccionada ? (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
                  Selecciona un trámite para ver el detalle, el área
                  responsable y los documentos pendientes.
                </p>
              ) : null}
            </section>

            {seleccionada ? (
              <div ref={detalleRef} className="scroll-mt-24 pt-2">
                <ResultadoSolicitud solicitud={seleccionada} />
              </div>
            ) : null}
          </div>
        ) : null}

        {vista === "no_encontrada" ? <NotFoundState /> : null}
        {vista === "prohibido" ? <SecurityState /> : null}
        {vista === "error_servicio" ? <ServiceErrorState /> : null}
      </div>
    </main>
  );
}
