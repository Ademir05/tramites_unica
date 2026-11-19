import { Compass, Home, SearchX } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-unica-bg px-4 py-10">
      <Card className="w-full max-w-xl border-amber-200">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
              <SearchX className="h-7 w-7" aria-hidden />
            </div>

            <Badge variant="warning" className="mt-4">
              Página no encontrada
            </Badge>

            <h1 className="mt-3 text-xl font-bold text-slate-900">
              No encontramos esta página
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              La dirección que abriste no existe en el módulo de Seguimiento de
              Trámites. Revisa el enlace o vuelve al listado de tus solicitudes.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/mis-tramites">
                  <Home className="h-4 w-4" aria-hidden />
                  Volver a mis trámites
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  <Compass className="h-4 w-4" aria-hidden />
                  Ir al inicio
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
