"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Gear, SignOut } from "@phosphor-icons/react"
import Link from "next/link"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationPanel } from "./notification-panel"

interface DashboardHeaderProps {
  greeting: string
  firstName: string
  profile: any
  initials: string
}

export function DashboardHeader({ greeting, firstName, profile, initials }: DashboardHeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--color-emerald-400)] font-medium">{greeting}</p>
            <h1 className="text-base font-semibold text-[var(--color-charcoal-100)]">{firstName}'s Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsNotifOpen(true)}
                className="text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-emerald-500)] text-[10px] font-bold text-white border-2 border-[var(--background)]">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]">
                <Gear className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-[var(--color-charcoal-700)] mx-1" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-emerald-500)]/20 text-[var(--color-emerald-400)] text-sm font-semibold">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[var(--color-charcoal-100)] leading-tight">{profile.full_name}</p>
                <p className="text-xs text-[var(--color-charcoal-500)]">{profile.university?.split(" ").slice(0, 2).join(" ")}</p>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="ghost" size="icon" className="text-[var(--color-charcoal-400)] hover:text-red-400 hover:bg-[var(--color-charcoal-800)]">
                <SignOut className="h-5 w-5" />
              </Button>
            </form>
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
