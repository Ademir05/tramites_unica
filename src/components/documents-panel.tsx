"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
} from "lucide-react";

import { DocumentUploadZone } from "@/components/document-upload-zone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatearFechaHoraCorta } from "@/lib/format";
import type { SolicitudUNICA } from "@/lib/types";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

interface DocumentsPanelProps {
  solicitud: SolicitudUNICA;
}

export function DocumentsPanel({ solicitud }: DocumentsPanelProps) {
  const subsanacionEnviada = useSeguimientoStore(
    (state) => state.subsanacionEnviada,
  );

  const pendientes = solicitud.documentosPendientes ?? [];
  const recibidos = solicitud.documentosRecibidos ?? [];
  const completado =
    subsanacionEnviada || (pendientes.length === 0 && recibidos.length > 0);

  if (completado) {
    return (
      <Card className="border-emerald-200/80">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Subsanación enviada
                </h3>
                <Badge variant="success">En revisión</Badge>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Recibimos tus documentos. Tu solicitud volvió a evaluación y el
                área responsable verificará la información adjunta.
              </p>

              <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Documentos recibidos
                </p>
                <ul className="mt-2 space-y-1.5">
                  {recibidos.map((documento) => (
                    <li
                      key={documento}
                      className="flex items-start gap-2 text-xs text-emerald-900"
                    >
                      <FileCheck2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden
                      />
                      {documento}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" aria-hidden />
                Última actualización:{" "}
                {formatearFechaHoraCorta(solicitud.fechaUltimaActualizacion)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200/80">
      <CardHeader className="border-b border-amber-100 bg-amber-50/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <CardTitle>Documentos pendientes</CardTitle>
              <CardDescription>
                Completa los requisitos para reanudar la evaluación de tu
                trámite en la UNICA.
              </CardDescription>
            </div>
          </div>
          <Badge variant="warning">Acción requerida</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5 sm:p-6">
        <Alert variant="warning">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
            aria-hidden
          />
          <div>
            <AlertTitle>Observación de {solicitud.areaResponsable}</AlertTitle>
            <AlertDescription>
              <p className="mt-0.5">Adjunta los siguientes documentos:</p>
              <ul className="mt-2 space-y-1.5">
                {pendientes.map((documento) => (
                  <li
                    key={documento}
                    className="flex items-start gap-2 text-xs font-medium"
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-700"
                      aria-hidden
                    />
                    {documento}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </div>
        </Alert>

        <DocumentUploadZone />
      </CardContent>
    </Card>
  );
}
