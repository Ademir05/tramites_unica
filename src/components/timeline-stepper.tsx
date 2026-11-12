import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  FileText,
  PackageCheck,
  PenLine,
  Route,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  construirTimeline,
  indicePasoActual,
  porcentajeAvance,
  type EstadoPaso,
} from "@/lib/timeline";
import type { SolicitudUNICA } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONOS_PASO = [FileText, ClipboardCheck, PenLine, PackageCheck];

const ESTILO_CIRCULO: Record<EstadoPaso, string> = {
  completado: "border-emerald-500 bg-emerald-500 text-white",
  actual: "animate-soft-pulse border-unica-orange bg-unica-orange text-white",
  observado: "border-amber-500 bg-amber-500 text-white",
  pendiente: "border-slate-200 bg-white text-slate-400",
};

const ESTILO_TITULO: Record<EstadoPaso, string> = {
  completado: "text-slate-700",
  actual: "text-unica-orange-dark",
  observado: "text-amber-700",
  pendiente: "text-slate-400",
};

interface TimelineStepperProps {
  solicitud: SolicitudUNICA;
}

export function TimelineStepper({ solicitud }: TimelineStepperProps) {
  const pasos = construirTimeline(solicitud.estado);
  const actual = indicePasoActual(pasos);
  const avance = porcentajeAvance(pasos);

  const colorProgreso =
    solicitud.estado === "FINALIZADO"
      ? "bg-emerald-500"
      : solicitud.estado === "PENDIENTE_DOCUMENTOS"
        ? "bg-amber-400"
        : "bg-unica-orange";

  const badgeVariant =
    solicitud.estado === "FINALIZADO"
      ? "success"
      : solicitud.estado === "PENDIENTE_DOCUMENTOS"
        ? "warning"
        : solicitud.estado === "FIRMA_DIGITAL"
          ? "info"
          : "brand";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-unica-orange-light text-unica-orange-dark">
              <Route className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <CardTitle>Progreso del trámite</CardTitle>
              <CardDescription>
                Fase actual: {pasos[actual]?.titulo ?? "Registrado"}
              </CardDescription>
            </div>
          </div>
          <Badge variant={badgeVariant}>{avance}% completado</Badge>
        </div>
        <Progress
          value={avance}
          label="Avance del trámite"
          className="mt-4 h-1.5"
          indicatorClassName={colorProgreso}
        />
      </CardHeader>

      <CardContent className="pt-3">
        <div className="relative">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-0.5 bg-slate-200 md:block"
            aria-hidden
          />
          <div
            className={cn(
              "absolute left-[12.5%] top-5 hidden h-0.5 transition-all duration-500 md:block",
              colorProgreso,
            )}
            style={{
              width: `${(actual / Math.max(1, pasos.length - 1)) * 75}%`,
            }}
            aria-hidden
          />

          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-3">
            {pasos.map((paso, indice) => {
              const Icono = ICONOS_PASO[indice] ?? FileText;
              const esUltimo = indice === pasos.length - 1;

              return (
                <li
                  key={paso.id}
                  aria-current={paso.estado === "actual" ? "step" : undefined}
                  className="relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
                >
                  {!esUltimo ? (
                    <span
                      className={cn(
                        "absolute left-5 top-10 h-[calc(100%-1.5rem)] w-0.5 md:hidden",
                        paso.estado === "completado"
                          ? "bg-emerald-300"
                          : paso.estado === "observado"
                            ? "bg-amber-200"
                            : "bg-slate-200",
                      )}
                      aria-hidden
                    />
                  ) : null}

                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      ESTILO_CIRCULO[paso.estado],
                    )}
                  >
                    {paso.estado === "completado" ? (
                      <Check className="h-5 w-5" aria-hidden />
                    ) : paso.estado === "observado" ? (
                      <AlertCircle className="h-5 w-5" aria-hidden />
                    ) : (
                      <Icono className="h-4.5 w-4.5" aria-hidden />
                    )}
                  </div>

                  <div className="pb-1 md:mt-3 md:pb-0 md:px-1">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        ESTILO_TITULO[paso.estado],
                      )}
                    >
                      {paso.titulo}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                      {paso.descripcion}
                    </p>

                    {paso.estado === "actual" ? (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-unica-orange-dark">
                        <span
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-unica-orange"
                          aria-hidden
                        />
                        En curso
                      </span>
                    ) : null}

                    {paso.estado === "observado" ? (
                      <Badge
                        variant="warning"
                        className="mt-2 px-2 py-0.5 text-[10px]"
                      >
                        Acción requerida
                      </Badge>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-unica-orange-border bg-gradient-to-br from-unica-orange-light to-white p-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-unica-orange-dark shadow-sm ring-1 ring-unica-orange-border">
              <Building2 className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Área responsable actual
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-unica-orange-dark">
                {solicitud.areaResponsable}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Universidad Nacional San Luis Gonzaga de Ica
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:border-l sm:border-unica-orange-border sm:pl-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm ring-1 ring-unica-orange-border">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Siguiente paso
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-unica-orange-dark">
                {solicitud.siguientePaso}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
