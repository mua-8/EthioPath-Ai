"use client"

import { useNotifications, Notification } from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  Check, 
  Trash, 
  Clock, 
  Target, 
  BookOpen, 
  CurrencyDollar, 
  X,
  Sparkle
} from "@phosphor-icons/react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

const TYPE_ICONS = {
  task: <Clock className="h-4 w-4" />,
  goal: <Target className="h-4 w-4" />,
  study: <BookOpen className="h-4 w-4" />,
  finance: <CurrencyDollar className="h-4 w-4" />,
  system: <Sparkle className="h-4 w-4" />,
}

const TYPE_COLORS = {
  task: "bg-blue-500/10 text-blue-500",
  goal: "bg-purple-500/10 text-purple-500",
  study: "bg-emerald-500/10 text-emerald-500",
  finance: "bg-amber-500/10 text-amber-500",
  system: "bg-rose-500/10 text-rose-500",
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, loading } = useNotifications()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-950)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-charcoal-800)]">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--color-charcoal-50)]">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-[var(--color-emerald-500)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--color-charcoal-400)]">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions */}
            <div className="px-6 py-3 flex items-center justify-between bg-[var(--color-charcoal-900)]/50 border-b border-[var(--color-charcoal-800)]">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs text-[var(--color-emerald-500)] hover:text-[var(--color-emerald-400)] hover:bg-[var(--color-emerald-500)]/10"
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Mark all read
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <Trash className="h-3.5 w-3.5 mr-1.5" />
                Clear all
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-2">
              {loading ? (
                <div className="flex flex-col gap-4 px-6 py-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-xl bg-[var(--color-charcoal-900)] animate-pulse" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-10">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-charcoal-900)] flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-[var(--color-charcoal-600)]" />
                  </div>
                  <h3 className="text-[var(--color-charcoal-100)] font-semibold mb-1">No notifications yet</h3>
                  <p className="text-sm text-[var(--color-charcoal-500)]">
                    Stay tuned! We'll alert you about upcoming tasks and study plans.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-charcoal-800)]">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => !n.is_read && markAsRead(n.id)}
                      className={cn(
                        "px-6 py-5 cursor-pointer transition-colors hover:bg-[var(--color-charcoal-900)] relative group",
                        !n.is_read && "bg-[var(--color-emerald-500)]/[0.03]"
                      )}
                    >
                      {!n.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-emerald-500)]" />
                      )}
                      
                      <div className="flex gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          TYPE_COLORS[n.type]
                        )}>
                          {TYPE_ICONS[n.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className={cn(
                              "text-sm font-bold truncate",
                              n.is_read ? "text-[var(--color-charcoal-200)]" : "text-[var(--color-charcoal-50)]"
                            )}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-[var(--color-charcoal-500)] whitespace-nowrap">
                              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-charcoal-400)] leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
