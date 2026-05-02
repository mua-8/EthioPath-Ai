"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sparkle, Eye, EyeSlash, CheckCircle, ArrowRight } from "@phosphor-icons/react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!password) {
      setError("Password is required")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
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
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("same as the old password")) {
          setError("New password must be different from your old password")
        } else {
          setError(error.message)
        }
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
              <CheckCircle weight="fill" className="h-10 w-10 text-[var(--color-emerald-500)]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)] mb-2">
            Password updated!
          </h1>
          <p className="text-[var(--color-charcoal-400)] mb-8">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white"
          >
            Go to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
            Set new password
          </h2>
          <p className="text-[var(--color-charcoal-400)] mt-2">
            Create a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-charcoal-200)]">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-12 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)]"
              >
                {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--color-charcoal-200)]">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 pr-12 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)]"
              >
                {showConfirmPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
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
                Updating...
              </span>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
