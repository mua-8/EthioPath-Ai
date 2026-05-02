"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, Clock, Bell } from "@phosphor-icons/react"
import { useReminders } from "@/hooks/use-reminders"
import { motion, AnimatePresence } from "framer-motion"

interface CreateReminderModalProps {
  isOpen: boolean
  onClose: () => void
  initialTitle?: string
  initialDescription?: string
  type?: string
}

export function CreateReminderModal({ 
  isOpen, 
  onClose, 
  initialTitle = "", 
  initialDescription = "",
  type = "study"
}: CreateReminderModalProps) {
  const now = new Date()
  const localDate = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0')
  const localTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')

  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [date, setDate] = useState(localDate)
  const [time, setTime] = useState(localTime)
  const { createReminder, loading } = useReminders()

  const handleSubmit = async () => {
    if (!title) return

    const reminder_time = new Date(`${date}T${time}`).toISOString()
    const success = await createReminder({
      title,
      description,
      reminder_time,
      type
    })

    if (success) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-emerald-500)]/20 text-[var(--color-emerald-400)]">
                  <Bell weight="fill" className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-charcoal-100)]">Set Reminder</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--color-charcoal-400)]">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)]"
                  placeholder="What should we remind you about?"
                />
              </div>

              <div>
                <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)] resize-none"
                  rows={2}
                  placeholder="Add more details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal-500)]" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)] [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--color-charcoal-400)] mb-1.5 block">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal-500)]" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:border-[var(--color-emerald-500)] [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !title}
                className="flex-1 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white shadow-lg shadow-emerald-500/20"
              >
                {loading ? "Creating..." : "Save Reminder"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
