"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  House, 
  ChatCircleDots, 
  Target, 
  Briefcase, 
  CurrencyDollar
} from "@phosphor-icons/react"

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Chat",
    href: "/chat",
    icon: ChatCircleDots,
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    icon: Target,
  },
  {
    label: "Career",
    href: "/career",
    icon: Briefcase,
  },
  {
    label: "Finance",
    href: "/finance",
    icon: CurrencyDollar,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient fade effect at top */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
      
      {/* Navigation bar */}
      <div className="bg-[var(--color-charcoal-900)]/95 backdrop-blur-xl border-t border-[var(--color-charcoal-800)] px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive
                    ? "text-[var(--color-emerald-400)]"
                    : "text-[var(--color-charcoal-500)] active:text-[var(--color-charcoal-300)]"
                }`}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[var(--color-emerald-500)]" />
                )}
                
                {/* Icon with active background */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--color-emerald-500)]/15"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    weight={isActive ? "fill" : "regular"}
                    className={`h-6 w-6 transition-transform duration-200 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
                
                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[var(--color-emerald-400)]"
                      : "text-[var(--color-charcoal-500)]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
