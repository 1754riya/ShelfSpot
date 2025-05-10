import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform active:scale-95", // Added active:scale-95 and ensured transition-all
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-lg hover:shadow-primary/30 dark:hover:shadow-primary/40", // Added hover shadow
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-lg hover:shadow-destructive/30 dark:hover:shadow-destructive/40", // Added hover shadow
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-md hover:shadow-accent/20 dark:hover:shadow-accent/30", // Enhanced hover for outline
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:shadow-md hover:shadow-secondary/20 dark:hover:shadow-secondary/30", // Added hover shadow
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:shadow-accent/10 dark:hover:shadow-accent/20", // Added subtle hover shadow
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base", // Ensure text size scales with button
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
