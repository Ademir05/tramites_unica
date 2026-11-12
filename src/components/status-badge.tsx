import { Badge } from "@/components/ui/badge";
import { META_ESTADO } from "@/lib/estados";
import type { EstadoSolicitud } from "@/lib/types";
import { cn } from "@/lib/utils";

const PUNTO: Record<string, string> = {
  brand: "bg-unica-orange",
  warning: "bg-amber-500",
  info: "bg-sky-500",
  success: "bg-green-500",
  danger: "bg-red-500",
};

interface StatusBadgeProps {
  estado: EstadoSolicitud;
  className?: string;
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const meta = META_ESTADO[estado];

  return (
    <Badge
      variant={meta.tono}
      className={cn(
        "px-3.5 py-1.5 text-[11px]",
        meta.tono === "brand" &&
          "border-unica-orange bg-unica-orange text-white shadow-sm shadow-unica-orange-dark/20",
        className,
      )}
      aria-label={`Estado del trámite: ${meta.etiqueta}`}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          meta.tono === "brand" ? "bg-white" : PUNTO[meta.tono],
          meta.tono === "brand" && "animate-pulse",
        )}
        aria-hidden
      />
      {meta.etiqueta}
    </Badge>
  );
}
