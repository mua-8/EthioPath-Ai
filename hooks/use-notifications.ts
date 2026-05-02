"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Notification {
  id: string
  title: string
  message: string
  type: "task" | "goal" | "study" | "finance" | "system"
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error
      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.is_read).length)
    } catch (err) {
      console.error("Error fetching notifications:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    let isMounted = true
    let channel: any

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user || !isMounted) {
        setLoading(false)
        return
      }

      // Initial fetch
      await fetchNotifications()

      // Subscribe with a unique channel name to avoid conflicts during React Strict Mode re-mounts
      channel = supabase
        .channel(`notifications-${user.id}-${Math.random().toString(36).substring(7)}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (isMounted) {
              const newNotif = payload.new as Notification
              setNotifications(prev => [newNotif, ...prev])
              setUnreadCount(prev => prev + 1)
              
              if (Notification.permission === "granted") {
                new Notification(newNotif.title, {
                  body: newNotif.message,
                  icon: "/logo.png"
                })
              }
            }
          }
        )
        .subscribe()
    }

    init()

    return () => {
      isMounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)

      if (error) throw error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (error) throw error
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  const clearAll = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id)

      if (error) throw error
      setNotifications([])
      setUnreadCount(0)
    } catch (err) {
      console.error("Error clearing notifications:", err)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll,
    refresh: fetchNotifications
  }
}
