"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { Sparkle, ArrowLeft, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
            ? `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}?next=/reset-password`
            : `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 bg-[var(--background)]">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-emerald-500)]/10">
              <EnvelopeSimple weight="fill" className="h-10 w-10 text-[var(--color-emerald-500)]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)] mb-2">
            Check your email
          </h1>
          <p className="text-[var(--color-charcoal-400)] mb-8">
            We&apos;ve sent a password reset link to{" "}
            <span className="text-[var(--color-emerald-400)]">{email}</span>.
            Click the link to reset your password.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="w-full border-[var(--color-charcoal-700)] text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
            >
              Try a different email
            </Button>
            <Link href="/login" className="block">
              <Button
                variant="ghost"
                className="w-full text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-emerald-500)]">
              <Sparkle weight="fill" className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--color-charcoal-50)]">
              EthioPath AI
            </span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-charcoal-50)]">
            Forgot your password?
          </h2>
          <p className="text-[var(--color-charcoal-400)] mt-2">
            No worries! Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-charcoal-200)]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu.et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
