import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#2E4739] text-white hover:bg-[#254032] shadow-md hover:shadow-lg",
        secondary: "bg-[#5a6d5e] text-white hover:bg-[#4a5d4e] shadow-md",
        accent: "bg-[#B2916F] text-white hover:bg-[#9a7d5f] shadow-md hover:shadow-lg",
        outline: "border-2 border-[#2E4739] text-[#2E4739] hover:bg-[#2E4739] hover:text-white",
        ghost: "hover:bg-[#e8e6df]",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
