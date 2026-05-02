import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WarningCircle } from "@phosphor-icons/react/dist/ssr"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[var(--background)]">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <WarningCircle weight="fill" className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)] mb-2">
          Authentication Error
        </h1>
        <p className="text-[var(--color-charcoal-400)] mb-8">
          Something went wrong during authentication. Please try again or contact support if the issue persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="border-[var(--color-charcoal-700)] text-[var(--color-charcoal-200)]">
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button asChild className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
