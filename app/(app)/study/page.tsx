"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sparkle,
  CalendarCheck,
  Plus,
  CheckCircle,
  Circle,
  Trash,
  BookOpen,
  Clock,
  ArrowLeft,
  Target,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { CreateReminderModal } from "@/components/create-reminder-modal"
import { Bell } from "@phosphor-icons/react"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface Task {
  id: string
  subject: string
  topic: string
  duration: string
  day: string
  completed: boolean
}

const SAMPLE_SUBJECTS = [
  "Software Engineering",
  "Data Structures",
  "Operating Systems",
  "Database Systems",
  "Computer Networking",
  "Calculus",
  "Technical Writing",
  "Object Oriented Programming",
]

export default function StudyPage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3)
  const [activeDay, setActiveDay] = useState(today)
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", subject: "Software Engineering", topic: "Software Requirements Specification (SRS)", duration: "2h", day: "Mon", completed: false },
    { id: "2", subject: "Data Structures", topic: "Binary Search Trees implementation", duration: "1.5h", day: "Mon", completed: true },
    { id: "3", subject: "Networking", topic: "Subnetting and IP Addressing exercises", duration: "1h", day: "Tue", completed: false },
    { id: "4", subject: "Database Systems", topic: "ER Diagram for Hospital Management", duration: "45m", day: "Wed", completed: false },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ subject: "", topic: "", duration: "", day: activeDay })
  const [reminderTask, setReminderTask] = useState<{title: string, desc: string} | null>(null)

  const todayTasks = tasks.filter((t) => t.day === activeDay)
  const completedToday = todayTasks.filter((t) => t.completed).length
  const totalCompleted = tasks.filter((t) => t.completed).length
  const progressPercent = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function addTask() {
    if (!newTask.subject || !newTask.topic) return
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        subject: newTask.subject,
        topic: newTask.topic,
        duration: newTask.duration || "1h",
        day: newTask.day || activeDay,
        completed: false,
      },
    ])
    setNewTask({ subject: "", topic: "", duration: "", day: activeDay })
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
              Add Task
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-emerald-500)]/10">
                <CalendarCheck weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-charcoal-50)]">Study Planner</h1>
                <p className="text-sm text-[var(--color-charcoal-400)]">Plan and track your weekly study sessions</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Tasks", value: tasks.length, icon: BookOpen },
              { label: "Completed", value: totalCompleted, icon: CheckCircle },
              { label: "Today's Tasks", value: todayTasks.length, icon: Clock },
              { label: "Weekly Progress", value: `${progressPercent}%`, icon: Target },
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

          {/* Weekly Progress Bar */}
          <div className="p-5 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-[var(--color-charcoal-300)]">Weekly Completion</h2>
              <span className="text-sm font-bold text-[var(--color-emerald-400)]">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-[var(--color-charcoal-800)]" />
            <p className="mt-2 text-xs text-[var(--color-charcoal-500)]">
              {totalCompleted} of {tasks.length} tasks completed this week
            </p>
          </div>

          {/* Day Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {DAYS.map((day) => {
              const dayTasks = tasks.filter((t) => t.day === day)
              const dayDone = dayTasks.filter((t) => t.completed).length
              const isToday = day === today
              const isActive = day === activeDay
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all duration-200 min-w-[70px] flex-shrink-0",
                    isActive
                      ? "bg-[var(--color-emerald-500)]/10 border-[var(--color-emerald-500)]/50 text-[var(--color-emerald-400)]"
                      : "bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)] hover:border-[var(--color-charcoal-700)]"
                  )}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {isToday && <span className="text-[10px] text-[var(--color-emerald-400)]">Today</span>}
                  <span className={cn(
                    "text-[10px]",
                    isActive ? "text-[var(--color-emerald-400)]" : "text-[var(--color-charcoal-600)]"
                  )}>
                    {dayDone}/{dayTasks.length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Task List */}
          <div className="p-6 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)]">
                  {activeDay === today ? "Today's Tasks" : `${activeDay}'s Tasks`}
                </h2>
                <p className="text-sm text-[var(--color-charcoal-500)]">
                  {completedToday} of {todayTasks.length} completed
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setNewTask({ ...newTask, day: activeDay }); setShowForm(true) }}
                className="border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)] hover:bg-[var(--color-charcoal-800)]"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-charcoal-800)] mb-3">
                  <CalendarCheck className="h-7 w-7 text-[var(--color-charcoal-600)]" />
                </div>
                <p className="text-[var(--color-charcoal-400)] font-medium">No tasks for {activeDay}</p>
                <p className="text-sm text-[var(--color-charcoal-600)] mt-1">Add a study task to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                      task.completed
                        ? "bg-[var(--color-emerald-500)]/5 border-[var(--color-emerald-500)]/20"
                        : "bg-[var(--color-charcoal-800)]/50 border-[var(--color-charcoal-700)]"
                    )}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle weight="fill" className="h-6 w-6 text-[var(--color-emerald-500)]" />
                      ) : (
                        <Circle className="h-6 w-6 text-[var(--color-charcoal-600)]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm",
                        task.completed ? "line-through text-[var(--color-charcoal-500)]" : "text-[var(--color-charcoal-100)]"
                      )}>
                        {task.topic}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]">
                          {task.subject}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-charcoal-500)]">
                          <Clock className="h-3 w-3" /> {task.duration}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setReminderTask({ title: `Study: ${task.topic}`, desc: `Subject: ${task.subject}` })}
                      className="flex-shrink-0 text-[var(--color-charcoal-600)] hover:text-[var(--color-emerald-400)] transition-colors mr-1"
                      title="Set Reminder"
                    >
                      <Bell className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 text-[var(--color-charcoal-600)] hover:text-red-400 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-5">Add Study Task</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Subject</label>
                <select
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                >
                  <option value="">Select subject...</option>
                  {SAMPLE_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Topic / Task</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 3 – Integration"
                  value={newTask.topic}
                  onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Day</label>
                  <select
                    value={newTask.day}
                    onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                  >
                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1h 30m"
                    value={newTask.duration}
                    onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                  />
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
                onClick={addTask}
                className="flex-1 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}

      <CreateReminderModal 
        isOpen={!!reminderTask}
        onClose={() => setReminderTask(null)}
        initialTitle={reminderTask?.title}
        initialDescription={reminderTask?.desc}
        type="study"
      />
    </div>
  )
}
