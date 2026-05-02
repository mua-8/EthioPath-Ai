"use client"

import { useEffect, useRef, useState } from "react"

const TESTIMONIALS_ROW_1 = [
  {
    quote:
      "I was struggling with my Computer Science courses until EthioPath AI created a personalized study plan. My GPA went from 2.8 to 3.6 in one semester!",
    author: "Meron Tadesse",
    role: "3rd Year Student",
    company: "Addis Ababa University",
    avatar: "MT",
  },
  {
    quote:
      "The AI mentor helped me discover that I wanted to pursue data science. Now I have a clear roadmap and I'm already learning Python!",
    author: "Yonas Bekele",
    role: "2nd Year Student",
    company: "Bahir Dar University",
    avatar: "YB",
  },
  {
    quote:
      "As a first-gen student, I had no guidance. EthioPath AI became my mentor. I just landed an internship at a top tech company!",
    author: "Sara Hailu",
    role: "4th Year Student",
    company: "Jimma University",
    avatar: "SH",
  },
  {
    quote:
      "The Amharic support is amazing. I can chat with my AI mentor in my language and get advice that actually makes sense for my context.",
    author: "Daniel Getachew",
    role: "2nd Year Student",
    company: "Hawassa University",
    avatar: "DG",
  },
  {
    quote:
      "I used to procrastinate so much. The productivity tools and goal tracking changed everything. I'm now the top student in my department.",
    author: "Hanna Abrham",
    role: "3rd Year Student",
    company: "Mekelle University",
    avatar: "HA",
  },
]

const TESTIMONIALS_ROW_2 = [
  {
    quote:
      "The career roadmap showed me exactly what skills I need for my dream job. No more guessing, just clear action steps.",
    author: "Kidus Solomon",
    role: "Final Year Student",
    company: "Addis Ababa University",
    avatar: "KS",
  },
  {
    quote:
      "I was confused about whether to pursue a master's or start working. The AI mentor helped me weigh my options with real data.",
    author: "Tigist Mengistu",
    role: "4th Year Student",
    company: "Gondar University",
    avatar: "TM",
  },
  {
    quote:
      "The smart dashboard keeps me organized. I track all my assignments, exams, and career goals in one place. Game changer!",
    author: "Bereket Assefa",
    role: "2nd Year Student",
    company: "Adama Science and Technology",
    avatar: "BA",
  },
  {
    quote:
      "I never thought I could plan my career while still in school. EthioPath AI showed me it's possible and necessary.",
    author: "Liya Tesfaye",
    role: "3rd Year Student",
    company: "Arba Minch University",
    avatar: "LT",
  },
  {
    quote:
      "The 24/7 AI mentor is incredible. Whether it's 2am exam stress or career questions, I always have someone to talk to.",
    author: "Abebe Worku",
    role: "Final Year Student",
    company: "Dire Dawa University",
    avatar: "AW",
  },
]

function TestimonialCard({
  testimonial,
  onMouseEnter,
  onMouseLeave,
}: {
  testimonial: (typeof TESTIMONIALS_ROW_1)[0]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex-shrink-0 w-[350px] md:w-[400px] rounded-2xl border border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-900)] p-6 hover:border-[var(--color-emerald-800)] transition-colors duration-300"
    >
      <p className="text-[var(--color-charcoal-300)] leading-relaxed text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-emerald-600)] to-[var(--color-emerald-800)] flex items-center justify-center text-xs font-bold text-[var(--color-emerald-100)]">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-medium text-[var(--color-charcoal-200)] text-sm">{testimonial.author}</div>
          <div className="text-xs text-[var(--color-charcoal-500)]">
            {testimonial.role}, {testimonial.company}
          </div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({
  testimonials,
  direction = "left",
  speed = 30,
}: {
  testimonials: typeof TESTIMONIALS_ROW_1
  direction?: "left" | "right"
  speed?: number
}) {
  const [isPaused, setIsPaused] = useState(false)
  const duplicated = [...testimonials, ...testimonials]

  return (
    <div className="relative flex overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />

      <div
        className="flex gap-6 py-4"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicated.map((testimonial, i) => (
          <TestimonialCard
            key={`${testimonial.author}-${i}`}
            testimonial={testimonial}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          />
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
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
    <section ref={ref} className="py-24 border-t border-[var(--color-charcoal-800)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <span className="text-sm font-medium text-[var(--color-emerald-400)] uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-charcoal-50)] md:text-4xl text-balance">
            Success stories from Ethiopian students
          </h2>
          <p className="mt-4 text-lg text-[var(--color-charcoal-400)]">
            Join thousands of students who are transforming their university experience with EthioPath AI.
          </p>
        </div>
      </div>

      <div
        className={`space-y-6 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "300ms" }}
      >
        <MarqueeRow testimonials={TESTIMONIALS_ROW_1} direction="left" speed={40} />
        <MarqueeRow testimonials={TESTIMONIALS_ROW_2} direction="right" speed={45} />
      </div>
    </section>
  )
}
