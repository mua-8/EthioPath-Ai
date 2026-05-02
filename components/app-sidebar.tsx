"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  Sparkle,
  House, 
  ChatCircleDots, 
  CalendarCheck,
  Target, 
  Briefcase, 
  CurrencyDollar,
  CheckSquare,
  BookOpen,
  Gear,
  CaretLeft,
  CaretRight,
  SignOut,
  X
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface UserProfile {
  full_name: string | null
  university: string | null
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
    description: "Overview & stats",
  },
  {
    label: "AI Chat",
    href: "/chat",
    icon: ChatCircleDots,
    description: "Ask anything",
  },
  {
    label: "Study Planner",
    href: "/study",
    icon: CalendarCheck,
    description: "Plan your studies",
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    icon: Target,
    description: "Your success path",
  },
  {
    label: "Career",
    href: "/career",
    icon: Briefcase,
    description: "Jobs & internships",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: CurrencyDollar,
    description: "Budget & income",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    description: "Productivity",
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen,
    description: "Learning materials",
  },
]

const BOTTOM_NAV_ITEMS = [
  {
    label: "Settings",
    href: "/settings",
    icon: Gear,
  },
]

interface AppSidebarProps {
  profile?: UserProfile | null
  isOpen?: boolean
  onClose?: () => void
}

export function AppSidebar({ profile, isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "ST"

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 flex flex-col h-svh border-r border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-950)] transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Header */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-[var(--color-charcoal-800)]",
          isCollapsed && "justify-center px-2"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-[var(--color-charcoal-900)] flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="EthioPath AI Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-[var(--color-charcoal-50)] truncate">
                EthioPath AI
              </h1>
            </div>
          )}
          {/* Mobile close button */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[var(--color-charcoal-400)]"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]"
                    : "text-[var(--color-charcoal-400)] hover:bg-[var(--color-charcoal-900)] hover:text-[var(--color-charcoal-200)]",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors flex-shrink-0",
                  isActive 
                    ? "bg-[var(--color-emerald-500)]/20" 
                    : "bg-[var(--color-charcoal-800)] group-hover:bg-[var(--color-charcoal-700)]"
                )}>
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className="h-5 w-5"
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isActive ? "text-[var(--color-emerald-400)]" : "text-[var(--color-charcoal-200)]"
                    )}>
                      {item.label}
                    </p>
                    <p className="text-xs text-[var(--color-charcoal-500)] truncate">
                      {item.description}
                    </p>
                  </div>
                )}
                {!isCollapsed && isActive && (
                  <div className="w-1.5 h-8 rounded-full bg-[var(--color-emerald-500)]" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--color-charcoal-800)] p-3 space-y-2">
        {/* Settings */}
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]"
                  : "text-[var(--color-charcoal-400)] hover:bg-[var(--color-charcoal-900)] hover:text-[var(--color-charcoal-200)]",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                weight={isActive ? "fill" : "regular"}
                className="h-5 w-5"
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--color-charcoal-900)]",
          isCollapsed && "justify-center px-2"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-emerald-500)]/20 text-[var(--color-emerald-400)] text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-charcoal-100)] truncate">
                {profile?.full_name || "Student"}
              </p>
              <p className="text-xs text-[var(--color-charcoal-500)] truncate">
                {profile?.university?.split(" ").slice(0, 2).join(" ") || "University"}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <form action="/auth/signout" method="post">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[var(--color-charcoal-500)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
              >
                <SignOut className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full text-[var(--color-charcoal-500)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]",
            isCollapsed && "px-2"
          )}
        >
          {isCollapsed ? (
            <CaretRight className="h-4 w-4" />
          ) : (
            <>
              <CaretLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  </>
  )
}
