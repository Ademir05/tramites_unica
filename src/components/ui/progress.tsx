import type * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<"div"> {
  value: number;
  indicatorClassName?: string;
  label?: string;
}

function Progress({
  value,
  className,
  indicatorClassName,
  label,
  ...props
}: ProgressProps) {
  const seguro = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={seguro}
      aria-label={label}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-slate-100",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-unica-orange transition-[width] duration-300 ease-out",
          indicatorClassName,
        )}
        style={{ width: `${seguro}%` }}
      />
    </div>
  );
}

export { Progress };
