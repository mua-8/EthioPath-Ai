"use client"

import { Button } from "@/components/ui/button"
import { List, Bell, Sparkle } from "@phosphor-icons/react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { NotificationPanel } from "./notification-panel"
import { useNotifications } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  onOpenSidebar: () => void
  title: string
}

export function MobileHeader({ onOpenSidebar, title }: MobileHeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[var(--color-charcoal-400)]"
              onClick={onOpenSidebar}
            >
              <List className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg overflow-hidden bg-[var(--color-charcoal-900)] flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-bold text-[var(--color-charcoal-50)]">EthioPath</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[var(--color-charcoal-400)]"
                onClick={() => setIsNotifOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-emerald-500)] text-[10px] font-bold text-white border-2 border-[var(--background)]">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />
    </>
  )
}
