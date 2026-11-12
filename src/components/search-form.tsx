"use client";

import { useRef, type FormEvent } from "react";
import { Loader2, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function SearchForm() {
  const consultar = useSeguimientoStore((state) => state.consultar);
  const vista = useSeguimientoStore((state) => state.vista);
  const valor = useSeguimientoStore((state) => state.textoConsulta);
  const setValor = useSeguimientoStore((state) => state.setTextoConsulta);
  const error = useSeguimientoStore((state) => state.errorValidacion);
  const setError = useSeguimientoStore((state) => state.setErrorValidacion);

  const inputRef = useRef<HTMLInputElement>(null);
  const cargando = vista === "cargando";

  const enviar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const limpio = valor.trim();

    if (!limpio) {
      setError("Ingresa un código de solicitud o el tipo de trámite.");
      inputRef.current?.focus();
      return;
    }

    if (!/^[\p{L}\p{N}\s-]{3,60}$/u.test(limpio)) {
      setError(
        "El dato ingresado no es válido. Usa un código como SOL-UNICA-2026-001 o un tipo de trámite.",
      );
      inputRef.current?.focus();
      return;
    }

    setError(null);
    void consultar(limpio);
  };

  return (
    <form onSubmit={enviar} noValidate className="mt-4">
      <label
        htmlFor="consulta"
        className="text-xs font-semibold text-slate-700"
      >
        Código de solicitud o tipo de trámite
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            ref={inputRef}
            id="consulta"
            name="consulta"
            value={valor}
            onChange={(event) => {
              setValor(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej.: SOL-UNICA-2026-001 o Constancia"
            autoComplete="off"
            spellCheck={false}
            maxLength={60}
            aria-invalid={Boolean(error)}
            aria-describedby={cn(
              "ayuda-consulta",
              error && "error-consulta",
            )}
            className={cn(
              "h-12 pl-10.5 pr-4 text-[15px]",
              error &&
                "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100",
            )}
            disabled={cargando}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 shrink-0 px-6 sm:min-w-44"
          disabled={cargando}
        >
          {cargando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden />
              Buscar trámite
            </>
          )}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p id="ayuda-consulta" className="text-[11px] text-slate-500">
          Busca por código completo o por tipo de trámite. Solo se consultará
          entre las solicitudes de tu cuenta.
        </p>
        <p className="flex items-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="h-3 w-3 text-unica-orange" aria-hidden />
          Acceso filtrado por estudiante
        </p>
      </div>

      {error ? (
        <p
          id="error-consulta"
          role="alert"
          className="mt-2 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
