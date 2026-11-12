"use client";

import {
  ArrowRight,
  Building2,
  CalendarClock,
  FileText,
  RefreshCw,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { formatearFechaCorta, formatearFechaHoraCorta } from "@/lib/format";
import type { SolicitudUNICA } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SolicitudCardProps {
  solicitud: SolicitudUNICA;
  activa: boolean;
  onSeleccionar: (codigoSolicitud: string) => void;
}

export function SolicitudCard({
  solicitud,
  activa,
  onSeleccionar,
}: SolicitudCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSeleccionar(solicitud.codigoSolicitud)}
      aria-pressed={activa}
      className={cn(
        "group w-full rounded-2xl border bg-white p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-unica-orange-border hover:shadow-float",
        activa
          ? "border-unica-orange ring-2 ring-unica-orange/15"
          : "border-unica-orange-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors",
              activa
                ? "bg-unica-orange text-white ring-unica-orange"
                : "bg-unica-orange-light text-unica-orange-dark ring-unica-orange-border",
            )}
          >
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {solicitud.codigoSolicitud}
            </p>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900">
              {solicitud.tipoTramite}
            </h3>
          </div>
        </div>
        <StatusBadge
          estado={solicitud.estado}
          className="shrink-0 scale-95"
        />
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-slate-500 sm:grid-cols-2">
        <p className="flex items-center gap-1.5">
          <CalendarClock className="h-3 w-3 shrink-0" aria-hidden />
          Fecha de registro: {formatearFechaCorta(solicitud.fechaRegistro)}
        </p>
        <p className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3 shrink-0" aria-hidden />
          Última actualización:{" "}
          {formatearFechaHoraCorta(solicitud.fechaUltimaActualizacion)}
        </p>
        <p className="flex items-center gap-1.5 sm:col-span-2">
          <Building2 className="h-3 w-3 shrink-0" aria-hidden />
          {solicitud.areaResponsable}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5">
        <p className="min-w-0 truncate text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Siguiente:</span>{" "}
          {solicitud.siguientePaso}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-unica-orange-dark transition-all group-hover:gap-1.5">
          Ver detalle
          <ArrowRight className="h-3 w-3" aria-hidden />
        </span>
      </div>
    </button>
  );
}
