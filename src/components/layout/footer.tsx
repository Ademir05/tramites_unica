import {
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const enlaces = [
  { etiqueta: "Preguntas frecuentes", href: "#ayuda" },
  { etiqueta: "Mesa de Partes Virtual", href: "#ayuda" },
  { etiqueta: "Reglamento de trámites", href: "#ayuda" },
  { etiqueta: "Política de privacidad", href: "#ayuda" },
];

export function Footer() {
  return (
    <footer
      id="ayuda"
      className="mt-12 border-t-4 border-unica-orange bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-unica-orange text-white">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Campus Virtual UNICA
                </p>
                <p className="text-[11px] text-slate-500">
                  Universidad Nacional San Luis Gonzaga de Ica
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-500">
              Módulo de seguimiento de trámites académicos para estudiantes
              autenticados. Consulta únicamente las solicitudes asociadas a tu
              cuenta institucional.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="brand">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                Acceso seguro
              </Badge>
              <Badge variant="neutral">Prototipo · Datos ficticios</Badge>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-unica-orange-dark">
              Canales de atención
            </h2>
            <ul className="mt-4 space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-unica-orange"
                  aria-hidden
                />
                <span>
                  Ciudad Universitaria, Ica
                  <br />
                  Perú
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="h-4 w-4 shrink-0 text-unica-orange"
                  aria-hidden
                />
                <a
                  href="tel:+5156234567"
                  className="transition-colors hover:text-unica-orange-dark"
                >
                  (056) 234-567 · Anexo 204
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail
                  className="h-4 w-4 shrink-0 text-unica-orange"
                  aria-hidden
                />
                <a
                  href="mailto:campusvirtual@unica.edu.pe"
                  className="break-all transition-colors hover:text-unica-orange-dark"
                >
                  campusvirtual@unica.edu.pe
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-unica-orange"
                  aria-hidden
                />
                <span>
                  Lunes a viernes, 8:00 AM – 5:00 PM
                  <br />
                  <span className="text-slate-400">
                    Mesa de Partes Virtual UNICA
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-unica-orange-dark">
              Enlaces de interés
            </h2>
            <ul className="mt-4 space-y-2.5 text-xs">
              {enlaces.map((enlace) => (
                <li key={enlace.etiqueta}>
                  <a
                    href={enlace.href}
                    className="text-slate-600 transition-colors hover:text-unica-orange-dark"
                  >
                    {enlace.etiqueta}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-unica-orange-border bg-unica-orange-light p-3">
              <p className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden
                />
                Servicio operativo
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                Portal disponible las 24 horas. Los datos mostrados son de
                demostración.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Universidad Nacional San Luis Gonzaga de Ica.</p>
          <p>Prototipo de alta fidelidad · Sprint 1 y Sprint 2 · HU-01 a HU-04</p>
        </div>
      </div>
    </footer>
  );
}
