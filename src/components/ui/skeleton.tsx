import type * as React from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer rounded-lg", className)}
      {...props}
    />
  );
}

export { Skeleton };
