"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkle, Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) { setError("Email is required"); return }
    if (!password) { setError("Password is required"); return }

    setIsLoading(true)

    try {
      const supabase = createBrowserClient(
        "https://tsqhccyqceojslfliyef.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcWhjY3lxY2VvanNsZmxpeWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTY3NzEsImV4cCI6MjA5MzEzMjc3MX0.S1jUBEVevm4CBpl2hrSmn-mibIKJJWrNl_7vCdop49Q"
      )
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (signInError) throw signInError
      if (data.session) {
        window.location.replace("/dashboard")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.")
        } else if (err.message.includes("Email not confirmed")) {
          setError("Please verify your email before logging in.")
        } else {
          setError(err.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full bg-[var(--background)]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[var(--color-emerald-950)] to-[var(--color-charcoal-950)]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-[var(--color-charcoal-900)]">
              <Image 
                src="/logo.png" 
                alt="EthioPath AI Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-[var(--color-charcoal-50)]">EthioPath AI</span>
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-charcoal-50)] leading-tight mb-4">
            Your AI Path from University to Success
          </h1>
          <p className="text-lg text-[var(--color-charcoal-400)]">
            Get personalized academic support, career roadmaps, and 24/7 AI mentorship built for Ethiopian students.
          </p>
        </div>
        <div className="flex items-center gap-8 text-sm text-[var(--color-charcoal-500)]">
          <span>25K+ Students</span>
          <span>50+ Universities</span>
          <span>4 Languages</span>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden bg-[var(--color-charcoal-900)]">
                <Image 
                  src="/logo.png" 
                  alt="EthioPath AI Logo" 
                  width={40} 
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold text-[var(--color-charcoal-50)]">EthioPath AI</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-charcoal-50)]">Welcome back</h2>
            <p className="text-[var(--color-charcoal-400)] mt-2">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[var(--color-charcoal-200)]">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[var(--color-charcoal-200)]">Password</label>
                <Link href="/forgot-password" className="text-sm text-[var(--color-emerald-400)] hover:text-[var(--color-emerald-300)]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)]"
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
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-charcoal-400)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--color-emerald-400)] hover:text-[var(--color-emerald-300)] font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
