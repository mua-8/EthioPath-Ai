"use client"

import { useEffect, useRef, useState } from "react"
import { UserPlus, Brain, Target, Rocket } from "@phosphor-icons/react/dist/ssr"

const STEPS = [
  {
    icon: UserPlus,
    number: "01",
    title: "Sign Up Free",
    description: "Create your account in seconds using your university email. It's completely free for Ethiopian students.",
  },
  {
    icon: Brain,
    number: "02",
    title: "Complete Onboarding",
    description: "Tell us your university, department, year, interests, and goals. Our AI builds your personalized success profile.",
  },
  {
    icon: Target,
    number: "03",
    title: "Get Your Dashboard",
    description: "Access your smart dashboard with career roadmaps, study tools, task management, and progress tracking.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Chat, Learn & Grow",
    description: "Talk to your AI mentor anytime, follow your roadmap, build skills, and achieve your academic and career goals.",
  },
]

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
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

  useEffect(() => {
    if (isVisible) {
      STEPS.forEach((_, i) => {
        setTimeout(() => setActiveStep(i), 400 + i * 300)
      })
    }
  }, [isVisible])

  return (
    <section ref={ref} id="how-it-works" className="py-24 border-t border-[var(--color-charcoal-800)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <span className="text-sm font-medium text-[var(--color-emerald-400)] uppercase tracking-wider">
            How it works
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-charcoal-50)] md:text-4xl text-balance">
            Start your success journey in four simple steps
          </h2>
          <p className="mt-4 text-lg text-[var(--color-charcoal-400)]">
            From sign-up to achievement, EthioPath AI guides you every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative transition-all duration-700 ease-out ${
                activeStep >= i ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
              }`}
            >
              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden lg:block absolute top-10 left-[60%] h-px bg-gradient-to-r from-[var(--color-emerald-600)] to-transparent transition-all duration-1000 ease-out origin-left ${
                    activeStep > i ? "w-[80%] opacity-100" : "w-0 opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                />
              )}

              <div className="flex flex-col items-start p-6 rounded-2xl bg-[var(--color-charcoal-900)]/50 border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-800)] transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`h-14 w-14 rounded-2xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] flex items-center justify-center transition-all duration-500 ${
                      activeStep >= i
                        ? "border-[var(--color-emerald-700)] shadow-[0_0_20px_-5px_var(--color-emerald-600)]"
                        : ""
                    }`}
                  >
                    <step.icon
                      weight="duotone"
                      className={`h-7 w-7 transition-colors duration-500 ${activeStep >= i ? "text-[var(--color-emerald-400)]" : "text-[var(--color-charcoal-600)]"}`}
                    />
                  </div>
                  <span
                    className={`text-5xl font-bold transition-all duration-500 ${
                      activeStep >= i ? "text-[var(--color-emerald-800)]" : "text-[var(--color-charcoal-800)]"
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-charcoal-50)] mb-2">{step.title}</h3>
                <p className="text-[var(--color-charcoal-400)] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
