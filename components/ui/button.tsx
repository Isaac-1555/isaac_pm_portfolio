import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest font-industrial border-2 relative isolate overflow-hidden before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-[350ms] before:ease-out before:content-[''] before:-z-10",
  {
    variants: {
      variant: {
        default: "bg-cta text-white before:bg-tech hover:before:scale-y-100 hover:shadow-[4px_4px_0px_var(--color-bg-dark)] border-bg-dark active:translate-y-[2px] active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground before:bg-destructive/90 hover:before:scale-y-100 border-destructive",
        outline:
          "bg-transparent text-bg-dark before:bg-bg-dark hover:before:scale-y-100 hover:text-white border-bg-dark",
        secondary:
          "bg-bg-accent text-white before:bg-bg-dark hover:before:scale-y-100 border-bg-dark",
        ghost: "before:bg-accent hover:before:scale-y-100 hover:text-accent-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent before:bg-accent hover:before:scale-y-100",
        gold: "bg-gold text-bg-dark before:bg-tech hover:before:scale-y-100 hover:text-white border-bg-dark hover:shadow-[4px_4px_0px_var(--color-bg-dark)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-11 rounded-sm px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        data-cursor-target={props.disabled ? undefined : "button"}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
