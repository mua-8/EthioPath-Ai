import { createClient } from "@/lib/supabase/server"
// Re-compile layout
import { AppLayoutClient } from "@/components/app-layout-client"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, university")
      .eq("id", user.id)
      .single()
    profile = data
  }

  return (
    <AppLayoutClient profile={profile}>
      {children}
    </AppLayoutClient>
  )
}
