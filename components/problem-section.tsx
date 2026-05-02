"use client"

import { useEffect, useRef, useState } from "react"
import { XCircle, CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr"

const PROBLEMS = [
  {
    problem: "No clear guidance after enrollment",
    solution: "AI-powered academic advisor that creates personalized study plans from day one",
  },
  {
    problem: "Career confusion and uncertainty",
    solution: "Smart career roadmaps tailored to your department, skills, and aspirations",
  },
  {
    problem: "No access to mentorship",
    solution: "24/7 AI mentor chat that understands your unique challenges and goals",
  },
  {
    problem: "Limited local-language support",
    solution: "Multilingual guidance in Amharic, Afaan Oromo, and English",
  },
  {
    problem: "Productivity struggles",
    solution: "Smart dashboard with task management, goal tracking, and progress analytics",
  },
  {
    problem: "Difficult university-to-job transition",
    solution: "Step-by-step career preparation with skills building and opportunity matching",
  },
]

export function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
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
      PROBLEMS.forEach((_, i) => {
        setTimeout(() => setActiveIndex(i), 400 + i * 200)
      })
    }
  }, [isVisible])

  return (
    <section ref={ref} className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="text-sm font-medium text-[var(--color-emerald-400)] uppercase tracking-wider">
            The Challenge
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-charcoal-50)] md:text-4xl lg:text-5xl text-balance">
            University success shouldn&apos;t feel like guesswork
          </h2>
          <p className="mt-4 text-lg text-[var(--color-charcoal-400)] leading-relaxed">
            Ethiopian students face unique challenges navigating university life and career preparation. 
            EthioPath AI transforms these obstacles into clear pathways to success.
          </p>
        </div>

        {/* Problem/Solution Grid */}
        <div className="grid gap-6 md:gap-8">
          {PROBLEMS.map((item, i) => (
            <div
              key={i}
              className={`relative grid md:grid-cols-2 gap-4 md:gap-8 p-6 md:p-8 rounded-2xl border transition-all duration-700 ${
                activeIndex >= i
                  ? "opacity-100 translate-y-0 border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-900)]/50"
                  : "opacity-0 translate-y-8 border-transparent"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Problem */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle weight="fill" className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Problem</span>
                  <p className="mt-1 text-lg font-medium text-[var(--color-charcoal-200)]">{item.problem}</p>
                </div>
              </div>

              {/* Arrow (desktop) */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <ArrowRight weight="bold" className="h-6 w-6 text-[var(--color-emerald-500)]" />
              </div>

              {/* Solution */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--color-emerald-500)]/10 flex items-center justify-center">
                  <CheckCircle weight="fill" className="h-5 w-5 text-[var(--color-emerald-400)]" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--color-emerald-400)] uppercase tracking-wider">Solution</span>
                  <p className="mt-1 text-lg font-medium text-[var(--color-charcoal-200)]">{item.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
