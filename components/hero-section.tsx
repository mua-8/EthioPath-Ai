"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkle } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [activeCells, setActiveCells] = useState<Set<number>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      const newCells = new Set<number>()
      const count = Math.floor(Math.random() * 15) + 10
      for (let i = 0; i < count; i++) {
        newCells.add(Math.floor(Math.random() * 240))
      }
      setActiveCells(newCells)
    }, 2000)

    const initialCells = new Set<number>()
    for (let i = 0; i < 20; i++) {
      initialCells.add(Math.floor(Math.random() * 240))
    }
    setActiveCells(initialCells)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 -top-20 -left-20 -right-20 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-10 sm:grid-cols-15 lg:grid-cols-20 gap-3 sm:gap-4 lg:gap-5 p-4 opacity-20">
          {[...Array(240)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm transition-all duration-1000 ${
                activeCells.has(i)
                  ? "bg-[var(--color-emerald-500)] shadow-[0_0_30px_var(--color-emerald-500)]"
                  : "border border-[var(--color-charcoal-800)] bg-transparent"
              }`}
              style={{
                opacity: activeCells.has(i) ? 0.6 : 0.3,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-24 lg:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-emerald-700)] bg-[var(--color-emerald-950)] px-4 py-1.5 text-sm text-[var(--color-emerald-300)] mb-8 animate-fade-in">
            <Sparkle weight="fill" className="h-4 w-4" />
            <span>Ethiopia&apos;s AI Platform for Student Success</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-charcoal-50)] leading-[1.1] max-w-5xl text-balance">
            Your AI Path from{" "}
            <span className="text-[var(--color-emerald-400)]">University to Success</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-[var(--color-charcoal-400)] max-w-2xl leading-relaxed text-pretty">
            Get personalized academic support, career roadmaps, AI mentorship, multilingual guidance, 
            and growth tools — built exclusively for Ethiopian university students.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
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
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-sm text-[var(--color-charcoal-500)]">Trusted by students from top Ethiopian universities</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {["Addis Ababa University", "Bahir Dar University", "Jimma University", "Hawassa University"].map((university) => (
                <span key={university} className="text-sm font-medium text-[var(--color-charcoal-400)]">
                  {university}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "25K+", label: "Students Guided" },
              { value: "92%", label: "Career Placement" },
              { value: "50+", label: "Universities" },
              { value: "24/7", label: "AI Mentorship" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[var(--color-emerald-400)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[var(--color-charcoal-500)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
