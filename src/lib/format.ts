const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const pad = (valor: number) => String(valor).padStart(2, "0");

/**
 * Interpreta "YYYY-MM-DD HH:mm" como hora local, evitando los
 * desplazamientos de zona horaria que produce `new Date("YYYY-MM-DD")`.
 */
export function parseFechaLocal(valor: string): Date {
  const [fecha = "", hora = "00:00"] = valor.trim().split(/\s+/);
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [horas, minutos] = hora.split(":").map(Number);

  if (!anio || !mes || !dia) return new Date(Number.NaN);

  return new Date(anio, mes - 1, dia, horas || 0, minutos || 0);
}

/** "12 de noviembre de 2026, 10:30 AM" — HU-04 */
export function formatearFechaHora(valor: string): string {
  const fecha = parseFechaLocal(valor);
  if (Number.isNaN(fecha.getTime())) return "—";

  const horas = fecha.getHours();
  const sufijo = horas >= 12 ? "PM" : "AM";
  const hora12 = horas % 12 || 12;

  return `${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}, ${hora12}:${pad(fecha.getMinutes())} ${sufijo}`;
}

/** "12/11/2026, 11:20 AM" — etiqueta compacta exigida por HU-04. */
export function formatearFechaHoraCorta(valor: string): string {
  const fecha = parseFechaLocal(valor);
  if (Number.isNaN(fecha.getTime())) return "—";

  const horas = fecha.getHours();
  const sufijo = horas >= 12 ? "PM" : "AM";
  const hora12 = horas % 12 || 12;

  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()}, ${hora12}:${pad(fecha.getMinutes())} ${sufijo}`;
}

/** "10/11/2026" */
export function formatearFechaCorta(valor: string): string {
  const fecha = parseFechaLocal(valor);
  if (Number.isNaN(fecha.getTime())) return "—";

  return `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
}

/** Serializa una fecha local al formato usado por la API ficticia. */
export function formatearFechaApi(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}

/** Texto relativo legible: "hace 2 horas", "hace 3 días", etc. */
export function tiempoRelativo(valor: string, ahora: Date = new Date()): string {
  const fecha = parseFechaLocal(valor);
  if (Number.isNaN(fecha.getTime())) return "";

  const minutos = Math.floor((ahora.getTime() - fecha.getTime()) / 60_000);

  if (minutos < 1) return "hace un momento";
  if (minutos < 60)
    return minutos === 1 ? "hace 1 minuto" : `hace ${minutos} minutos`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return horas === 1 ? "hace 1 hora" : `hace ${horas} horas`;

  const dias = Math.floor(horas / 24);
  return dias === 1 ? "hace 1 día" : `hace ${dias} días`;
}

/** "340 KB", "1,2 MB" */
export function formatearTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/** "••••6677" — evita exponer el DNI completo en pantalla. */
export function enmascararDni(dni?: string): string {
  if (!dni || dni.length < 4) return "—";
  return `••••${dni.slice(-4)}`;
}
