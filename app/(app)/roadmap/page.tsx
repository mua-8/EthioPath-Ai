"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkle, 
  ArrowLeft,
  Target,
  CheckCircle,
  Circle,
  Lock,
  CaretRight,
  Lightning,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Code,
  Brain,
  Rocket,
  Trophy,
  Star,
  Clock,
  CalendarCheck,
  Certificate,
  Presentation,
  FileText,
  Handshake,
  ChartLineUp,
  Bell,
} from "@phosphor-icons/react"
import { CreateReminderModal } from "@/components/create-reminder-modal"
import { useState, useEffect } from "react"

interface Profile {
  full_name: string | null
  university: string | null
  department: string | null
  year_of_study: string | null
  career_goal: string | null
}

// Year labels for display
const YEAR_LABELS: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
  "5": "5th Year",
  "6": "6th Year",
  "graduate": "Graduate",
}

// Generate personalized roadmap based on user profile
function generateRoadmap(profile: Profile) {
  const yearStr = profile.year_of_study || "1"
  const year = yearStr === "graduate" ? 6 : parseInt(yearStr)
  const department = profile.department?.toLowerCase() || ""
  const careerGoal = profile.career_goal?.toLowerCase() || ""
  
  // Determine field category
  const isTech = department.includes("computer") || department.includes("software") || 
                 department.includes("it") || department.includes("information") ||
                 careerGoal.includes("developer") || careerGoal.includes("engineer") ||
                 careerGoal.includes("programmer") || careerGoal.includes("tech")
  
  const isBusiness = department.includes("business") || department.includes("management") ||
                     department.includes("accounting") || department.includes("economics") ||
                     careerGoal.includes("manager") || careerGoal.includes("entrepreneur") ||
                     careerGoal.includes("consultant") || careerGoal.includes("analyst")
  
  const isHealth = department.includes("medicine") || department.includes("health") ||
                   department.includes("nursing") || department.includes("pharmacy") ||
                   careerGoal.includes("doctor") || careerGoal.includes("nurse") ||
                   careerGoal.includes("physician")
  
  const isEngineering = department.includes("engineering") || department.includes("civil") ||
                        department.includes("electrical") || department.includes("mechanical") ||
                        careerGoal.includes("engineer")
  
  // Calculate which phase the user should be in based on year
  const currentPhase = Math.min(year, 4)
  
  // Base roadmap structure
  const phases = [
    {
      id: 1,
      phase: "Foundation",
      icon: BookOpen,
      description: "Build your core knowledge and academic foundation",
      targetYear: "Year 1",
      status: currentPhase > 1 ? "completed" : currentPhase === 1 ? "current" : "locked",
      progress: currentPhase > 1 ? 100 : currentPhase === 1 ? 35 : 0,
      steps: [
        {
          title: "Master Core Subjects",
          description: isTech 
            ? "Focus on programming fundamentals, mathematics, and logic"
            : isBusiness 
            ? "Excel in accounting, economics, and business fundamentals"
            : isHealth
            ? "Build strong foundation in biology, chemistry, and anatomy"
            : isEngineering
            ? "Master mathematics, physics, and engineering principles"
            : "Focus on your major's foundational courses",
          status: currentPhase > 1 ? "completed" : currentPhase === 1 ? "current" : "locked",
          icon: GraduationCap,
        },
        {
          title: "Develop Study Habits",
          description: "Create effective study routines and time management skills",
          status: currentPhase > 1 ? "completed" : currentPhase === 1 ? "current" : "locked",
          icon: Clock,
        },
        {
          title: "Join Academic Clubs",
          description: isTech 
            ? "Join GDSC, A2SV, or local tech communities"
            : isBusiness
            ? "Participate in entrepreneurship and business clubs"
            : isHealth
            ? "Join medical student associations and health clubs"
            : "Connect with departmental clubs and study groups",
          status: currentPhase > 1 ? "completed" : "upcoming",
          icon: Users,
        },
        {
          title: "Set Career Direction",
          description: `Define your path toward becoming a ${profile.career_goal || "professional"}`,
          status: currentPhase > 1 ? "completed" : "upcoming",
          icon: Target,
        },
      ],
    },
    {
      id: 2,
      phase: "Skill Building",
      icon: Brain,
      description: "Develop essential skills for your career path",
      targetYear: "Year 2",
      status: currentPhase > 2 ? "completed" : currentPhase === 2 ? "current" : "locked",
      progress: currentPhase > 2 ? 100 : currentPhase === 2 ? 45 : 0,
      steps: [
        {
          title: "Learn Technical Skills",
          description: isTech 
            ? "Master React, Next.js, and backend basics for the Ethiopian market"
            : isBusiness
            ? "Learn Excel, data analysis, and basic accounting software"
            : isHealth
            ? "Develop clinical skills and patient interaction basics"
            : isEngineering
            ? "Master CAD software, technical drawing, and engineering tools"
            : "Acquire technical skills specific to your field",
          status: currentPhase > 2 ? "completed" : currentPhase === 2 ? "current" : "locked",
          icon: Code,
        },
        {
          title: "Build Portfolio Projects",
          description: "Create 2-3 significant projects showcasing your abilities",
          status: currentPhase > 2 ? "completed" : currentPhase === 2 ? "current" : "locked",
          icon: Rocket,
        },
        {
          title: "Soft Skills Development",
          description: "Improve communication, teamwork, and leadership abilities",
          status: currentPhase > 2 ? "completed" : "upcoming",
          icon: Handshake,
        },
      ],
    },
    {
      id: 3,
      phase: "Professional Prep",
      icon: Briefcase,
      description: "Prepare for internships and graduation requirements",
      targetYear: "Year 3-4",
      status: currentPhase > 3 ? "completed" : currentPhase === 3 ? "current" : "locked",
      progress: currentPhase > 3 ? 100 : currentPhase === 3 ? 20 : 0,
      steps: [
        {
          title: "Secure Internship",
          description: "Apply to companies like Safaricom, Gebeya, or Ride for summer experience",
          status: currentPhase > 3 ? "completed" : currentPhase === 3 ? "current" : "locked",
          icon: Briefcase,
        },
        {
          title: "CV & LinkedIn Prep",
          description: "Optimize your professional profiles for recruiters",
          status: currentPhase > 3 ? "completed" : "upcoming",
          icon: FileText,
        },
        {
          title: "Interview Practice",
          description: "Conduct mock interviews and technical assessments",
          status: currentPhase > 3 ? "completed" : "upcoming",
          icon: Presentation,
        },
      ],
    },
    {
      id: 4,
      phase: "Career Entry",
      icon: Trophy,
      description: "Launch your professional career or pursue further studies",
      targetYear: "Year 4-5+",
      status: currentPhase >= 4 ? "current" : "locked",
      progress: currentPhase >= 5 ? 100 : 0,
      steps: [
        {
          title: "National Exit Exam",
          description: "Achieve top scores in the graduation competency exam",
          status: "upcoming",
          icon: Certificate,
        },
        {
          title: "Full-time Job Search",
          description: "Secure a position in your field or start freelancing on Upwork",
          status: "upcoming",
          icon: Target,
        },
        {
          title: "Advanced Studies",
          description: "Explore Masters or PhD opportunities in Ethiopia or abroad (e.g. Germany/APS)",
          status: "upcoming",
          icon: GraduationCap,
        },
      ],
    },
  ]
  
  return phases
}

function calculateOverallProgress(phases: any[]) {
  const totalSteps = phases.reduce((acc, phase) => acc + phase.steps.length, 0)
  const completedSteps = phases.reduce((acc, phase) => 
    acc + phase.steps.filter((s: any) => s.status === "completed").length, 0)
  
  return Math.round((completedSteps / totalSteps) * 100)
}

export default function RoadmapPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [reminderStep, setReminderStep] = useState<{title: string, desc: string} | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, university, department, year_of_study, career_goal")
        .eq("id", session.user.id)
        .single()

      if (!profile) {
        router.push("/onboarding")
        return
      }

      setProfile(profile)
      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  if (loading || !profile) {
    return <div className="min-h-svh flex items-center justify-center bg-[var(--background)]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-emerald-500)]" />
    </div>
  }

  const roadmapPhases = generateRoadmap(profile)
  const overallProgress = calculateOverallProgress(roadmapPhases)
  const currentPhaseIndex = roadmapPhases.findIndex(p => p.status === "current")

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
              <Target weight="fill" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-[var(--color-charcoal-100)]">Your Success Roadmap</h1>
              <p className="text-xs text-[var(--color-charcoal-500)]">
                {profile.department} - {YEAR_LABELS[profile.year_of_study || "1"]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-emerald-500)]/10 border border-[var(--color-emerald-500)]/20">
            <Lightning weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)]" />
            <span className="text-sm font-medium text-[var(--color-emerald-400)]">{overallProgress}% Complete</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Career Goal Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--color-emerald-900)]/60 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-700)]/30">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-emerald-500)]">
              <Star weight="fill" className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-emerald-400)] font-medium">Target Career Goal</p>
              <h2 className="text-xl font-bold text-[var(--color-charcoal-100)]">
                {profile.career_goal || "Not set"}
              </h2>
            </div>
          </div>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-8">
          {roadmapPhases.map((phase, index) => (
            <div key={phase.id} className={`relative ${phase.status === "locked" ? "opacity-60" : ""}`}>
              {/* Connector line */}
              {index !== roadmapPhases.length - 1 && (
                <div className="absolute left-[23px] top-[48px] bottom-[-32px] w-0.5 bg-[var(--color-charcoal-800)]" />
              )}

              <div className="flex gap-4">
                {/* Phase Icon */}
                <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all ${
                  phase.status === "completed" 
                    ? "bg-[var(--color-emerald-500)] border-[var(--color-emerald-500)] text-white" 
                    : phase.status === "current"
                    ? "bg-[var(--color-emerald-500)]/10 border-[var(--color-emerald-500)] text-[var(--color-emerald-400)]"
                    : "bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)] text-[var(--color-charcoal-600)]"
                }`}>
                  <phase.icon weight={phase.status === "completed" ? "fill" : "regular"} className="h-6 w-6" />
                </div>

                {/* Phase Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-emerald-500)]">
                      {phase.targetYear}
                    </span>
                    {phase.status === "locked" && <Lock weight="fill" className="h-4 w-4 text-[var(--color-charcoal-600)]" />}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-charcoal-100)] mb-1">{phase.phase}</h3>
                  <p className="text-sm text-[var(--color-charcoal-400)] mb-4">{phase.description}</p>

                  {/* Progress bar for current phase */}
                  {phase.status === "current" && (
                    <div className="mb-6 p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
                      <div className="flex items-center justify-between mb-2 text-xs font-medium">
                        <span className="text-[var(--color-charcoal-400)]">Phase Progress</span>
                        <span className="text-[var(--color-emerald-400)]">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-1.5 bg-[var(--color-charcoal-800)]" />
                    </div>
                  )}

                  {/* Steps */}
                  <div className="space-y-3">
                    {phase.steps.map((step, stepIndex) => (
                      <div 
                        key={stepIndex}
                        className={`p-4 rounded-xl border transition-all ${
                          step.status === "completed"
                            ? "bg-[var(--color-emerald-500)]/5 border-[var(--color-emerald-500)]/20"
                            : step.status === "current"
                            ? "bg-[var(--color-charcoal-900)] border-[var(--color-emerald-500)]/40 shadow-lg shadow-emerald-500/5"
                            : "bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-800)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex-shrink-0 ${
                            step.status === "completed" ? "text-[var(--color-emerald-500)]" : "text-[var(--color-charcoal-600)]"
                          }`}>
                            {step.status === "completed" ? (
                              <CheckCircle weight="fill" className="h-5 w-5" />
                            ) : (
                              <step.icon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold mb-0.5 ${
                              step.status === "locked" ? "text-[var(--color-charcoal-600)]" : "text-[var(--color-charcoal-100)]"
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-xs text-[var(--color-charcoal-500)] leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                          {step.status !== "completed" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-400)]"
                              onClick={() => setReminderStep({ title: step.title, desc: step.description })}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Guide Section */}
        <div className="mt-12 p-6 rounded-3xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[var(--color-emerald-500)] flex items-center justify-center">
                <Sparkle weight="fill" className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-charcoal-100)]">Personal AI Guide</h3>
            </div>
            <p className="text-[var(--color-charcoal-400)] mb-6 max-w-lg">
              Not sure how to complete a step? Ask the AI Mentor for a specific action plan, resources, or advice for your {profile.department} career.
            </p>
            <Link href="/chat">
              <Button className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white px-8 rounded-xl h-11">
                Ask AI Mentor <CaretRight weight="bold" className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target weight="fill" className="h-64 w-64 text-white" />
          </div>
        </div>
      </main>

      <CreateReminderModal 
        isOpen={!!reminderStep}
        onClose={() => setReminderStep(null)}
        initialTitle={`Milestone: ${reminderStep?.title}`}
        initialDescription={reminderStep?.desc}
        type="task"
      />
    </div>
  )
}
