"use client";

import { Lightbulb, SearchX, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MENSAJE_NO_ENCONTRADO } from "@/lib/mock-api";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function NotFoundState() {
  const error = useSeguimientoStore((state) => state.error);
  const consulta = useSeguimientoStore((state) => state.consulta);
  const limpiarFiltro = useSeguimientoStore((state) => state.limpiarFiltro);

  return (
    <Card className="animate-fade-up border-amber-200">
      <CardContent className="p-6 sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
            <SearchX className="h-7 w-7" aria-hidden />
          </div>

          <Badge variant="warning" className="mt-4">
            Sin resultados
          </Badge>

          <h2 className="mt-3 text-xl font-bold text-slate-900">
            No encontramos esa solicitud en tu cuenta
          </h2>

          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium leading-relaxed text-amber-900">
            {error ?? MENSAJE_NO_ENCONTRADO}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Revisa que el código esté completo o intenta con el tipo de trámite.
            La búsqueda se limita estrictamente a las solicitudes de tu cuenta.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Button
              type="button"
              onClick={() => void limpiarFiltro()}
            >
              Ver todos mis trámites
            </Button>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Búsqueda realizada:{" "}
            <span className="font-mono font-semibold text-slate-500">
              {consulta || "—"}
            </span>
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-left">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden
            />
            <p className="text-[11px] leading-relaxed text-slate-500">
              El código tiene el formato{" "}
              <span className="font-mono">SOL-UNICA-AAAA-XXX</span> y figura en
              tu comprobante de solicitud.
            </p>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-left">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
              aria-hidden
            />
            <p className="text-[11px] leading-relaxed text-slate-500">
              Si el trámite es reciente, espera unos minutos y vuelve a
              consultar. La información puede tardar en registrarse.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
