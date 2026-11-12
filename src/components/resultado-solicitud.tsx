"use client";

import { ArrowLeft } from "lucide-react";

import { DocumentsPanel } from "@/components/documents-panel";
import { EntregaPanel } from "@/components/entrega-panel";
import { HelpSidebar } from "@/components/help-sidebar";
import { StatusCard } from "@/components/status-card";
import { TimelineStepper } from "@/components/timeline-stepper";
import { Button } from "@/components/ui/button";
import type { SolicitudUNICA } from "@/lib/types";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

interface ResultadoSolicitudProps {
  solicitud: SolicitudUNICA;
}

export function ResultadoSolicitud({ solicitud }: ResultadoSolicitudProps) {
  const volverALista = useSeguimientoStore((state) => state.volverALista);
  const subsanacionEnviada = useSeguimientoStore(
    (state) => state.subsanacionEnviada,
  );

  const mostrarDocumentos =
    solicitud.estado === "PENDIENTE_DOCUMENTOS" ||
    subsanacionEnviada ||
    (solicitud.documentosRecibidos?.length ?? 0) > 0;

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-unica-orange-dark">
            Detalle de la solicitud
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
            Consulta el avance de tu trámite
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={volverALista}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Volver a la lista
        </Button>
      </div>

      <StatusCard solicitud={solicitud} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-5">
          <TimelineStepper solicitud={solicitud} />

          {solicitud.estado === "FINALIZADO" ? (
            <EntregaPanel solicitud={solicitud} />
          ) : null}

          {mostrarDocumentos && solicitud.estado !== "FINALIZADO" ? (
            <DocumentsPanel solicitud={solicitud} />
          ) : null}
        </div>

        <HelpSidebar />
      </div>
    </div>
  );
}
