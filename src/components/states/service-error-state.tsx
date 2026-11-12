"use client";

import {
  AlertTriangle,
  CloudOff,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MENSAJE_ERROR_SERVICIO } from "@/lib/mock-api";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function ServiceErrorState() {
  const error = useSeguimientoStore((state) => state.error);
  const consulta = useSeguimientoStore((state) => state.consulta);
  const reintentar = useSeguimientoStore((state) => state.reintentar);
  const simularFallo = useSeguimientoStore((state) => state.simularFallo);
  const setSimularFallo = useSeguimientoStore(
    (state) => state.setSimularFallo,
  );

  const reintentarSinFallo = () => {
    setSimularFallo(false);
    void reintentar();
  };

  return (
    <Card className="animate-fade-up border-slate-200 bg-white">
      <CardContent className="p-6 sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 ring-1 ring-slate-200">
            <CloudOff className="h-7 w-7" aria-hidden />
          </div>

          <Badge variant="neutral" className="mt-4">
            Contingencia del Campus Virtual
          </Badge>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            {error ?? MENSAJE_ERROR_SERVICIO}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            No pudimos obtener la información de tus trámites por una
            interrupción temporal. Tus datos están seguros; vuelve a intentarlo
            en unos segundos.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Button type="button" onClick={() => void reintentar()}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Reintentar
            </Button>
            {simularFallo ? (
              <Button
                type="button"
                variant="outline"
                onClick={reintentarSinFallo}
              >
                Desactivar simulación y reintentar
              </Button>
            ) : null}
          </div>

          {simularFallo ? (
            <Alert variant="danger" className="mt-5 text-left">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div>
                <AlertTitle>Simulación de fallo activa</AlertTitle>
                <AlertDescription>
                  El interruptor del panel de pruebas está encendido. Desactívalo
                  o usa el botón superior para continuar con la demostración.
                </AlertDescription>
              </div>
            </Alert>
          ) : null}

          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Tus datos no se vieron afectados
            </span>
            <span aria-hidden>·</span>
            <span>
              Consulta:{" "}
              <span className="font-mono font-semibold text-slate-500">
                {consulta || "listado principal"}
              </span>
            </span>
            <span aria-hidden>·</span>
            <span>HTTP 500 (simulado)</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
