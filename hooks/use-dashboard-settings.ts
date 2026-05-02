"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface DashboardWidget {
  id: string
  visible: boolean
  order: number
}

const DEFAULT_LAYOUT: DashboardWidget[] = [
  { id: "profile", visible: true, order: 0 },
  { id: "progress", visible: true, order: 1 },
  { id: "quick-actions", visible: true, order: 2 },
  { id: "roadmap", visible: true, order: 3 },
  { id: "stats", visible: true, order: 4 },
  { id: "activity", visible: true, order: 5 },
  { id: "goals", visible: true, order: 6 },
  { id: "ai-mentor", visible: true, order: 7 }
]

export function useDashboardSettings() {
  const [layout, setLayout] = useState<DashboardWidget[]>(DEFAULT_LAYOUT)
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("user_dashboard_settings")
        .select("layout_config")
        .eq("user_id", session.user.id)
        .single()

      if (error && error.code !== "PGRST116") throw error
      
      if (data?.layout_config) {
        setLayout(data.layout_config as DashboardWidget[])
      }
    } catch (err) {
      console.error("Error fetching dashboard settings:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const saveSettings = async (newLayout: DashboardWidget[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from("user_dashboard_settings")
        .upsert({
          user_id: session.user.id,
          layout_config: newLayout,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        })

      if (error) throw error
      setLayout(newLayout)
      toast.success("Dashboard layout saved!")
    } catch (err) {
      console.error("Error saving dashboard settings:", err)
      toast.error("Failed to save layout")
    }
  }

  const toggleWidget = (id: string) => {
    const newLayout = layout.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    )
    setLayout(newLayout)
  }

  const moveWidget = (id: string, direction: "up" | "down") => {
    const index = layout.findIndex(w => w.id === id)
    if (index === -1) return
    
    const newLayout = [...layout]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= layout.length) return
    
    const temp = newLayout[index]
    newLayout[index] = newLayout[targetIndex]
    newLayout[targetIndex] = temp
    
    // Update order values
    const finalLayout = newLayout.map((w, i) => ({ ...w, order: i }))
    setLayout(finalLayout)
  }

  const resetToDefault = () => {
    setLayout(DEFAULT_LAYOUT)
    toast.info("Layout reset to default")
  }

  return {
    layout,
    loading,
    isEditMode,
    setIsEditMode,
    toggleWidget,
    moveWidget,
    saveSettings,
    resetToDefault
  }
}
