import {
  CheckCircle2,
  Clock,
  Headset,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recomendaciones = [
  "Ten a mano tu código de solicitud al comunicarte con la oficina.",
  "Revisa la documentación pendiente antes de acudir presencialmente.",
  "Espera 24 horas hábiles antes de consultar por el mismo trámite.",
];

export function HelpSidebar() {
  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-unica-orange-light text-unica-orange-dark">
              <Headset className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
              <CardDescription>
                Comunícate con la Mesa de Partes Virtual UNICA antes de acudir
                a la oficina.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-1">
          <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-unica-orange-dark"
              aria-hidden
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Mesa de Partes Virtual UNICA
              </p>
              <p className="text-xs font-medium text-slate-700">
                Ciudad Universitaria, Ica, Perú
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
            <Phone
              className="mt-0.5 h-4 w-4 shrink-0 text-unica-orange-dark"
              aria-hidden
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Teléfono
              </p>
              <a
                href="tel:+5156234567"
                className="text-xs font-medium text-slate-700 transition-colors hover:text-unica-orange-dark"
              >
                (056) 234-567 · Anexo 204
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
            <Mail
              className="mt-0.5 h-4 w-4 shrink-0 text-unica-orange-dark"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Correo
              </p>
              <a
                href="mailto:mesadepartes@unica.edu.pe"
                className="break-all text-xs font-medium text-slate-700 transition-colors hover:text-unica-orange-dark"
              >
                mesadepartes@unica.edu.pe
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-unica-orange-dark"
              aria-hidden
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Horario de atención
              </p>
              <p className="text-xs font-medium text-slate-700">
                Lunes a viernes, 8:00 AM – 5:00 PM
              </p>
            </div>
          </div>

          <Badge variant="brand" className="w-full justify-center py-1.5">
            Respuesta estimada: 1 día hábil
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden />
            <CardTitle className="text-sm">Recomendaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-1">
          <ul className="space-y-2.5">
            {recomendaciones.map((recomendacion) => (
              <li
                key={recomendacion}
                className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500"
              >
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500"
                  aria-hidden
                />
                {recomendacion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
