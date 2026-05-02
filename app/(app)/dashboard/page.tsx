import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

interface Profile {
  full_name: string | null
  university: string | null
  department: string | null
  year_of_study: number | null
  avatar_url: string | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const firstName = profile?.full_name?.split(" ")[0] || "Student"
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "ST"

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <DashboardClient 
      profile={profile} 
      greeting={greeting} 
      firstName={firstName} 
      initials={initials} 
    />
  )
}
