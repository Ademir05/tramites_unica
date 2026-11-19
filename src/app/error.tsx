"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-unica-bg px-4 py-10">
      <Card className="w-full max-w-xl border-slate-200 bg-white">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 ring-1 ring-slate-200">
              <AlertTriangle className="h-7 w-7" aria-hidden />
            </div>

            <Badge variant="neutral" className="mt-4">
              Error inesperado
            </Badge>

            <h1 className="mt-3 text-xl font-bold text-slate-900">
              Algo salió mal en el módulo
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Ocurrió un fallo al renderizar la vista. Puedes reintentar la
              operación o volver al inicio del Campus Virtual.
            </p>

            {error.digest ? (
              <p className="mt-3 font-mono text-[11px] text-slate-400">
                Referencia: {error.digest}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <Button type="button" onClick={reset}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                Reintentar
              </Button>
              <Button asChild variant="outline">
                <Link href="/mis-tramites">
                  <Home className="h-4 w-4" aria-hidden />
                  Volver a mis trámites
                </Link>
              </Button>
            </div>

            <p className="mt-5 text-[10px] text-slate-400">
              Prototipo académico · Los datos son ficticios y no se persisten.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
