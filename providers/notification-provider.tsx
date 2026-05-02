"use client"

import { createContext, useContext, useEffect, ReactNode } from "react"
import { useNotifications } from "@/hooks/use-notifications"
import { useReminders } from "@/hooks/use-reminders"
import { createClient } from "@/lib/supabase/client"

interface NotificationContextType {
  // Add any specific context values if needed
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { refresh: refreshNotifications } = useNotifications()
  const { fetchReminders, reminders, toggleReminder } = useReminders()
  const supabase = createClient()

  // Initial load and permission request
  useEffect(() => {
    fetchReminders()
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }
  }, [fetchReminders])

  // Reminder Checker (Client-side fallback for scheduled alerts)
  useEffect(() => {
    const checkReminders = async () => {
      const now = new Date()
      const upcoming = reminders.filter(r => 
        !r.is_completed && 
        new Date(r.reminder_time) <= now
      )

      if (upcoming.length > 0) {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (!user) return

        for (const reminder of upcoming) {
          // 1. Create a notification for this reminder
          await supabase.from("notifications").insert([{
            user_id: user.id,
            title: `Reminder: ${reminder.title}`,
            message: reminder.description || "It's time for your scheduled activity!",
            type: reminder.type === "study" ? "study" : "task"
          }])

          // 2. Mark reminder as completed so it doesn't trigger again
          await toggleReminder(reminder.id, true)
        }
        
        refreshNotifications()
      }
    }

    const interval = setInterval(checkReminders, 10000) // Check every 10 seconds for precision
    return () => clearInterval(interval)
  }, [reminders, supabase, toggleReminder, refreshNotifications])

  // Personalization: AI suggestions based on user data
  useEffect(() => {
    const triggerSmartNotification = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("department, year_of_study")
        .eq("id", user.id)
        .single()
      
      if (!profile) return

      // Example of smart logic: Send a tip for their department occasionally
      const tips: Record<string, string[]> = {
        "Software Engineering": [
          "Tip: Have you checked the latest resources for Data Structures?",
          "Career Advice: Many internships for Software Engineers open this month.",
        ],
        "General": [
          "Reminder: Keep your study streak going!",
          "Tip: Use the AI Mentor to clarify difficult concepts.",
        ]
      }

      const deptTips = tips[profile.department || "General"] || tips["General"]
      const randomTip = deptTips[Math.floor(Math.random() * deptTips.length)]

      // Check if we should send a tip (random chance or once per session)
      const lastTip = sessionStorage.getItem("last_smart_tip")
      const today = new Date().toDateString()
      
      if (lastTip !== today && Math.random() > 0.7) {
        await supabase.from("notifications").insert([{
          user_id: user.id,
          title: "Personalized Tip",
          message: randomTip,
          type: "system"
        }])
        sessionStorage.setItem("last_smart_tip", today)
        refreshNotifications()
      }
    }

    triggerSmartNotification()
  }, [supabase, refreshNotifications])

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationProvider")
  }
  return context
}
