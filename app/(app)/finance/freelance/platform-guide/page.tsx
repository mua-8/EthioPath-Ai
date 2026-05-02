"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Laptop, 
  Star, 
  Lightning, 
  CaretRight, 
  ArrowUpRight,
  ShieldCheck,
  Warning,
  CheckCircle,
  Lightbulb
} from "@phosphor-icons/react"

const PLATFORMS = [
  {
    name: "Upwork",
    tagline: "Best for long-term projects and professional services",
    howToStart: "Create a detailed profile, take skill tests, and write tailored proposals for job postings.",
    tips: "Focus on a specific niche. Ethiopian students often excel in Data Entry, Translation (Amharic/Oromo), and Software Development.",
    pros: ["Higher quality clients", "Secure payment system", "Long-term contracts"],
    cons: ["High competition", "Strict profile approval", "10% service fee"],
    url: "https://upwork.com"
  },
  {
    name: "Fiverr",
    tagline: "Best for quick Gigs and creative services",
    howToStart: "Create 'Gigs' (services you offer starting at $5) and wait for clients to buy them.",
    tips: "Create high-quality Gig thumbnails. Use keywords like 'Ethiopian', 'Amharic Translation', or 'Fast Logo Design'.",
    pros: ["Clients come to you", "Good for beginners", "Fast setup"],
    cons: ["20% service fee", "Initially low pay", "Rating system is strict"],
    url: "https://fiverr.com"
  },
  {
    name: "Freelancer",
    tagline: "Best for contest-based work and technical jobs",
    howToStart: "Enter contests to show your skills or bid on projects directly.",
    tips: "Contests are a great way to build a portfolio if you don't have reviews yet.",
    pros: ["Contests help build portfolio", "Wide range of jobs", "Large user base"],
    cons: ["Lots of low-quality projects", "Bidding fee after free trials", "High spam risk"],
    url: "https://freelancer.com"
  }
]

export default function PlatformGuidePage() {
  return (
    <div className="min-h-svh bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/finance">
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-lg text-[var(--color-charcoal-100)]">Platform Guide</h1>
            <p className="text-xs text-[var(--color-charcoal-500)]">Freelancing for Ethiopian Students</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Intro */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--color-emerald-600)]/20 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-500)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--color-emerald-500)] flex items-center justify-center">
              <Laptop weight="fill" className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-charcoal-50)]">Global Freelancing</h2>
          </div>
          <p className="text-[var(--color-charcoal-300)] text-sm leading-relaxed">
            As an Ethiopian student, you have unique skills (like language translation, local research, or coding) that are in demand globally. Choosing the right platform is your first step to earning in foreign currency.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--color-charcoal-100)] flex items-center gap-2">
            <Star weight="fill" className="text-yellow-400" />
            Popular Platforms
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((platform) => (
              <div 
                key={platform.name}
                className="flex flex-col p-6 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-bold text-[var(--color-emerald-400)]">{platform.name}</h4>
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg bg-[var(--color-charcoal-800)] flex items-center justify-center text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    <ArrowUpRight weight="bold" className="h-4 w-4" />
                  </a>
                </div>
                
                <p className="text-sm font-medium text-[var(--color-charcoal-200)] mb-4 italic">
                  &ldquo;{platform.tagline}&rdquo;
                </p>

                <div className="space-y-4 flex-1">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--color-charcoal-500)] mb-1">How to Start</h5>
                    <p className="text-sm text-[var(--color-charcoal-300)]">{platform.howToStart}</p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-[var(--color-emerald-500)]/5 border border-[var(--color-emerald-500)]/10">
                    <h5 className="text-xs font-bold text-[var(--color-emerald-500)] flex items-center gap-1.5 mb-1">
                      <Lightbulb weight="fill" />
                      Tip for Ethiopia
                    </h5>
                    <p className="text-xs text-[var(--color-charcoal-300)]">{platform.tips}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <h5 className="text-[10px] font-bold text-green-500 uppercase mb-2">Pros</h5>
                      <ul className="space-y-1">
                        {platform.pros.map(p => (
                          <li key={p} className="text-[11px] text-[var(--color-charcoal-400)] flex items-center gap-1">
                            <CheckCircle weight="fill" className="text-green-500 h-3 w-3" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-red-500 uppercase mb-2">Cons</h5>
                      <ul className="space-y-1">
                        {platform.cons.map(c => (
                          <li key={c} className="text-[11px] text-[var(--color-charcoal-400)] flex items-center gap-1">
                            <Warning weight="fill" className="text-red-500 h-3 w-3" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Warning */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck weight="fill" className="h-6 w-6 text-amber-500" />
            <h3 className="font-bold text-amber-500">Getting Paid in Ethiopia</h3>
          </div>
          <p className="text-sm text-[var(--color-charcoal-300)] leading-relaxed">
            International payments can be tricky. Most platforms use **Payoneer**, **PayPal**, or direct **Bank Wire**. Since PayPal has limitations in Ethiopia, many freelancers use **Payoneer** to receive USD and then transfer to their local CBE or Abyssinia bank accounts. Always verify your identity with a valid Passport or National ID.
          </p>
        </div>
      </main>
    </div>
  )
}
