import * as Tooltip from "@radix-ui/react-tooltip"
import type { ReactNode } from "react"

type Props = {
  label: ReactNode
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export default function InfoTooltip({ label, children, side = "top" }: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        {children}
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content className="tooltip-content" side={side} sideOffset={8}>
          {label}
          <Tooltip.Arrow className="tooltip-arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}