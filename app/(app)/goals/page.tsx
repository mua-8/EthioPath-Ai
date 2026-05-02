"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sparkle,
  Trophy,
  Plus,
  CheckCircle,
  Circle,
  Trash,
  Target,
  ArrowLeft,
  Star,
  Lightning,
  Flag,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { CreateReminderModal } from "@/components/create-reminder-modal"
import { Bell } from "@phosphor-icons/react"

type GoalType = "short-term" | "long-term"
type GoalStatus = "active" | "completed"

interface Goal {
  id: string
  title: string
  description: string
  type: GoalType
  progress: number
  status: GoalStatus
  checklist: { id: string; text: string; done: boolean }[]
}

const INITIAL_GOALS: Goal[] = [
  {
    id: "1",
    title: "Prepare for Exit Exam",
    description: "Review core subjects for the upcoming national graduation exit exam",
    type: "short-term",
    progress: 35,
    status: "active",
    checklist: [
      { id: "c1", text: "Download past exit exam papers", done: true },
      { id: "c2", text: "Complete Algorithm review", done: false },
      { id: "c3", text: "Review Networking fundamentals", done: false },
    ],
  },
  {
    id: "2",
    title: "Secure Summer Internship",
    description: "Apply to tech companies in Addis Ababa and prepare for interviews",
    type: "long-term",
    progress: 25,
    status: "active",
    checklist: [
      { id: "c5", text: "Finish 2 portfolio projects", done: true },
      { id: "c6", text: "Update resume with skills (React, Python)", done: false },
      { id: "c7", text: "Apply to Ride, Gebeya, and Safaricom", done: false },
    ],
  },
  {
    id: "3",
    title: "Master Basics of SQL",
    description: "Learn database management for backend development",
    type: "short-term",
    progress: 100,
    status: "completed",
    checklist: [
      { id: "c9", text: "Watch SQL for Beginners course", done: true },
      { id: "c10", text: "Complete 10 LeetCode SQL problems", done: true },
    ],
  },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS)
  const [filter, setFilter] = useState<"all" | GoalType | "completed">("all")
  const [showForm, setShowForm] = useState(false)
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "short-term" as GoalType,
  })
  const [reminderGoal, setReminderGoal] = useState<{title: string, desc: string} | null>(null)

  const filtered = goals.filter((g) => {
    if (filter === "completed") return g.status === "completed"
    if (filter === "all") return true
    return g.type === filter && g.status !== "completed"
  })

  const activeGoals = goals.filter((g) => g.status === "active")
  const completedGoals = goals.filter((g) => g.status === "completed")
  const avgProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((a, g) => a + g.progress, 0) / activeGoals.length)
    : 0

  function toggleChecklist(goalId: string, itemId: string) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g
        const checklist = g.checklist.map((c) => c.id === itemId ? { ...c, done: !c.done } : c)
        const progress = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100)
        const status: GoalStatus = progress === 100 ? "completed" : "active"
        return { ...g, checklist, progress, status }
      })
    )
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  function addGoal() {
    if (!newGoal.title) return
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        type: newGoal.type,
        progress: 0,
        status: "active",
        checklist: [],
      },
    ])
    setNewGoal({ title: "", description: "", type: "short-term" })
    setShowForm(false)
  }

  return (
    <div className="min-h-svh bg-[var(--background)]">
      <div>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-emerald-500)]">
                  <Sparkle weight="fill" className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[var(--color-charcoal-50)]">EthioPath AI</span>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Goal
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-emerald-500)]/10">
                <Trophy weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-charcoal-50)]">Goals</h1>
                <p className="text-sm text-[var(--color-charcoal-400)]">Track your short and long-term goals</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Goals", value: goals.length, icon: Target },
              { label: "Active", value: activeGoals.length, icon: Lightning },
              { label: "Completed", value: completedGoals.length, icon: CheckCircle },
              { label: "Avg Progress", value: `${avgProgress}%`, icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon weight="fill" className="h-4 w-4 text-[var(--color-emerald-500)]" />
                  <p className="text-xs text-[var(--color-charcoal-500)]">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-[var(--color-charcoal-50)]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["all", "short-term", "long-term", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 capitalize",
                  filter === f
                    ? "bg-[var(--color-emerald-500)]/10 border-[var(--color-emerald-500)]/50 text-[var(--color-emerald-400)]"
                    : "bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)] hover:border-[var(--color-charcoal-700)]"
                )}
              >
                {f === "all" ? "All Goals" : f === "short-term" ? "Short-term" : f === "long-term" ? "Long-term" : "Completed"}
              </button>
            ))}
          </div>

          {/* Goals List */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-charcoal-800)] mb-3">
                <Trophy className="h-7 w-7 text-[var(--color-charcoal-600)]" />
              </div>
              <p className="text-[var(--color-charcoal-400)] font-medium">No goals here yet</p>
              <p className="text-sm text-[var(--color-charcoal-600)] mt-1">Add a goal to start tracking your progress</p>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((goal) => {
                const isExpanded = expandedGoal === goal.id
                return (
                  <div
                    key={goal.id}
                    className={cn(
                      "rounded-2xl border transition-all duration-200",
                      goal.status === "completed"
                        ? "bg-[var(--color-emerald-500)]/5 border-[var(--color-emerald-500)]/20"
                        : "bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]"
                    )}
                  >
                    {/* Goal Header */}
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0",
                          goal.status === "completed"
                            ? "bg-[var(--color-emerald-500)]/20"
                            : goal.type === "long-term"
                            ? "bg-blue-500/10"
                            : "bg-[var(--color-emerald-500)]/10"
                        )}>
                          {goal.status === "completed" ? (
                            <CheckCircle weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
                          ) : goal.type === "long-term" ? (
                            <Flag weight="fill" className="h-5 w-5 text-blue-400" />
                          ) : (
                            <Lightning weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={cn(
                              "font-semibold",
                              goal.status === "completed"
                                ? "text-[var(--color-emerald-400)] line-through"
                                : "text-[var(--color-charcoal-100)]"
                            )}>
                              {goal.title}
                            </h3>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium",
                              goal.type === "long-term"
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]"
                            )}>
                              {goal.type === "short-term" ? "Short-term" : "Long-term"}
                            </span>
                            {goal.status === "completed" && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[var(--color-emerald-500)]/20 text-[var(--color-emerald-300)]">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-sm text-[var(--color-charcoal-500)] mt-1">{goal.description}</p>
                          )}

                          {/* Progress */}
                          <div className="mt-3 flex items-center gap-3">
                            <Progress value={goal.progress} className="h-1.5 flex-1 bg-[var(--color-charcoal-800)]" />
                            <span className="text-xs font-medium text-[var(--color-emerald-400)] w-8 text-right">{goal.progress}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {goal.checklist.length > 0 && (
                            <button
                              onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                              className="px-3 py-1.5 text-xs rounded-lg bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] transition-colors"
                            >
                              {isExpanded ? "Hide" : `${goal.checklist.filter(c => c.done).length}/${goal.checklist.length}`}
                            </button>
                          )}
                          <button
                            onClick={() => setReminderGoal({ title: goal.title, desc: goal.description })}
                            className="p-1.5 text-[var(--color-charcoal-600)] hover:text-[var(--color-emerald-400)] transition-colors rounded-lg"
                            title="Set Reminder"
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1.5 text-[var(--color-charcoal-600)] hover:text-red-400 transition-colors rounded-lg"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Checklist (Expanded) */}
                    {isExpanded && goal.checklist.length > 0 && (
                      <div className="px-5 pb-5 border-t border-[var(--color-charcoal-800)] pt-4">
                        <p className="text-xs text-[var(--color-charcoal-500)] mb-3 uppercase tracking-wide">Milestones</p>
                        <div className="space-y-2">
                          {goal.checklist.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklist(goal.id, item.id)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--color-charcoal-800)]/50 hover:bg-[var(--color-charcoal-800)] transition-colors text-left"
                            >
                              {item.done ? (
                                <CheckCircle weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)] flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-[var(--color-charcoal-600)] flex-shrink-0" />
                              )}
                              <span className={cn(
                                "text-sm",
                                item.done ? "line-through text-[var(--color-charcoal-500)]" : "text-[var(--color-charcoal-200)]"
                              )}>
                                {item.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Add Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-5">Add New Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Get a 3.8 GPA this semester"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Description (optional)</label>
                <textarea
                  placeholder="What does achieving this goal mean to you?"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)] resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Goal Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["short-term", "long-term"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewGoal({ ...newGoal, type })}
                      className={cn(
                        "py-2.5 px-4 rounded-xl text-sm font-medium border transition-all",
                        newGoal.type === type
                          ? "bg-[var(--color-emerald-500)]/10 border-[var(--color-emerald-500)]/50 text-[var(--color-emerald-400)]"
                          : "bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-400)]"
                      )}
                    >
                      {type === "short-term" ? "⚡ Short-term" : "🎯 Long-term"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)]"
              >
                Cancel
              </Button>
              <Button
                onClick={addGoal}
                className="flex-1 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white"
              >
                Add Goal
              </Button>
            </div>
          </div>
        </div>
      )}

      <CreateReminderModal 
        isOpen={!!reminderGoal}
        onClose={() => setReminderGoal(null)}
        initialTitle={reminderGoal?.title}
        initialDescription={reminderGoal?.desc}
        type="goal"
      />
    </div>
  )
}
