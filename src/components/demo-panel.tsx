"use client";

import { AlertTriangle, FlaskConical, ListChecks } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { CASOS_DEMO } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

const PUNTO: Record<string, string> = {
  orange: "bg-unica-orange",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
};

export function DemoPanel() {
  const consultar = useSeguimientoStore((state) => state.consultar);
  const cargarMisTramites = useSeguimientoStore(
    (state) => state.cargarMisTramites,
  );
  const vista = useSeguimientoStore((state) => state.vista);
  const simularFallo = useSeguimientoStore((state) => state.simularFallo);
  const setSimularFallo = useSeguimientoStore(
    (state) => state.setSimularFallo,
  );

  const cargando = vista === "cargando";

  const probarCaso = (valor: string) => {
    setSimularFallo(false);
    void consultar(valor);
  };

  const probarError = () => {
    setSimularFallo(true);
    void consultar("SOL-UNICA-2026-001");
  };

  const verTodos = () => {
    setSimularFallo(false);
    void cargarMisTramites();
  };

  return (
    <section
      aria-label="Panel de pruebas con datos ficticios"
      className="mt-4 rounded-xl border border-dashed border-unica-orange-border bg-unica-orange-light/60 p-3.5 sm:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-unica-orange-dark">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden />
          Panel de pruebas · Sprint Review UNICA
        </p>
        <div className="flex items-center gap-2">
          <label
            htmlFor="simular-fallo"
            className="cursor-pointer text-[11px] font-medium text-slate-600"
          >
            Simular caída del servicio
          </label>
          <Switch
            id="simular-fallo"
            checked={simularFallo}
            onCheckedChange={setSimularFallo}
            label="Simular caída del servicio"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={verTodos}
          disabled={cargando}
          className="inline-flex items-center gap-1.5 rounded-lg border border-unica-orange-border bg-white px-2.5 py-1.5 text-[10px] font-semibold text-unica-orange-dark transition-colors hover:bg-unica-orange-light disabled:pointer-events-none disabled:opacity-50"
        >
          <ListChecks className="h-3 w-3" aria-hidden />
          Ver todos mis trámites
        </button>

        {CASOS_DEMO.map((caso) => (
          <button
            key={caso.valor}
            type="button"
            onClick={() => probarCaso(caso.valor)}
            disabled={cargando}
            title={`${caso.etiqueta}: ${caso.descripcion}`}
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left transition-all hover:-translate-y-px hover:border-unica-orange-border hover:bg-unica-orange-light disabled:pointer-events-none disabled:opacity-50"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                PUNTO[caso.tono],
              )}
              aria-hidden
            />
            <span className="font-mono text-[10px] font-semibold text-slate-700">
              {caso.valor}
            </span>
            <span className="hidden text-[10px] text-slate-400 sm:inline">
              {caso.etiqueta}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={probarError}
          disabled={cargando}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:pointer-events-none disabled:opacity-50"
        >
          <AlertTriangle className="h-3 w-3" aria-hidden />
          Probar error 500
        </button>
      </div>

      {simularFallo ? (
        <p
          role="status"
          className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-red-600"
        >
          <AlertTriangle className="h-3 w-3" aria-hidden />
          La simulación está activa: la próxima consulta devolverá un error
          HTTP 500.
        </p>
      ) : null}
    </section>
  );
}
