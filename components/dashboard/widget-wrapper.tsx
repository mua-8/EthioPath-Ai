"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeSlash, ArrowUp, ArrowDown, DotsSixVertical } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"

interface WidgetWrapperProps {
  id: string
  title: string
  visible: boolean
  isEditMode: boolean
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  children: ReactNode
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  id,
  title,
  visible,
  isEditMode,
  onToggle,
  onMoveUp,
  onMoveDown,
  children
}) => {
  if (!visible && !isEditMode) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0.4, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative group ${!visible && isEditMode ? "grayscale" : ""}`}
    >
      {isEditMode && (
        <div className="absolute -top-3 -left-3 -right-3 -bottom-3 border-2 border-dashed border-[var(--color-emerald-500)]/30 rounded-2xl pointer-events-none z-0" />
      )}
      
      {isEditMode && (
        <div className="absolute top-2 right-2 z-50 flex items-center gap-1 bg-[var(--color-charcoal-800)]/90 backdrop-blur-sm p-1 rounded-lg border border-[var(--color-charcoal-700)] shadow-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            className="h-7 w-7 text-[var(--color-charcoal-400)] hover:text-white"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            className="h-7 w-7 text-[var(--color-charcoal-400)] hover:text-white"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-[var(--color-charcoal-700)] mx-0.5" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={`h-7 w-7 ${visible ? "text-white" : "text-red-400"}`}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeSlash className="h-4 w-4" />}
          </Button>
          <div className="w-px h-4 bg-[var(--color-charcoal-700)] mx-0.5" />
          <div className="px-2 py-1 flex items-center gap-1.5 cursor-grab active:cursor-grabbing text-[var(--color-charcoal-400)]">
             <DotsSixVertical className="h-4 w-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
          </div>
        </div>
      )}

      <div className={isEditMode ? "pointer-events-none opacity-80" : ""}>
        {children}
      </div>
    </motion.div>
  )
}
