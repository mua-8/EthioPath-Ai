"use client"

import type React from "react"
import { BentoCard } from "./bento-card"
import {
  Brain,
  Target,
  TrendUp,
  Users,
  BookOpen,
  Briefcase,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr"
import { useEffect, useRef, useState } from "react"

function AnimatedCard({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "left" | "right"
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const translateClass = {
    up: "translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  }[direction]

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${translateClass}`
      }`}
    >
      {children}
    </div>
  )
}

export function BentoGrid() {
  return (
    <section id="features" className="py-24 border-t border-[var(--color-charcoal-800)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedCard delay={0} direction="up">
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-medium text-[var(--color-emerald-400)] uppercase tracking-wider">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[var(--color-charcoal-50)] md:text-4xl">
              Everything you need to succeed from campus to career
            </h2>
            <p className="mt-4 text-lg text-[var(--color-charcoal-400)]">
              AI-powered tools designed specifically for Ethiopian university students seeking academic excellence and career success.
            </p>
          </div>
        </AnimatedCard>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[180px]">
          {/* Primary feature - tall left card */}
          <AnimatedCard delay={100} direction="left" className="min-h-[280px] md:min-h-0 md:col-span-4 md:row-span-2">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-emerald-900)]">
                <Brain weight="duotone" className="h-6 w-6 text-[var(--color-emerald-400)]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-charcoal-50)]">AI Academic Assistant</h3>
              <p className="mt-2 text-sm text-[var(--color-charcoal-400)] flex-1">
                Get personalized academic support powered by AI that understands Ethiopian university curricula, 
                exam patterns, and study strategies tailored to your department.
              </p>
              <div className="mt-auto pt-6 flex items-end gap-1">
                {[65, 72, 58, 80, 75, 85, 90, 78, 88, 95].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-[var(--color-emerald-700)]"
                    style={{ height: `${val}px` }}
                  />
                ))}
              </div>
            </BentoCard>
          </AnimatedCard>

          {/* Top right - wide */}
          <AnimatedCard delay={200} direction="up" className="min-h-[160px] md:min-h-0 md:col-span-5">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-charcoal-800)]">
                <Target weight="duotone" className="h-5 w-5 text-[var(--color-emerald-400)]" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-charcoal-50)]">Personalized Career Roadmaps</h3>
              <p className="mt-1 text-sm text-[var(--color-charcoal-400)]">
                AI-generated step-by-step career paths based on your department, interests, and career goals.
              </p>
            </BentoCard>
          </AnimatedCard>

          {/* Top far right - stats */}
          <AnimatedCard delay={300} direction="right" className="hidden md:block min-h-[160px] md:min-h-0 md:col-span-3">
            <BentoCard className="flex flex-col items-center justify-center text-center h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="text-4xl font-bold text-[var(--color-emerald-400)]">4</div>
              <div className="mt-1 text-sm text-[var(--color-charcoal-500)]">Languages Supported</div>
            </BentoCard>
          </AnimatedCard>

          {/* Middle row - medium card */}
          <AnimatedCard delay={400} direction="left" className="min-h-[160px] md:min-h-0 md:col-span-3">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-charcoal-800)]">
                <ChartLineUp weight="duotone" className="h-5 w-5 text-[var(--color-emerald-400)]" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-charcoal-50)]">Smart Dashboard</h3>
              <p className="mt-1 text-sm text-[var(--color-charcoal-400)]">
                Track your progress, manage tasks, and stay productive.
              </p>
            </BentoCard>
          </AnimatedCard>

          {/* Middle - larger with badge */}
          <AnimatedCard delay={500} direction="up" className="min-h-[160px] md:min-h-0 md:col-span-5">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-charcoal-800)]">
                  <Users weight="duotone" className="h-5 w-5 text-[var(--color-emerald-400)]" />
                </div>
                <span className="text-xs font-medium text-[var(--color-emerald-400)] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-emerald-950)] border border-[var(--color-emerald-800)]">
                  24/7
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-charcoal-50)]">
                AI Mentor Chat
              </h3>
              <p className="mt-1 text-sm text-[var(--color-charcoal-400)]">
                Chat with your AI mentor anytime for guidance on academics, career decisions, and personal growth.
              </p>
            </BentoCard>
          </AnimatedCard>

          {/* Bottom row */}
          <AnimatedCard delay={600} direction="up" className="min-h-[160px] md:min-h-0 md:col-span-4">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-charcoal-800)]">
                <BookOpen weight="duotone" className="h-5 w-5 text-[var(--color-emerald-400)]" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-charcoal-50)]">
                Productivity Tools
              </h3>
              <p className="mt-1 text-sm text-[var(--color-charcoal-400)]">
                Task management, study planners, and time tracking to maximize your university experience.
              </p>
            </BentoCard>
          </AnimatedCard>

          <AnimatedCard delay={700} direction="up" className="min-h-[160px] md:min-h-0 md:col-span-4">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-charcoal-800)]">
                <TrendUp weight="duotone" className="h-5 w-5 text-[var(--color-emerald-400)]" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-charcoal-50)]">
                Goal Tracking
              </h3>
              <p className="mt-1 text-sm text-[var(--color-charcoal-400)]">
                Set academic and career goals, track milestones, and celebrate your achievements.
              </p>
            </BentoCard>
          </AnimatedCard>

          <AnimatedCard delay={800} direction="up" className="min-h-[160px] md:min-h-0 md:col-span-4">
            <BentoCard className="flex flex-col h-full bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-charcoal-800)]">
                <Briefcase weight="duotone" className="h-5 w-5 text-[var(--color-emerald-400)]" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-charcoal-50)]">Future Planning</h3>
              <p className="mt-1 text-sm text-[var(--color-charcoal-400)]">
                Prepare for internships, graduate studies, and your first job with AI-powered guidance.
              </p>
            </BentoCard>
          </AnimatedCard>
        </div>
      </div>
    </section>
  )
}
