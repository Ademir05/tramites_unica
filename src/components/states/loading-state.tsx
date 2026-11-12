import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-4"
    >
      <span className="sr-only">
        Cargando los trámites de tu cuenta institucional...
      </span>

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-52" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((indice) => (
          <Skeleton key={indice} className="h-20 rounded-2xl" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((indice) => (
          <Card key={indice}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-28" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full sm:col-span-2" />
              </div>
              <Skeleton className="mt-3 h-8 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <Loader2
          className="h-3.5 w-3.5 animate-spin text-unica-orange"
          aria-hidden
        />
        Cargando tus trámites...
      </p>
    </div>
  );
}
