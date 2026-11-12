import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-unica-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-unica-orange text-white shadow-sm shadow-unica-orange-dark/20 hover:bg-unica-orange-dark",
        secondary:
          "bg-unica-orange-light text-unica-orange-dark hover:bg-unica-orange-border",
        outline:
          "border border-unica-orange-border bg-white text-unica-orange-dark hover:bg-unica-orange-light",
        ghost:
          "text-slate-600 hover:bg-unica-orange-light hover:text-unica-orange-dark",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        success:
          "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20 hover:bg-emerald-700",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
