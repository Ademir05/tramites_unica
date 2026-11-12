"use client";

import { FolderSearch, RefreshCw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function EmptyState() {
  const cargarMisTramites = useSeguimientoStore(
    (state) => state.cargarMisTramites,
  );

  return (
    <Card className="border-slate-200">
      <CardContent className="p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-unica-orange-light text-unica-orange-dark ring-1 ring-unica-orange-border">
          <FolderSearch className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Aún no tienes trámites registrados
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
          Cuando registres una constancia o certificado en el Campus Virtual
          UNICA, aparecerá aquí con su estado y área responsable.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => void cargarMisTramites()}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Actualizar listado
        </Button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="h-3 w-3" aria-hidden />
          Solo se muestran solicitudes asociadas a tu cuenta institucional.
        </p>
      </CardContent>
    </Card>
  );
}
