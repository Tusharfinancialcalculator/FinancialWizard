import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Helper component for calculator inputs
interface TooltipHintProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

const TooltipHint = React.forwardRef<HTMLDivElement, TooltipHintProps>(
  ({ content, side = "right", align = "center", className, ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={ref}
          className={cn("inline-flex items-center justify-center", className)}
          {...props}
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
        </div>
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
)
TooltipHint.displayName = "TooltipHint"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipHint }