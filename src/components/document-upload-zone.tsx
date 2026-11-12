"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Send,
  UploadCloud,
  X,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatearTamano } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function DocumentUploadZone() {
  const archivos = useSeguimientoStore((state) => state.archivos);
  const agregarArchivos = useSeguimientoStore(
    (state) => state.agregarArchivos,
  );
  const eliminarArchivo = useSeguimientoStore(
    (state) => state.eliminarArchivo,
  );
  const enviarSubsanacion = useSeguimientoStore(
    (state) => state.enviarSubsanacion,
  );
  const enviando = useSeguimientoStore((state) => state.enviando);
  const errorSubsanacion = useSeguimientoStore(
    (state) => state.errorSubsanacion,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [rechazados, setRechazados] = useState<string[]>([]);

  const procesar = (lista: FileList | File[]) => {
    const entrantes = Array.from(lista).map((archivo) => ({
      nombre: archivo.name,
      tamano: archivo.size,
      tipo: archivo.type,
    }));

    setRechazados(agregarArchivos(entrantes));
  };

  const alSeleccionar = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      procesar(event.target.files);
    }
    event.target.value = "";
  };

  const alSoltar = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setArrastrando(false);

    if (event.dataTransfer.files?.length) {
      procesar(event.dataTransfer.files);
    }
  };

  const cargando = archivos.some((archivo) => archivo.estado === "subiendo");
  const puedeEnviar = archivos.length > 0 && !cargando && !enviando;

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={alSoltar}
        className={cn(
          "rounded-xl border-2 border-dashed p-5 text-center transition-colors sm:p-6",
          arrastrando
            ? "border-unica-orange bg-unica-orange-light"
            : "border-slate-200 bg-slate-50/60 hover:border-unica-orange-border",
        )}
      >
        <input
          ref={inputRef}
          id="documentos"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="sr-only"
          onChange={alSeleccionar}
          disabled={enviando}
          aria-label="Seleccionar archivos para la subsanación"
        />

        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-unica-orange-dark shadow-sm ring-1 ring-slate-200">
          <UploadCloud className="h-5 w-5" aria-hidden />
        </div>

        <p className="mt-2.5 text-sm font-semibold text-slate-800">
          Arrastra tus archivos aquí
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          o selecciónalos desde tu dispositivo
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
        >
          <UploadCloud className="h-3.5 w-3.5" aria-hidden />
          Seleccionar archivos
        </Button>

        <p className="mt-3 text-[10px] text-slate-400">
          Formatos permitidos: PDF, JPG o PNG · Máximo 5 MB por archivo
        </p>
      </div>

      {archivos.length > 0 ? (
        <ul className="mt-4 space-y-2" aria-label="Archivos adjuntos">
          {archivos.map((archivo) => {
            const esImagen = archivo.tipo.startsWith("image/");
            const Icono = esImagen ? ImageIcon : FileText;

            return (
              <li
                key={archivo.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Icono className="h-4 w-4" aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium text-slate-700">
                      {archivo.nombre}
                    </p>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {formatearTamano(archivo.tamano)}
                    </span>
                  </div>

                  {archivo.estado === "subiendo" ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <Progress
                        value={archivo.progreso}
                        className="h-1"
                        label={`Cargando ${archivo.nombre}`}
                      />
                      <span className="w-7 shrink-0 text-right text-[10px] tabular-nums text-slate-400">
                        {archivo.progreso}%
                      </span>
                    </div>
                  ) : (
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                      Archivo cargado
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => eliminarArchivo(archivo.id)}
                  disabled={enviando}
                  aria-label={`Eliminar ${archivo.nombre}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {rechazados.length > 0 ? (
        <Alert variant="danger" className="mt-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <AlertTitle>Algunos archivos no se agregaron</AlertTitle>
            <AlertDescription>
              <ul className="mt-1.5 space-y-1">
                {rechazados.map((mensaje) => (
                  <li key={mensaje} className="text-xs">
                    {mensaje}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </div>
        </Alert>
      ) : null}

      {errorSubsanacion ? (
        <Alert variant="danger" className="mt-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <AlertTitle>No se pudo enviar la subsanación</AlertTitle>
            <AlertDescription>{errorSubsanacion}</AlertDescription>
          </div>
        </Alert>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-relaxed text-slate-500">
          {archivos.length === 0
            ? "Adjunta al menos un archivo para habilitar el envío."
            : cargando
              ? "Espera a que los archivos terminen de cargarse."
              : `${archivos.length} ${archivos.length === 1 ? "archivo listo" : "archivos listos"} para enviar.`}
          <span className="mt-0.5 block text-[10px] text-slate-400">
            La carga es simulada en el Campus Virtual UNICA y no envía datos
            reales.
          </span>
        </p>

        <Button
          type="button"
          onClick={() => void enviarSubsanacion()}
          disabled={!puedeEnviar}
          className="w-full sm:w-auto"
        >
          {enviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Enviar subsanación
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
