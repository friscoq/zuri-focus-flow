import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNudges, type NudgeVariant } from "@/contexts/NudgeContext"

// ADHD-specific notes:
// - Gentle motion only: use existing animation utilities and respect reduced motion.
// - Color: avoid harsh reds; use subtle emphasis based on semantic tokens.
// - Timing: interactions are debounced in context; card focuses on clarity and brevity.

export const SmartNudgeCardTestId = {
  root: "smart-nudge-card",
  dismiss: "smart-nudge-dismiss",
  action: "smart-nudge-action",
} as const

const nudgeCardVariants = cva(
  "relative rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring outline-none",
  {
    variants: {
      nudgeType: {
        suggestion: "",
        encouragement: "",
        warning: "",
        celebration: "",
      },
      shimmer: {
        true: "animate-pulse",
        false: "",
      },
      glow: {
        true: "shadow-[0_0_0_0_hsl(var(--warning,50_93%_58%)/0)] hover:shadow-[0_0_0_6px_hsl(var(--warning,50_93%_58%)/0.15)] focus:shadow-[0_0_0_6px_hsl(var(--warning,50_93%_58%)/0.2)]",
        false: "",
      },
    },
    defaultVariants: {
      nudgeType: "suggestion",
      shimmer: false,
      glow: true,
    },
  }
)

export interface SmartNudgeCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof nudgeCardVariants> {
  nudgeId: string
  nudgeText: string
  nudgeType?: NudgeVariant
  nudgeActionLabel?: string
  nudgeOnAction?: () => void
  onDismiss?: (id: string) => void
  error?: boolean
}

export const SmartNudgeCard = React.forwardRef<HTMLDivElement, SmartNudgeCardProps>(
  (
    {
      className,
      nudgeId,
      nudgeText,
      nudgeType = "suggestion",
      nudgeActionLabel,
      nudgeOnAction,
      shimmer = false,
      glow = true,
      error = false,
      onDismiss,
      ...props
    },
    ref
  ) => {
    const { dismiss } = useNudges()
    const truncated = (nudgeText ?? "").slice(0, 200)

    const handleDismiss = () => {
      onDismiss?.(nudgeId)
      dismiss(nudgeId)
    }

    return (
      <article
        ref={ref}
        role="note"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={0}
        className={cn(
          nudgeCardVariants({ nudgeType, shimmer, glow }),
          "p-4 sm:p-5 group hover-scale",
          className
        )}
        data-testid={SmartNudgeCardTestId.root}
        {...props}
      >
        <header className="flex items-start justify-between gap-3">
          <h3 className="text-base font-medium leading-snug">
            {labelForType(nudgeType)}
          </h3>
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Dismiss nudge"
            data-testid={SmartNudgeCardTestId.dismiss}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <p className={cn("mt-2 text-sm text-muted-foreground", error && "text-destructive")}
           title={truncated !== nudgeText ? nudgeText : undefined}
        >
          {truncated}
        </p>

        <footer className="mt-3 flex flex-wrap items-center gap-2">
          {nudgeActionLabel && (
            <button
              type="button"
              onClick={nudgeOnAction}
              className="inline-flex items-center rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-testid={SmartNudgeCardTestId.action}
            >
              {nudgeActionLabel}
            </button>
          )}
        </footer>
      </article>
    )
  }
)
SmartNudgeCard.displayName = "SmartNudgeCard"

function labelForType(type: NudgeVariant): string {
  switch (type) {
    case "suggestion":
      return "Smart suggestion"
    case "encouragement":
      return "Encouragement"
    case "warning":
      return "Heads up"
    case "celebration":
      return "Nice work!"
    default:
      return "Notice"
  }
}

// Container to render top of queue (or all) with FIFO and accessibility
export const SmartNudgeCenter: React.FC<{
  renderAll?: boolean
  className?: string
}> = ({ renderAll = false, className }) => {
  const { queue } = useNudges()
  const items = renderAll ? queue : queue.slice(-1) // show latest by default
  return (
    <section
      aria-label="Smart nudges"
      className={cn("space-y-3", className)}
    >
      {items.map((n) => (
        <SmartNudgeCard
          key={n.id}
          nudgeId={n.id}
          nudgeText={n.nudgeText}
          nudgeType={n.nudgeType}
          nudgeActionLabel={n.nudgeActionLabel}
          nudgeOnAction={n.nudgeOnAction}
        />
      ))}
    </section>
  )
}

// Example usage snippet (copy-pasteable, Next.js/React-ready):
//
// import { NudgeProvider, useNudges, SmartNudgeCenter } from "@/components/SmartNudge";
//
// function Demo() {
//   const { enqueue } = useNudges()
//   return (
//     <div>
//       <button onClick={() => enqueue({
//         nudgeText: "Try a 25-min focus session and a quick stretch after.",
//         nudgeType: "suggestion",
//         nudgeActionLabel: "Start Focus",
//         nudgeOnAction: () => console.log("start focus")
//       })}>Enqueue</button>
//       <SmartNudgeCenter />
//     </div>
//   )
// }
//
// export default function App() {
//   return (
//     <NudgeProvider>
//       <Demo />
//     </NudgeProvider>
//   )
// }

export { NudgeProvider } from "@/contexts/NudgeContext"
