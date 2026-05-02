"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  CurrencyDollar, 
  ArrowLeft,
  Lightning,
  Wallet,
  ChartLineUp,
  PiggyBank,
  Briefcase,
  Laptop,
  PencilSimple,
  Camera,
  Code,
  MegaphoneSimple,
  Palette,
  GraduationCap,
  CaretRight,
  Plus,
  Minus,
  Target,
  TrendUp,
  CheckCircle,
  Circle,
  ArrowUpRight,
  Calculator,
  Lightbulb,
  Star,
} from "@phosphor-icons/react"

type TabType = "hustles" | "budgeting" | "freelance" | "savings"

const TABS = [
  { id: "hustles" as TabType, label: "Side Hustles", icon: Lightning },
  { id: "budgeting" as TabType, label: "Budgeting", icon: Wallet },
  { id: "freelance" as TabType, label: "Freelancing", icon: Laptop },
  { id: "savings" as TabType, label: "Savings", icon: PiggyBank },
]

const SIDE_HUSTLES = [
  {
    title: "Upwork Web Dev",
    icon: Code,
    income: "20K - 60K ETB/month",
    difficulty: "Hard",
    skills: ["React/Next.js", "Tailwind", "Git"],
    description: "Start with $5–$15/hr beginner rates for frontend tasks",
    platforms: ["Upwork", "Toptal", "LinkedIn"],
  },
  {
    title: "Social Media Manager",
    icon: MegaphoneSimple,
    income: "8K - 20K ETB/month",
    difficulty: "Medium",
    skills: ["Canva", "Amharic Copywriting", "Ads"],
    description: "Manage Instagram/Telegram for local Addis startups",
    platforms: ["Instagram", "Telegram", "Local businesses"],
  },
  {
    title: "Freelance Writing",
    icon: PencilSimple,
    income: "5K - 15K ETB/month",
    difficulty: "Easy",
    skills: ["English", "Research", "SEO"],
    description: "Write blog posts for international niche sites",
    platforms: ["Fiverr", "ProBlogger", "Upwork"],
  },
  {
    title: "Academic Tutoring",
    icon: GraduationCap,
    income: "4K - 12K ETB/month",
    difficulty: "Easy",
    skills: ["Math/Physics", "Patience", "Teaching"],
    description: "Tutor high school students in your neighborhood",
    platforms: ["Word of mouth", "Telegram groups"],
  },
  {
    title: "Digital Marketing",
    icon: ChartLineUp,
    income: "15K - 35K ETB/month",
    difficulty: "Medium",
    skills: ["FB Ads", "SEO", "Analytics"],
    description: "Help local businesses grow their online presence",
    platforms: ["Facebook", "Google My Business"],
  },
]

const BUDGET_CATEGORIES = [
  { name: "Housing/Rent", suggested: 30, icon: "🏠" },
  { name: "Food", suggested: 25, icon: "🍽️" },
  { name: "Transport", suggested: 15, icon: "🚌" },
  { name: "Education", suggested: 10, icon: "📚" },
  { name: "Savings", suggested: 10, icon: "💰" },
  { name: "Personal", suggested: 10, icon: "🎮" },
]

const FREELANCE_ROADMAP = [
  { 
    phase: 1, 
    title: "Foundation", 
    duration: "Month 1-2",
    steps: [
      "Identify your marketable skill",
      "Create portfolio with 3-5 sample projects",
      "Set up profiles on 2-3 platforms",
      "Define your services and pricing",
    ],
    income: "0 - 5K ETB"
  },
  { 
    phase: 2, 
    title: "First Clients", 
    duration: "Month 3-4",
    steps: [
      "Apply to 10+ jobs per week",
      "Offer competitive rates initially",
      "Deliver exceptional work",
      "Request reviews and testimonials",
    ],
    income: "5K - 15K ETB"
  },
  { 
    phase: 3, 
    title: "Growth", 
    duration: "Month 5-8",
    steps: [
      "Raise rates by 20-30%",
      "Specialize in a niche",
      "Build client relationships",
      "Create referral network",
    ],
    income: "15K - 30K ETB"
  },
  { 
    phase: 4, 
    title: "Scale", 
    duration: "Month 9-12",
    steps: [
      "Productize your services",
      "Create passive income streams",
      "Consider hiring assistants",
      "Build personal brand",
    ],
    income: "30K+ ETB"
  },
]

const SAVINGS_GOALS = [
  { name: "Emergency Fund", target: 30000, description: "3 months of basic living expenses" },
  { name: "MacBook for Coding", target: 120000, description: "Professional equipment upgrade" },
  { name: "IELTS/Exit Exam Fees", target: 25000, description: "Certification and exam costs" },
  { name: "Investment Starter", target: 10000, description: "Start investing in local stocks/ETB" },
]

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>("hustles")
  const [profile, setProfile] = useState<{ department?: string } | null>(null)
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [savingsGoal, setSavingsGoal] = useState(50000)
  const [currentSavings, setCurrentSavings] = useState(12000)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("department")
          .eq("id", user.id)
          .single()
        setProfile(data)
      }
    }
    loadProfile()
  }, [supabase])

  const savingsProgress = Math.round((currentSavings / savingsGoal) * 100)

  return (
    <div className="min-h-svh bg-[var(--background)] pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-emerald-500)]">
              <CurrencyDollar weight="fill" className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-semibold text-[var(--color-charcoal-100)]">Finance Hub</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 pb-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--color-emerald-500)] text-white"
                    : "text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
                }`}
              >
                <tab.icon weight={activeTab === tab.id ? "fill" : "regular"} className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Side Hustles Tab */}
        {activeTab === "hustles" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-emerald-900)]/50 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-800)]/30">
              <h2 className="font-semibold text-[var(--color-charcoal-100)]">
                Student-Friendly Side Hustles
              </h2>
              <p className="text-sm text-[var(--color-charcoal-400)] mt-1">
                Earn while you learn - flexible income ideas for Ethiopian students
              </p>
            </div>

            {/* Hustle Cards */}
            <div className="space-y-4">
              {SIDE_HUSTLES.map((hustle) => (
                <div
                  key={hustle.title}
                  className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)]/50 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[var(--color-emerald-500)]/10 flex items-center justify-center flex-shrink-0">
                      <hustle.icon weight="fill" className="h-6 w-6 text-[var(--color-emerald-400)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-[var(--color-charcoal-100)]">{hustle.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          hustle.difficulty === "Easy" 
                            ? "bg-green-500/20 text-green-400"
                            : hustle.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {hustle.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-charcoal-400)] mt-1">{hustle.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-emerald-400)]">
                          {hustle.income}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {hustle.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-full text-xs bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-charcoal-500)]">
                        <span>Platforms:</span>
                        {hustle.platforms.map((p, i) => (
                          <span key={p}>
                            {p}{i < hustle.platforms.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budgeting Tab */}
        {activeTab === "budgeting" && (
          <div className="space-y-6">
            {/* Income Input */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <label className="text-sm text-[var(--color-charcoal-400)]">Monthly Income (ETB)</label>
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMonthlyIncome(Math.max(0, monthlyIncome - 1000))}
                  className="border-[var(--color-charcoal-700)]"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="flex-1 text-center text-2xl font-bold text-[var(--color-emerald-400)] bg-transparent border-none focus:outline-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMonthlyIncome(monthlyIncome + 1000)}
                  className="border-[var(--color-charcoal-700)]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-4">
                Suggested Budget Breakdown
              </h2>
              <div className="space-y-3">
                {BUDGET_CATEGORIES.map((category) => {
                  const amount = Math.round((monthlyIncome * category.suggested) / 100)
                  return (
                    <div
                      key={category.name}
                      className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium text-[var(--color-charcoal-100)]">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-[var(--color-emerald-400)]">
                            {amount.toLocaleString()} ETB
                          </span>
                          <span className="text-xs text-[var(--color-charcoal-500)] ml-2">
                            {category.suggested}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--color-charcoal-800)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--color-emerald-500)]"
                          style={{ width: `${category.suggested}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb weight="fill" className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-[var(--color-charcoal-100)]">Budgeting Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-[var(--color-charcoal-400)]">
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Track every expense for one month to understand spending habits
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Cook at home to save significantly on food costs
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Freelancing Tab */}
        {activeTab === "freelance" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-emerald-900)]/50 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-800)]/30">
              <h2 className="font-semibold text-[var(--color-charcoal-100)]">
                12-Month Freelancing Roadmap
              </h2>
              <p className="text-sm text-[var(--color-charcoal-400)] mt-1">
                Build a sustainable freelance income step by step
              </p>
            </div>

            {/* Roadmap Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[var(--color-charcoal-800)]" />
              
              <div className="space-y-6">
                {FREELANCE_ROADMAP.map((phase) => (
                  <div key={phase.phase} className="relative flex gap-4">
                    {/* Phase indicator */}
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-emerald-500)] flex-shrink-0">
                      <span className="text-sm font-bold text-white">{phase.phase}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[var(--color-charcoal-100)]">{phase.title}</h3>
                        <span className="text-xs text-[var(--color-charcoal-500)]">{phase.duration}</span>
                      </div>
                      
                      <ul className="space-y-2 mb-3">
                        {phase.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-charcoal-400)]">
                            <CaretRight className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                            {step}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-3 border-t border-[var(--color-charcoal-800)]">
                        <span className="text-sm text-[var(--color-charcoal-500)]">Expected Income: </span>
                        <span className="font-semibold text-[var(--color-emerald-400)]">{phase.income}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/finance/freelance/platform-guide" className="block">
                <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] text-center hover:border-[var(--color-emerald-500)] transition-all h-full">
                  <Laptop className="h-8 w-8 mx-auto text-[var(--color-emerald-400)] mb-2" />
                  <h4 className="font-medium text-[var(--color-charcoal-100)] text-sm">Platform Guide</h4>
                  <p className="text-xs text-[var(--color-charcoal-500)]">Best sites to find work</p>
                </div>
              </Link>
              <Link href="/finance/freelance/rate-calculator" className="block">
                <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] text-center hover:border-[var(--color-emerald-500)] transition-all h-full">
                  <Calculator className="h-8 w-8 mx-auto text-[var(--color-emerald-400)] mb-2" />
                  <h4 className="font-medium text-[var(--color-charcoal-100)] text-sm">Rate Calculator</h4>
                  <p className="text-xs text-[var(--color-charcoal-500)]">Price your services</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Savings Tab */}
        {activeTab === "savings" && (
          <div className="space-y-6">
            {/* Savings Progress */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[var(--color-charcoal-100)]">Current Savings</h2>
                <span className="text-2xl font-bold text-[var(--color-emerald-400)]">
                  {currentSavings.toLocaleString()} ETB
                </span>
              </div>
              <div className="h-3 rounded-full bg-[var(--color-charcoal-800)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-emerald-600)] to-[var(--color-emerald-400)] transition-all"
                  style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-[var(--color-charcoal-500)]">{savingsProgress}% of goal</span>
                <span className="text-[var(--color-charcoal-400)]">
                  Goal: {savingsGoal.toLocaleString()} ETB
                </span>
              </div>
            </div>

            {/* Quick Add */}
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentSavings(currentSavings + 500)}
                variant="outline"
                className="flex-1 border-[var(--color-charcoal-700)]"
              >
                <Plus className="h-4 w-4 mr-1" />
                500 ETB
              </Button>
              <Button
                onClick={() => setCurrentSavings(currentSavings + 1000)}
                variant="outline"
                className="flex-1 border-[var(--color-charcoal-700)]"
              >
                <Plus className="h-4 w-4 mr-1" />
                1,000 ETB
              </Button>
              <Button
                onClick={() => setCurrentSavings(currentSavings + 5000)}
                className="flex-1 bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)]"
              >
                <Plus className="h-4 w-4 mr-1" />
                5,000 ETB
              </Button>
            </div>

            {/* Savings Goals */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-4">
                Savings Goals
              </h2>
              <div className="space-y-3">
                {SAVINGS_GOALS.map((goal) => (
                  <button
                    key={goal.name}
                    onClick={() => setSavingsGoal(goal.target)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      savingsGoal === goal.target
                        ? "bg-[var(--color-emerald-500)]/10 border border-[var(--color-emerald-500)]/50"
                        : "bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-charcoal-700)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          savingsGoal === goal.target
                            ? "bg-[var(--color-emerald-500)]"
                            : "bg-[var(--color-charcoal-800)]"
                        }`}>
                          <Target className={`h-5 w-5 ${
                            savingsGoal === goal.target 
                              ? "text-white" 
                              : "text-[var(--color-charcoal-400)]"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--color-charcoal-100)]">{goal.name}</h3>
                          <p className="text-sm text-[var(--color-charcoal-500)]">{goal.description}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        savingsGoal === goal.target
                          ? "text-[var(--color-emerald-400)]"
                          : "text-[var(--color-charcoal-300)]"
                      }`}>
                        {goal.target.toLocaleString()} ETB
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Savings Tips */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <div className="flex items-center gap-2 mb-3">
                <Star weight="fill" className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-[var(--color-charcoal-100)]">Savings Strategies</h3>
              </div>
              <ul className="space-y-2 text-sm text-[var(--color-charcoal-400)]">
                <li className="flex items-start gap-2">
                  <TrendUp weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Save first, spend later - transfer to savings immediately when paid
                </li>
                <li className="flex items-start gap-2">
                  <TrendUp weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Use a separate account for savings to avoid temptation
                </li>
                <li className="flex items-start gap-2">
                  <TrendUp weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Start small - even 500 ETB per week adds up to 26,000 ETB/year
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
