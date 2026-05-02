"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { MobileHeader } from "@/components/mobile-header"
import { NotificationProvider } from "@/providers/notification-provider"

interface AppLayoutClientProps {
  children: React.ReactNode
  profile: any
}

export function AppLayoutClient({ children, profile }: AppLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <NotificationProvider>
      <div className="flex min-h-svh bg-[var(--background)]">
      {/* Sidebar (Responsive Drawer) */}
      <AppSidebar 
        profile={profile} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header */}
        <MobileHeader 
          onOpenSidebar={() => setSidebarOpen(true)} 
          title="EthioPath" 
        />
        
        <div className="flex-1 pb-24 md:pb-0">
          {children}
        </div>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
      </div>
    </div>
    </NotificationProvider>
  )
}
