"use client"

import { useEffect, useRef, useState } from "react"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

const FAQS = [
  {
    question: "Who is EthioPath AI for?",
    answer:
      "EthioPath AI is designed specifically for Ethiopian university students — from freshmen to final year students across all departments. Whether you're studying engineering, medicine, business, or social sciences, our AI provides personalized guidance for your academic and career journey.",
  },
  {
    question: "Which universities and departments are supported?",
    answer:
      "We support students from all Ethiopian public and private universities including Addis Ababa University, Bahir Dar University, Jimma University, Hawassa University, and 50+ more. Our AI is trained to understand curricula and career paths for all major departments.",
  },
  {
    question: "What languages does the platform support?",
    answer:
      "EthioPath AI supports multilingual guidance in Amharic, Afaan Oromo, and English. You can chat with your AI mentor in your preferred language and receive culturally relevant advice that resonates with your context.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. Your privacy is our priority. All data is encrypted, stored securely, and never shared without your consent. Your conversations with the AI mentor are confidential, and you have full control over your information.",
  },
  {
    question: "How accurate and helpful is the AI guidance?",
    answer:
      "Our AI is trained on Ethiopian education systems, job markets, and career paths. It provides evidence-based recommendations tailored to your specific situation. While AI guidance is powerful, we always encourage students to also seek advice from professors and career counselors.",
  },
  {
    question: "Can I access EthioPath AI on my phone?",
    answer:
      "Yes! EthioPath AI is fully mobile-responsive. Access your dashboard, chat with your AI mentor, and track your goals from any device — smartphone, tablet, or computer. A dedicated mobile app is coming soon.",
  },
  {
    question: "Is EthioPath AI free for students?",
    answer:
      "We offer a generous free tier that includes your personalized dashboard, basic AI mentor access, and core productivity tools. Premium features like unlimited AI chats, advanced career roadmaps, and priority support are available with our affordable student plans.",
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  delay,
  isVisible,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  delay: number
  isVisible: boolean
}) {
  return (
    <div
      className={`border-b border-[var(--color-charcoal-800)] transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${delay % 2 === 0 ? "-translate-x-8" : "translate-x-8"}`
      }`}
      style={{ transitionDelay: `${delay * 75 + 200}ms` }}
    >
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-medium text-[var(--color-charcoal-200)] group-hover:text-[var(--color-emerald-400)] transition-colors pr-4">
          {question}
        </span>
        <CaretDown
          weight="bold"
          className={`flex-shrink-0 h-5 w-5 text-[var(--color-charcoal-500)] group-hover:text-[var(--color-emerald-400)] transition-all duration-300 ${isOpen ? "rotate-180 text-[var(--color-emerald-400)]" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[var(--color-charcoal-400)] leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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
    <section ref={ref} id="faq" className="py-24 border-t border-[var(--color-charcoal-800)] overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <span className="text-sm font-medium text-[var(--color-emerald-400)] uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-charcoal-50)] md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-[var(--color-charcoal-400)]">
            Everything you need to know about EthioPath AI and how it can help your career.
          </p>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              delay={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
