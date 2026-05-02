"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sparkle,
  CheckSquare,
  Plus,
  CheckCircle,
  Circle,
  Trash,
  ArrowLeft,
  Calendar,
  Flag,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type Priority = "low" | "medium" | "high"

interface Task {
  id: string
  title: string
  priority: Priority
  dueDate: string
  completed: boolean
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Complete Calculus Assignment", priority: "high", dueDate: "Today", completed: false },
  { id: "2", title: "Read Chapter 4 of Physics", priority: "medium", dueDate: "Tomorrow", completed: false },
  { id: "3", title: "Register for next semester courses", priority: "high", dueDate: "Next Week", completed: true },
  { id: "4", title: "Update resume with new project", priority: "low", dueDate: "Next Week", completed: false },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", priority: "medium" as Priority, dueDate: "" })
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const completedTasks = tasks.filter((t) => t.completed)
  const activeTasks = tasks.filter((t) => !t.completed)
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function addTask() {
    if (!newTask.title) return
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTask.title,
        priority: newTask.priority,
        dueDate: newTask.dueDate || "No date",
        completed: false,
      },
    ])
    setNewTask({ title: "", priority: "medium", dueDate: "" })
    setShowForm(false)
  }

  return (
    <div className="min-h-svh bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] transition-colors md:hidden">
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
            <Plus className="h-4 w-4 md:mr-1.5" />
            <span className="hidden md:inline">Add Task</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-emerald-500)]/10">
              <CheckSquare weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-charcoal-50)]">Tasks</h1>
              <p className="text-sm text-[var(--color-charcoal-400)]">Manage your productivity</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tasks", value: tasks.length },
            { label: "Active", value: activeTasks.length },
            { label: "Completed", value: completedTasks.length },
            { label: "Progress", value: `${progressPercent}%` },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <p className="text-xs text-[var(--color-charcoal-500)] mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[var(--color-charcoal-50)]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="p-5 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-[var(--color-charcoal-300)]">Overall Progress</h2>
            <span className="text-sm font-bold text-[var(--color-emerald-400)]">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-[var(--color-charcoal-800)]" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "active", "completed"] as const).map((f) => (
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
              {f}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <CheckSquare className="h-8 w-8 text-[var(--color-charcoal-600)] mx-auto mb-3" />
              <p className="text-[var(--color-charcoal-400)]">No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                  task.completed
                    ? "bg-[var(--color-emerald-500)]/5 border-[var(--color-emerald-500)]/20"
                    : "bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]"
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
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
                      task.priority === "high" ? "bg-red-500/10 text-red-400" :
                      task.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-blue-500/10 text-blue-400"
                    )}>
                      <Flag weight="fill" className="h-3 w-3" />
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-charcoal-500)]">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 text-[var(--color-charcoal-600)] hover:text-red-400 transition-colors p-2"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-5">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Task Title</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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
                Save Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
