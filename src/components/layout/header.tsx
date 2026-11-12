"use client";

import {
  BookOpen,
  ChevronRight,
  FileText,
  GraduationCap,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

const NAVEGACION = [
  { etiqueta: "Mis Cursos", href: "#", Icono: BookOpen, activo: false },
  {
    etiqueta: "Mis Trámites",
    href: "/campusvirtual/mis-tramites",
    Icono: FileText,
    activo: true,
  },
  { etiqueta: "Perfil", href: "#", Icono: UserRound, activo: false },
];

export function Header() {
  const sesion = useSeguimientoStore((state) => state.sesion);
  const cerrarSesion = useSeguimientoStore((state) => state.cerrarSesion);

  if (!sesion) return null;

  const iniciales = sesion.nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="relative z-30">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-unica-orange-dark focus:shadow-lg"
      >
        Saltar al contenido
      </a>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-unica-orange text-white shadow-sm shadow-unica-orange-dark/20">
              <GraduationCap className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-unica-orange-dark">
                UNICA
              </p>
              <p className="text-base font-bold leading-tight text-slate-900">
                Campus Virtual
              </p>
              <p className="hidden truncate text-[10px] text-slate-500 sm:block">
                Universidad Nacional San Luis Gonzaga de Ica
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold text-slate-800">
                {sesion.nombreCompleto}
              </p>
              <p className="text-[10px] text-slate-500">
                Cod. {sesion.codigoUniversitario} · {sesion.facultad}
              </p>
            </div>

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-unica-orange-light text-xs font-bold text-unica-orange-dark ring-1 ring-unica-orange-border"
              aria-label={`Sesión de ${sesion.nombreCompleto}`}
            >
              {iniciales}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cerrarSesion}
              className="border-slate-200 text-slate-600 hover:border-unica-orange-border hover:bg-unica-orange-light hover:text-unica-orange-dark"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <nav
          aria-label="Navegación del Campus Virtual"
          className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8"
        >
          {NAVEGACION.map(({ etiqueta, href, Icono, activo }) => (
            <a
              key={etiqueta}
              href={href}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-semibold transition-colors",
                activo
                  ? "border-unica-orange text-unica-orange-dark"
                  : "border-transparent text-slate-500 hover:border-unica-orange-border hover:text-unica-orange-dark",
              )}
            >
              <Icono className="h-3.5 w-3.5" aria-hidden />
              {etiqueta}
            </a>
          ))}

          <div className="ml-auto hidden items-center gap-1.5 py-3 text-[10px] font-medium text-emerald-700 sm:flex">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden
            />
            Sesión SSO activa
          </div>
        </nav>
      </div>

      <div className="unica-gradient">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <FileText className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold">
                Seguimiento de Trámites Académicos
              </p>
              <p className="text-[10px] text-white/85">
                Módulo institucional · Campus Virtual UNICA
              </p>
            </div>
          </div>

          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1 text-[10px] text-white/80"
          >
            <a href="#" className="transition-colors hover:text-white">
              Inicio
            </a>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <a href="#" className="transition-colors hover:text-white">
              Mis trámites
            </a>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="flex items-center gap-1 font-semibold text-white">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Seguimiento
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
}
