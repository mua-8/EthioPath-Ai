"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sparkle, Eye, EyeSlash, ArrowRight, CheckCircle } from "@phosphor-icons/react"
import Image from "next/image"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters")
      return false
    }
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      // If email confirmation is disabled, session is returned immediately
      if (data.session) {
        router.push('/onboarding')
      } else {
        setSuccess(true)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.")
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
            Check your email
          </h1>
          <p className="text-[var(--color-charcoal-400)] mb-8">
            We&apos;ve sent a confirmation link to <span className="text-[var(--color-emerald-400)]">{email}</span>. 
            Click the link to activate your account.
          </p>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="border-[var(--color-charcoal-700)] text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
          >
            Back to Login
          </Button>
        </div>
      </div>
    )
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
            <span className="text-xl font-bold text-[var(--color-charcoal-50)]">
              EthioPath AI
            </span>
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-charcoal-50)] leading-tight mb-4">
            Start Your Success Journey Today
          </h1>
          <p className="text-lg text-[var(--color-charcoal-400)] mb-8">
            Join thousands of Ethiopian students who are transforming their academic and career paths with AI-powered guidance.
          </p>
          <ul className="space-y-4">
            {[
              "Personalized career roadmaps",
              "24/7 AI mentor support",
              "Multilingual guidance",
              "Smart productivity tools",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-[var(--color-charcoal-300)]">
                <CheckCircle weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-8 text-sm text-[var(--color-charcoal-500)]">
          <span>Free to start</span>
          <span>No credit card required</span>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
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
              <span className="text-xl font-bold text-[var(--color-charcoal-50)]">
                EthioPath AI
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-charcoal-50)]">
              Create your account
            </h2>
            <p className="text-[var(--color-charcoal-400)] mt-2">
              It&apos;s free and takes less than a minute
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-[var(--color-charcoal-200)]">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
              />
            </div>

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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[var(--color-charcoal-200)]">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 chars)"
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
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>

            <p className="text-xs text-center text-[var(--color-charcoal-500)]">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-[var(--color-emerald-400)] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[var(--color-emerald-400)] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-charcoal-400)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--color-emerald-400)] hover:text-[var(--color-emerald-300)] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
