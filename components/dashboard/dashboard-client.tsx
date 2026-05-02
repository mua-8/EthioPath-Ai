"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Sparkle, 
  ChatCircleDots, 
  Target, 
  CalendarCheck, 
  Trophy, 
  CheckCircle, 
  Star, 
  Lightning,
  CaretRight,
  PencilSimple,
  Check,
  X,
  ArrowsClockwise
} from "@phosphor-icons/react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { useDashboardSettings } from "@/hooks/use-dashboard-settings"
import { WidgetWrapper } from "./widget-wrapper"
import { DashboardHeader } from "@/components/dashboard-header"
import { motion, AnimatePresence } from "framer-motion"

interface DashboardClientProps {
  profile: any
  greeting: string
  firstName: string
  initials: string
}

const QUICK_ACTIONS = [
  { id: "ai-mentor", icon: ChatCircleDots, title: "AI Mentor", description: "Get career advice", href: "/chat" },
  { id: "roadmap", icon: Target, title: "Career Path", description: "Software Engineering", href: "/roadmap" },
  { id: "study", icon: CalendarCheck, title: "Study Plan", description: "3 tasks for today", href: "/study" },
  { id: "goals", icon: Trophy, title: "Goals", description: "Internship prep", href: "/goals" },
]

const RECENT_ACTIVITIES = [
  { icon: CheckCircle, title: "Completed Data Structures intro", time: "2 hours ago", type: "success" },
  { icon: Star, title: "Reached 7-day study streak", time: "Yesterday", type: "achievement" },
  { icon: Lightning, title: "AI suggested: Upwork Guide", time: "3 hours ago", type: "unlock" },
]

const ROADMAP_STEPS = [
  { title: "Foundational GPA", description: "Maintain 3.5+ in core engineering courses", status: "completed", progress: 100 },
  { title: "Technical Portfolio", description: "Build 3 projects using React & Supabase", status: "current", progress: 45 },
  { title: "Internship Search", description: "Apply to Ethiopian tech companies (e.g., Gebeya, EagleLion)", status: "upcoming", progress: 0 },
  { title: "Freelance Launch", description: "Set up Upwork profile for web development", status: "upcoming", progress: 0 },
]

export function DashboardClient({ profile, greeting, firstName, initials }: DashboardClientProps) {
  const { 
    layout, 
    isEditMode, 
    setIsEditMode, 
    toggleWidget, 
    moveWidget, 
    saveSettings, 
    resetToDefault 
  } = useDashboardSettings()

  const handleSave = async () => {
    await saveSettings(layout)
    setIsEditMode(false)
  }

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "profile":
        return (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-emerald-500)] to-[var(--color-emerald-700)] p-6 md:p-8 shadow-xl shadow-emerald-500/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {firstName}!</h2>
                <p className="text-emerald-100/80 max-w-md">
                  You've completed 65% of your weekly goals. Keep up the momentum to stay on track for your career!
                </p>
              </div>
              <Button className="w-fit bg-white text-[var(--color-emerald-600)] hover:bg-emerald-50 font-semibold px-6 rounded-xl">
                Continue Learning
              </Button>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
              <Sparkle weight="fill" className="h-64 w-64 text-white/10" />
            </div>
          </div>
        )

      case "progress":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-charcoal-100)]">Study Progress</h3>
                <span className="text-xs text-[var(--color-charcoal-500)]">Week 12</span>
              </div>
              <Progress value={65} className="h-2 mb-3 bg-[var(--color-charcoal-800)]" />
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-charcoal-400)]">12/18 modules complete</span>
                <span className="text-[var(--color-emerald-400)] font-medium">+5% from last week</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-charcoal-100)]">Career Readiness</h3>
                <span className="text-xs text-[var(--color-charcoal-500)]">Software Eng.</span>
              </div>
              <Progress value={45} className="h-2 mb-3 bg-[var(--color-charcoal-800)]" />
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-charcoal-400)]">Level 2: Skill Building</span>
                <span className="text-[var(--color-emerald-400)] font-medium">Top 15% of peers</span>
              </div>
            </div>
          </div>
        )

      case "quick-actions":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.id} href={action.href}>
                <div className="group p-4 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)] transition-all cursor-pointer h-full">
                  <div className="h-10 w-10 rounded-xl bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-emerald-500)] group-hover:text-white transition-colors">
                    <action.icon weight="fill" className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-[var(--color-charcoal-100)] text-sm mb-1">{action.title}</h4>
                  <p className="text-xs text-[var(--color-charcoal-500)] leading-tight">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )

      case "roadmap":
        return (
          <div className="p-6 rounded-3xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-charcoal-100)]">Roadmap Status</h3>
                <p className="text-sm text-[var(--color-charcoal-500)]">Your path to becoming a Senior Developer</p>
              </div>
              <Link href="/roadmap">
                <Button variant="ghost" size="sm" className="text-[var(--color-emerald-400)] hover:text-[var(--color-emerald-300)] hover:bg-emerald-500/10">
                  View Full <CaretRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-6">
              {ROADMAP_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === "completed" ? "bg-[var(--color-emerald-500)] text-white" : 
                      step.status === "current" ? "border-2 border-[var(--color-emerald-500)] text-[var(--color-emerald-400)]" : 
                      "border-2 border-[var(--color-charcoal-700)] text-[var(--color-charcoal-600)]"
                    }`}>
                      {step.status === "completed" ? <CheckCircle weight="fill" className="h-5 w-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    {i !== ROADMAP_STEPS.length - 1 && <div className="w-0.5 h-full bg-[var(--color-charcoal-800)] my-1" />}
                  </div>
                  <div className="flex-1 pb-6">
                    <h4 className={`text-sm font-semibold mb-1 ${step.status === "locked" ? "text-[var(--color-charcoal-600)]" : "text-[var(--color-charcoal-100)]"}`}>{step.title}</h4>
                    <p className="text-xs text-[var(--color-charcoal-500)] mb-3">{step.description}</p>
                    {step.status === "current" && (
                      <div className="flex items-center gap-3">
                        <Progress value={step.progress} className="h-1.5 flex-1 bg-[var(--color-charcoal-800)]" />
                        <span className="text-[10px] font-bold text-[var(--color-emerald-400)]">{step.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "activity":
        return (
          <div className="p-6 rounded-3xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] shadow-sm">
            <h3 className="text-lg font-bold text-[var(--color-charcoal-100)] mb-6">Recent Activity</h3>
            <div className="space-y-5">
              {RECENT_ACTIVITIES.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.type === "success" ? "bg-emerald-500/10 text-emerald-400" :
                    activity.type === "achievement" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    <activity.icon weight="fill" className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-charcoal-100)] truncate">{activity.title}</p>
                    <p className="text-xs text-[var(--color-charcoal-500)]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "ai-mentor":
        return (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--color-charcoal-800)] to-[var(--color-charcoal-900)] border border-[var(--color-charcoal-700)] shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-emerald-500)] flex items-center justify-center">
                <Sparkle weight="fill" className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-[var(--color-charcoal-100)]">Ask your AI Mentor</h3>
            </div>
            <p className="text-sm text-[var(--color-charcoal-400)] mb-4">
              "What are the best Ethiopian tech companies for Software Engineering internships in 2024?"
            </p>
            <Link href="/chat">
              <Button className="w-full bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white rounded-xl py-6">
                Start Chatting
              </Button>
            </Link>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-svh bg-[var(--background)]">
      <DashboardHeader 
        greeting={greeting} 
        firstName={firstName} 
        profile={profile} 
        initials={initials} 
      />

      <main className="px-4 md:px-6 py-6 md:py-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Dashboard Controls */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-charcoal-100)]">Overview</h2>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isEditMode ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetToDefault}
                    className="border-[var(--color-charcoal-700)] text-[var(--color-charcoal-400)]"
                  >
                    <ArrowsClockwise className="mr-1 h-4 w-4" /> Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditMode(false)}
                    className="border-[var(--color-charcoal-700)] text-red-400 hover:bg-red-500/10"
                  >
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white"
                  >
                    <Check className="mr-1 h-4 w-4" /> Save Changes
                  </Button>
                </motion.div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditMode(true)}
                  className="text-[var(--color-charcoal-400)] hover:text-white hover:bg-[var(--color-charcoal-800)]"
                >
                  <PencilSimple className="mr-1.5 h-4 w-4" /> Edit Dashboard
                </Button>
              )
            }
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {layout.filter(w => ["profile", "progress", "quick-actions", "roadmap"].includes(w.id)).map((w) => (
              <WidgetWrapper
                key={w.id}
                id={w.id}
                title={w.id.replace("-", " ")}
                visible={w.visible}
                isEditMode={isEditMode}
                onToggle={() => toggleWidget(w.id)}
                onMoveUp={() => moveWidget(w.id, "up")}
                onMoveDown={() => moveWidget(w.id, "down")}
              >
                {renderWidget(w.id)}
              </WidgetWrapper>
            ))}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {layout.filter(w => ["ai-mentor", "activity", "stats", "goals"].includes(w.id)).map((w) => (
              <WidgetWrapper
                key={w.id}
                id={w.id}
                title={w.id.replace("-", " ")}
                visible={w.visible}
                isEditMode={isEditMode}
                onToggle={() => toggleWidget(w.id)}
                onMoveUp={() => moveWidget(w.id, "up")}
                onMoveDown={() => moveWidget(w.id, "down")}
              >
                {renderWidget(w.id)}
              </WidgetWrapper>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
