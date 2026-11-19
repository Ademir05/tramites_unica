"use client";

import {
  Clock,
  Download,
  IdCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatearFechaHora } from "@/lib/format";
import type { SolicitudUNICA } from "@/lib/types";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

interface EntregaPanelProps {
  solicitud: SolicitudUNICA;
}

export function EntregaPanel({ solicitud }: EntregaPanelProps) {
  const sesion = useSeguimientoStore((state) => state.sesion);

  const descargar = () => {
    const marcaDemo = "*** DEMO · SIN VALIDEZ OFICIAL ***";
    const contenido = [
      marcaDemo,
      "CONSTANCIA ACADÉMICA · CAMPUS VIRTUAL UNICA",
      "DOCUMENTO DE DEMOSTRACIÓN",
      "================================================",
      "",
      "AVISO: este archivo se genera desde un prototipo académico.",
      "No constituye una constancia oficial ni un documento emitido por la UNICA.",
      "",
      "================================================",
      "",
      `Código de solicitud: ${solicitud.codigoSolicitud}`,
      `Estudiante: ${sesion?.nombreCompleto ?? "Estudiante UNICA"}`,
      `Código universitario: ${sesion?.codigoUniversitario ?? solicitud.estudianteId}`,
      `Trámite: ${solicitud.tipoTramite}`,
      `Estado: Finalizado`,
      `Área responsable: ${solicitud.areaResponsable}`,
      `Última actualización: ${formatearFechaHora(solicitud.fechaUltimaActualizacion)}`,
      "",
      "Este documento es ficticio y forma parte del prototipo de",
      "Seguimiento de Trámites Académicos de la UNICA.",
      "No tiene validez oficial.",
      "",
      marcaDemo,
    ].join("\n");

    const blob = new Blob([contenido], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `${solicitud.codigoSolicitud}-constancia-demo.txt`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="overflow-hidden border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-white">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-900/20">
            <PackageCheck className="h-6 w-6" aria-hidden />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                Tu documento está listo
              </h3>
              <Badge variant="success">Listo para entrega</Badge>
            </div>

            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {solicitud.siguientePaso}. El trámite concluyó y ya no requiere
              acciones adicionales de tu parte.
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white/80 p-2.5">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                  aria-hidden
                />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Recojo
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700">
                    Ventanilla 3
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white/80 p-2.5">
                <Clock
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                  aria-hidden
                />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Horario
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700">
                    8:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white/80 p-2.5">
                <IdCard
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                  aria-hidden
                />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Requisito
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700">
                    DNI físico
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button type="button" variant="success" onClick={descargar}>
                <Download className="h-4 w-4" aria-hidden />
                Descargar constancia (demo)
              </Button>
              <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Descarga simulada con datos ficticios
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
