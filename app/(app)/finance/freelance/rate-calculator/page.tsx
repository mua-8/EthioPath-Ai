"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Calculator, 
  Coins, 
  Calendar, 
  Clock,
  ChartBar,
  TrendUp,
  WarningCircle
} from "@phosphor-icons/react"

export default function RateCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState<number>(5)
  const [hoursPerDay, setHoursPerDay] = useState<number>(4)
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5)
  
  // Exchange rate (Estimated)
  const ETB_RATE = 110 

  const dailyUSD = hourlyRate * hoursPerDay
  const weeklyUSD = dailyUSD * daysPerWeek
  const monthlyUSD = weeklyUSD * 4
  const yearlyUSD = monthlyUSD * 12

  const formatCurrency = (val: number, currency: "USD" | "ETB") => {
    return currency === "USD" 
      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `${(val * ETB_RATE).toLocaleString()} ETB`
  }

  return (
    <div className="min-h-svh bg-[var(--background)] pb-10">
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
            <h1 className="font-bold text-lg text-[var(--color-charcoal-100)]">Rate Calculator</h1>
            <p className="text-xs text-[var(--color-charcoal-500)]">Estimate your freelance earnings</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] space-y-6">
              <h3 className="font-semibold text-[var(--color-charcoal-100)] flex items-center gap-2">
                <Calculator className="text-[var(--color-emerald-400)]" />
                Parameters
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly" className="text-xs text-[var(--color-charcoal-400)]">Hourly Rate (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-500)]">$</span>
                    <Input 
                      id="hourly"
                      type="number"
                      min={1}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                      className="pl-7 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] focus:border-[var(--color-emerald-500)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-xs text-[var(--color-charcoal-400)]">Hours Per Day</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-500)]" />
                    <Input 
                      id="hours"
                      type="number"
                      min={1}
                      max={24}
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(Math.min(24, Math.max(0, Number(e.target.value))))}
                      className="pl-10 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] focus:border-[var(--color-emerald-500)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days" className="text-xs text-[var(--color-charcoal-400)]">Days Per Week</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-500)]" />
                    <Input 
                      id="days"
                      type="number"
                      min={1}
                      max={7}
                      value={daysPerWeek}
                      onChange={(e) => setDaysPerWeek(Math.min(7, Math.max(0, Number(e.target.value))))}
                      className="pl-10 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] focus:border-[var(--color-emerald-500)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
              <WarningCircle weight="fill" className="text-blue-400 h-5 w-5 flex-shrink-0" />
              <p className="text-xs text-[var(--color-charcoal-400)] leading-relaxed">
                Calculations are based on a 4-week month. Local ETB conversion is estimated at **1 USD = {ETB_RATE} ETB**.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
                <p className="text-xs text-[var(--color-charcoal-500)] mb-1 uppercase tracking-wider font-bold">Daily Income</p>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--color-emerald-400)]">{formatCurrency(dailyUSD, "USD")}</span>
                  <span className="text-sm text-[var(--color-charcoal-400)]">{formatCurrency(dailyUSD, "ETB")}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
                <p className="text-xs text-[var(--color-charcoal-500)] mb-1 uppercase tracking-wider font-bold">Weekly Income</p>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[var(--color-emerald-400)]">{formatCurrency(weeklyUSD, "USD")}</span>
                  <span className="text-sm text-[var(--color-charcoal-400)]">{formatCurrency(weeklyUSD, "ETB")}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--color-emerald-600)]/20 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-500)]/30 sm:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-[var(--color-emerald-500)] uppercase tracking-wider font-bold">Estimated Monthly Earnings</p>
                  <TrendUp weight="bold" className="text-[var(--color-emerald-400)] h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-black text-white">{formatCurrency(monthlyUSD, "USD")}</span>
                  <span className="text-lg font-medium text-[var(--color-emerald-400)]/80">{formatCurrency(monthlyUSD, "ETB")}</span>
                </div>
                <p className="mt-4 text-[11px] text-[var(--color-charcoal-500)] italic">
                  * Before platform fees (usually 10-20%) and withdrawal costs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] sm:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <ChartBar weight="fill" className="text-[var(--color-emerald-400)]" />
                  <h4 className="text-sm font-semibold text-[var(--color-charcoal-100)]">Income Potential</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-charcoal-400)]">Yearly Total</span>
                      <span className="text-[var(--color-emerald-400)]">{formatCurrency(yearlyUSD, "USD")}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-charcoal-800)] overflow-hidden">
                      <div className="h-full bg-[var(--color-emerald-500)] w-full" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--color-charcoal-500)] leading-relaxed">
                    At ${hourlyRate}/hr, you are earning more than the average entry-level office job in Ethiopia by working just {hoursPerDay} hours a day. Freelancing offers significant leverage for students.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-charcoal-900)] to-transparent border border-[var(--color-charcoal-800)]">
              <h4 className="font-semibold text-[var(--color-charcoal-100)] mb-3 flex items-center gap-2">
                <Coins className="text-yellow-500" />
                Tax & Fees Tip
              </h4>
              <p className="text-sm text-[var(--color-charcoal-400)] leading-relaxed">
                Platforms like Upwork take **10%** of your earnings. Additionally, withdrawal fees to Ethiopia can range from **$1 to $30** depending on the method (Wire transfer vs Payoneer). Always account for these in your final budget.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
