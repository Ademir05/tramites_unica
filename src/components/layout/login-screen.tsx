"use client";

import {
  GraduationCap,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CURRENT_STUDENT_SESSION } from "@/lib/mock-data";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function LoginScreen() {
  const iniciarSesion = useSeguimientoStore((state) => state.iniciarSesion);
  const iniciales = CURRENT_STUDENT_SESSION.nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen items-center justify-center bg-unica-bg px-4 py-10">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="unica-gradient p-6 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <GraduationCap className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
            Campus Virtual UNICA
          </p>
          <h1 className="mt-1 text-xl font-bold">Sesión finalizada</h1>
          <p className="mt-1 text-xs leading-relaxed text-white/85">
            Para consultar tus trámites académicos, vuelve a ingresar con tu
            cuenta institucional.
          </p>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-unica-orange-light text-xs font-bold text-unica-orange-dark ring-1 ring-unica-orange-border">
              {iniciales}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {CURRENT_STUDENT_SESSION.nombreCompleto}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                Cod. {CURRENT_STUDENT_SESSION.codigoUniversitario} ·{" "}
                {CURRENT_STUDENT_SESSION.facultad}
              </p>
            </div>
            <UserRound
              className="ml-auto h-4 w-4 shrink-0 text-slate-400"
              aria-hidden
            />
          </div>

          <Button
            type="button"
            size="lg"
            className="mt-4 w-full"
            onClick={iniciarSesion}
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Ingresar con Campus Virtual UNICA
          </Button>

          <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-500">
            <ShieldCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-unica-orange"
              aria-hidden
            />
            Acceso simulado mediante SSO institucional. Tus consultas quedan
            limitadas a las solicitudes de tu propia cuenta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
