"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr"

export function FinalCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 border-t border-[var(--color-charcoal-800)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-emerald-950)] via-[var(--color-charcoal-900)] to-[var(--color-charcoal-950)] border border-[var(--color-emerald-900)] transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{
            boxShadow: isVisible ? "0 0 120px -30px var(--color-emerald-600)" : "none",
          }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[var(--color-emerald-500)]/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[var(--color-emerald-500)]/10 blur-3xl" />
          </div>

          {/* Dot pattern */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 delay-500 ${isVisible ? "opacity-10" : "opacity-0"}`}
            style={{
              backgroundImage: `radial-gradient(var(--color-emerald-400) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 rounded-full border border-[var(--color-emerald-700)] bg-[var(--color-emerald-950)] px-4 py-1.5 text-sm text-[var(--color-emerald-300)] mb-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Sparkle weight="fill" className="h-4 w-4" />
              <span>Start Your Journey Today</span>
            </div>

            <h2 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal-50)] max-w-3xl mx-auto text-balance transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              Ready to transform your university journey?
            </h2>

            <p 
              className={`mt-6 text-lg text-[var(--color-charcoal-400)] max-w-2xl mx-auto transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              Join thousands of Ethiopian students who are achieving academic excellence 
              and building clear career paths with EthioPath AI. Your success journey starts here.
            </p>

            <div 
              className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <Button
                size="lg"
                className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-400)] text-[var(--color-charcoal-950)] font-semibold px-8 py-6 text-base rounded-full transition-all hover:shadow-lg hover:shadow-[var(--color-emerald-500)]/25"
              >
                Unlock Your Future
                <ArrowRight className="ml-2 h-5 w-5" weight="bold" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[var(--color-charcoal-700)] text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)] hover:text-[var(--color-charcoal-50)] px-8 py-6 text-base rounded-full"
              >
                Get Started
              </Button>
            </div>

            {/* Trust indicators */}
            <div 
              className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[var(--color-charcoal-500)] transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-emerald-500)]" />
                <span>Free for students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-emerald-500)]" />
                <span>50+ universities supported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-emerald-500)]" />
                <span>Multilingual support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
