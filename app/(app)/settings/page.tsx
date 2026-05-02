export const dynamic = 'force-dynamic'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Gear, 
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr"
import { SettingsContent } from "./settings-content"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-svh bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-emerald-500)]">
            <Gear weight="fill" className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-semibold text-[var(--color-charcoal-100)]">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <SettingsContent initialProfile={profile} userEmail={user.email || ""} />
        
        {/* Version */}
        <p className="mt-6 text-center text-xs text-[var(--color-charcoal-600)] pb-10">
          EthioPath AI v1.0.0
        </p>
      </main>
    </div>
  )
}
