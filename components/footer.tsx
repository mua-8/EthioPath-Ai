import Link from "next/link"
import { Sparkle, GithubLogo, TwitterLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-950)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand column */}
          <div className="lg:max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-[var(--color-charcoal-900)]">
                <Image 
                  src="/logo.png" 
                  alt="EthioPath AI Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-[var(--color-charcoal-50)]">
                EthioPath<span className="text-[var(--color-emerald-400)]">AI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-charcoal-400)]">
              Helping Ethiopian university students move from campus life to career success. 
              AI-powered guidance, personalized roadmaps, and 24/7 mentorship.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-charcoal-700)] bg-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-900)] transition-all"
                aria-label="GitHub"
              >
                <GithubLogo weight="fill" className="h-5 w-5 text-[var(--color-charcoal-400)]" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-charcoal-700)] bg-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-900)] transition-all"
                aria-label="Twitter"
              >
                <TwitterLogo weight="fill" className="h-5 w-5 text-[var(--color-charcoal-400)]" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-charcoal-700)] bg-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-900)] transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinLogo weight="fill" className="h-5 w-5 text-[var(--color-charcoal-400)]" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-charcoal-100)]">Product</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-charcoal-100)]">For Students</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    AI Mentor
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Career Roadmaps
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Study Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Universities
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-charcoal-100)]">Company</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#about"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-charcoal-100)]">Legal</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)] transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-charcoal-800)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[var(--color-charcoal-500)]">
            © 2026 EthioPath AI. All rights reserved.
          </span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-emerald-500)] animate-pulse" />
            <span className="text-xs text-[var(--color-charcoal-400)]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
