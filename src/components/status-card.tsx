"use client";

import {
  CalendarClock,
  Clock3,
  FileText,
  Info,
  UserRound,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { META_ESTADO } from "@/lib/estados";
import {
  formatearFechaCorta,
  formatearFechaHora,
  formatearFechaHoraCorta,
} from "@/lib/format";
import type { SolicitudUNICA } from "@/lib/types";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

interface StatusCardProps {
  solicitud: SolicitudUNICA;
}

export function StatusCard({ solicitud }: StatusCardProps) {
  const sesion = useSeguimientoStore((state) => state.sesion);
  const meta = META_ESTADO[solicitud.estado];

  return (
    <Card className="overflow-hidden border-unica-orange-border">
      <div className="h-1.5 w-full bg-gradient-to-r from-unica-orange via-unica-orange-dark to-amber-400" aria-hidden />
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-unica-orange-light text-unica-orange-dark ring-1 ring-unica-orange-border">
              <FileText className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Trámite académico · UNICA
              </p>
              <h2 className="mt-0.5 text-lg font-bold leading-tight text-slate-900 sm:text-xl">
                {solicitud.tipoTramite}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono font-semibold text-slate-700">
                  {solicitud.codigoSolicitud}
                </span>
                <span className="text-slate-300" aria-hidden>
                  •
                </span>
                <span>
                  Registrado el {formatearFechaCorta(solicitud.fechaRegistro)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <StatusBadge estado={solicitud.estado} />
            <p
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-unica-orange-border bg-unica-orange-light px-2.5 py-1 text-[10px] font-semibold text-unica-orange-dark"
              title={formatearFechaHora(solicitud.fechaUltimaActualizacion)}
            >
              <Clock3 className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">
                Última actualización:{" "}
                {formatearFechaHoraCorta(solicitud.fechaUltimaActualizacion)}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-unica-orange-dark shadow-sm ring-1 ring-slate-100">
              <UserRound className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Estudiante
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {sesion?.nombreCompleto ?? "Estudiante UNICA"}
              </p>
              <p className="text-[11px] text-slate-500">
                Código {sesion?.codigoUniversitario ?? solicitud.estudianteId}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:border-l sm:border-slate-200 sm:pl-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm ring-1 ring-slate-100">
              <CalendarClock className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Fecha de registro
              </p>
              <p className="text-sm font-semibold leading-snug text-slate-800">
                {formatearFechaHora(solicitud.fechaRegistro)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Campus Virtual UNICA
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-unica-orange-light/80 px-3 py-2.5">
          <Info
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-unica-orange-dark"
            aria-hidden
          />
          <p className="text-[11px] leading-relaxed text-unica-orange-dark">
            {meta.descripcion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
