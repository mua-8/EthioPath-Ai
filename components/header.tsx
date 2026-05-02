"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkle, ArrowRight, List, X, User } from "@phosphor-icons/react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[var(--color-charcoal-950)]/90 backdrop-blur-xl border-b border-[var(--color-charcoal-800)]" 
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-[var(--color-charcoal-900)] transition-transform group-hover:scale-105">
                <Image 
                  src="/logo.png" 
                  alt="EthioPath AI Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-charcoal-950)] bg-[var(--color-emerald-300)]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-charcoal-50)]">
              EthioPath<span className="text-[var(--color-emerald-400)]">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-900)]/80 backdrop-blur-md px-2 py-1.5">
            <Link
              href="#features"
              className="px-4 py-1.5 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-full transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="px-4 py-1.5 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-full transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="px-4 py-1.5 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-full transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="px-4 py-1.5 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-full transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-24 animate-pulse bg-[var(--color-charcoal-800)] rounded-full" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] transition-colors"
                >
                  <User weight="fill" className="h-4 w-4" />
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <Button
                    type="submit"
                    variant="outline"
                    className="border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)] hover:bg-[var(--color-charcoal-800)] hover:text-[var(--color-charcoal-50)] rounded-full px-5 py-2.5 h-auto text-sm"
                  >
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] transition-colors"
                >
                  Sign in
                </Link>
                <Link href="/signup">
                  <Button
                    className="bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)] hover:bg-[var(--color-emerald-400)] rounded-full px-5 py-2.5 h-auto text-sm font-medium transition-all hover:shadow-lg hover:shadow-[var(--color-emerald-500)]/20"
                  >
                    Get Started
                    <ArrowRight weight="bold" className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-900)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-[var(--color-charcoal-300)]" />
            ) : (
              <List className="h-5 w-5 text-[var(--color-charcoal-300)]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-charcoal-950)]/95 backdrop-blur-xl border-b border-[var(--color-charcoal-800)]">
            <nav className="flex flex-col px-4 py-6 gap-2">
              <Link
                href="#features"
                className="px-4 py-3 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="px-4 py-3 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="px-4 py-3 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="px-4 py-3 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] hover:bg-[var(--color-charcoal-800)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="border-t border-[var(--color-charcoal-800)] my-4" />
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User weight="fill" className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <form action="/auth/signout" method="post">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)] hover:bg-[var(--color-charcoal-800)] rounded-full px-5 py-3 h-auto text-sm mt-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-charcoal-50)] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      className="w-full bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)] hover:bg-[var(--color-emerald-400)] rounded-full px-5 py-3 h-auto text-sm font-medium mt-2"
                    >
                      Get Started
                      <ArrowRight weight="bold" className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Floating CTA Button on scroll - only show for non-logged-in users */}
      {!user && (
        <div
          className={`
            fixed z-50 bottom-6 right-6 lg:right-8
            transition-all duration-500 ease-out
            ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <Link href="/signup">
            <Button
              className="bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)] hover:bg-[var(--color-emerald-400)] 
                rounded-full px-6 py-3 h-auto text-sm font-medium shadow-lg shadow-[var(--color-emerald-500)]/25"
            >
              Get Started
              <ArrowRight weight="bold" className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}
