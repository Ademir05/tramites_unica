"use client";

import { ArrowLeft, LockKeyhole, ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MENSAJE_ACCESO_DENEGADO } from "@/lib/mock-api";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function SecurityState() {
  const error = useSeguimientoStore((state) => state.error);
  const consulta = useSeguimientoStore((state) => state.consulta);
  const limpiarFiltro = useSeguimientoStore((state) => state.limpiarFiltro);

  return (
    <Card className="animate-fade-up border-red-200">
      <CardContent className="p-6 sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 ring-1 ring-red-200">
            <ShieldAlert className="h-7 w-7" aria-hidden />
          </div>

          <Badge variant="danger" className="mt-4">
            Control de acceso · HTTP 403
          </Badge>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            Acceso restringido
          </h2>

          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-relaxed text-red-900">
            {error ?? MENSAJE_ACCESO_DENEGADO}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            La consulta fue bloqueada por el aislamiento de datos del Campus
            Virtual. No se mostró información de la otra cuenta institucional.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() => void limpiarFiltro()}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver a mis trámites
            </Button>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Código consultado:{" "}
            <span className="font-mono font-semibold text-slate-500">
              {consulta || "—"}
            </span>
          </p>
        </div>

        <Alert variant="danger" className="mx-auto mt-6 max-w-2xl text-left">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <AlertTitle>Evento de seguridad simulado</AlertTitle>
            <AlertDescription>
              En producción, este intento se registraría en la bitácora de
              auditoría del Campus Virtual UNICA y la solicitud permanecería
              inaccesible para tu cuenta.
            </AlertDescription>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
