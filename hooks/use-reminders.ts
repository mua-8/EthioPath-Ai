"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Reminder {
  id: string
  title: string
  description?: string
  reminder_time: string
  type: string
  is_completed: boolean
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const createReminder = useCallback(async (data: {
    title: string
    description?: string
    reminder_time: string
    type: string
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) throw new Error("Not authenticated")

      const { data: reminder, error } = await supabase
        .from("reminders")
        .insert([{
          user_id: user.id,
          ...data
        }])
        .select()
        .single()

      if (error) throw error
      
      // Also create a notification for the reminder
      await supabase.from("notifications").insert([{
        user_id: user.id,
        title: "Reminder Set",
        message: `We'll remind you about "${data.title}" at ${new Date(data.reminder_time).toLocaleString()}`,
        type: "system"
      }])

      toast.success("Reminder created successfully!")
      return reminder
    } catch (err) {
      console.error("Error creating reminder:", err)
      toast.error("Failed to create reminder")
      return null
    }
  }, [supabase])

  const fetchReminders = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_time", { ascending: true })

      if (error) throw error
      setReminders(data || [])
    } catch (err) {
      console.error("Error fetching reminders:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const toggleReminder = async (id: string, is_completed: boolean) => {
    try {
      const { error } = await supabase
        .from("reminders")
        .update({ is_completed })
        .eq("id", id)

      if (error) throw error
      setReminders(prev => prev.map(r => r.id === id ? { ...r, is_completed } : r))
    } catch (err) {
      console.error("Error toggling reminder:", err)
    }
  }

  return {
    reminders,
    loading,
    createReminder,
    fetchReminders,
    toggleReminder
  }
}
