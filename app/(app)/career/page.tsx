"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Briefcase, 
  ArrowLeft,
  MagnifyingGlass,
  MapPin,
  Clock,
  Buildings,
  Heart,
  CaretRight,
  Star,
  FileText,
  VideoCamera,
  GraduationCap,
  Notebook,
  CheckCircle,
  Circle,
  Lightning,
  Users,
  Trophy,
  ArrowUpRight,
  BookOpen,
  Target,
  ChartLineUp,
  Certificate,
} from "@phosphor-icons/react"

type TabType = "jobs" | "cv" | "interview" | "internship" | "masters"

const TABS = [
  { id: "jobs" as TabType, label: "Jobs", icon: Briefcase },
  { id: "cv" as TabType, label: "CV", icon: FileText },
  { id: "interview" as TabType, label: "Interview", icon: VideoCamera },
  { id: "internship" as TabType, label: "Internship", icon: Notebook },
  { id: "masters" as TabType, label: "Masters", icon: GraduationCap },
]

const FEATURED_JOBS = [
  {
    title: "Junior Software Developer",
    company: "Safaricom Ethiopia",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "25K - 40K ETB",
    posted: "2 days ago",
    match: 92,
    logo: "SE",
  },
  {
    title: "Data Analyst Intern",
    company: "Commercial Bank of Ethiopia",
    location: "Addis Ababa",
    type: "Internship",
    salary: "15K - 20K ETB",
    posted: "1 week ago",
    match: 88,
    logo: "CB",
  },
  {
    title: "Marketing Associate",
    company: "Ethiopian Airlines",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "20K - 30K ETB",
    posted: "3 days ago",
    match: 75,
    logo: "EA",
  },
  {
    title: "UX/UI Designer",
    company: "Ride",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "30K - 45K ETB",
    posted: "5 days ago",
    match: 82,
    logo: "RD",
  },
]

const CV_SECTIONS = [
  { title: "Personal Information", complete: true, tips: "Keep it professional and up-to-date" },
  { title: "Education", complete: true, tips: "List your most recent education first" },
  { title: "Skills", complete: false, tips: "Match skills to job requirements" },
  { title: "Experience", complete: false, tips: "Use action verbs and quantify achievements" },
  { title: "Projects", complete: false, tips: "Showcase relevant academic or personal projects" },
  { title: "Certifications", complete: false, tips: "Include relevant online certifications" },
]

const INTERVIEW_TOPICS = [
  { title: "Tell Me About Yourself", difficulty: "Easy", questions: 5, practiced: true },
  { title: "Why This Company?", difficulty: "Medium", questions: 4, practiced: true },
  { title: "Strengths & Weaknesses", difficulty: "Medium", questions: 6, practiced: false },
  { title: "Behavioral Questions", difficulty: "Hard", questions: 10, practiced: false },
  { title: "Technical Questions", difficulty: "Hard", questions: 8, practiced: false },
  { title: "Salary Negotiation", difficulty: "Medium", questions: 4, practiced: false },
]

const INTERNSHIP_STEPS = [
  { step: 1, title: "Build Your Profile", description: "Complete your CV and LinkedIn", done: true },
  { step: 2, title: "Identify Target Companies", description: "Research 10-15 companies", done: true },
  { step: 3, title: "Apply Strategically", description: "Customize each application", done: false, current: true },
  { step: 4, title: "Prepare for Interviews", description: "Practice common questions", done: false },
  { step: 5, title: "Follow Up", description: "Send thank you notes", done: false },
  { step: 6, title: "Negotiate & Accept", description: "Evaluate and accept offer", done: false },
]

const MASTERS_OPTIONS = [
  {
    country: "Ethiopia",
    universities: ["AAU", "Bahir Dar", "Jimma"],
    cost: "Low",
    duration: "2 years",
    requirements: "CGPA 3.0+, National Exam",
    pros: ["Affordable", "Local network", "Work while studying"],
  },
  {
    country: "Germany",
    universities: ["TU Munich", "RWTH Aachen", "TU Berlin"],
    cost: "Free/Low",
    duration: "2 years",
    requirements: "CGPA 3.0+, IELTS 6.5+, APS Certificate (Crucial for ET)",
    pros: ["Free tuition", "Strong job market", "Post-study visa"],
  },
  {
    country: "USA",
    universities: ["MIT", "Stanford", "CMU"],
    cost: "High",
    duration: "2 years",
    requirements: "CGPA 3.5+, GRE, TOEFL",
    pros: ["World-class education", "Research opportunities", "OPT"],
  },
  {
    country: "UK",
    universities: ["Oxford", "Cambridge", "Imperial"],
    cost: "High",
    duration: "1 year",
    requirements: "CGPA 3.3+, IELTS 7.0+",
    pros: ["1-year programs", "Prestigious", "Graduate visa"],
  },
]

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("jobs")
  const [profile, setProfile] = useState<{ career_goal?: string; department?: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("career_goal, department")
          .eq("id", user.id)
          .single()
        setProfile(data)
      }
    }
    loadProfile()
  }, [supabase])

  const cvCompletion = Math.round((CV_SECTIONS.filter(s => s.complete).length / CV_SECTIONS.length) * 100)
  const interviewProgress = Math.round((INTERVIEW_TOPICS.filter(t => t.practiced).length / INTERVIEW_TOPICS.length) * 100)

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
              <Briefcase weight="fill" className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-semibold text-[var(--color-charcoal-100)]">Career Center</h1>
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
        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <MagnifyingGlass className="h-5 w-5 text-[var(--color-charcoal-500)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies..."
                className="flex-1 bg-transparent text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:outline-none"
              />
            </div>

            {/* Career Goal Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-emerald-900)]/50 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-800)]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--color-emerald-400)] font-medium">Your Career Goal</p>
                  <p className="text-lg font-semibold text-[var(--color-charcoal-100)]">
                    {profile?.career_goal || "Set your goal"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-[var(--color-emerald-500)]/20 text-[var(--color-emerald-400)]">
                    {FEATURED_JOBS.length} matches
                  </span>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-4">
                Jobs For You
              </h2>
              <div className="space-y-3">
                {FEATURED_JOBS.map((job) => (
                  <div
                    key={job.title}
                    className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)]/50 transition-all cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-charcoal-800)] text-sm font-bold text-[var(--color-charcoal-300)] flex-shrink-0">
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-[var(--color-charcoal-100)]">{job.title}</h3>
                            <div className="flex items-center gap-1 text-sm text-[var(--color-charcoal-400)]">
                              <Buildings className="h-4 w-4" />
                              <span>{job.company}</span>
                            </div>
                          </div>
                          <button className="text-[var(--color-charcoal-500)] hover:text-[var(--color-emerald-400)] transition-colors">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)]">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)]">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]">
                            <Star weight="fill" className="h-3 w-3" />
                            {job.match}% Match
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--color-emerald-400)]">{job.salary}</span>
                          <span className="text-xs text-[var(--color-charcoal-500)]">{job.posted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CV Tab */}
        {activeTab === "cv" && (
          <div className="space-y-6">
            {/* CV Progress */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[var(--color-charcoal-100)]">CV Completion</h2>
                <span className="text-2xl font-bold text-[var(--color-emerald-400)]">{cvCompletion}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-charcoal-800)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-emerald-600)] to-[var(--color-emerald-400)] transition-all"
                  style={{ width: `${cvCompletion}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-[var(--color-charcoal-400)]">
                Complete your CV to increase visibility to employers
              </p>
            </div>

            {/* CV Sections */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-4">CV Sections</h2>
              <div className="space-y-3">
                {CV_SECTIONS.map((section) => (
                  <div
                    key={section.title}
                    className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {section.complete ? (
                        <CheckCircle weight="fill" className="h-6 w-6 text-[var(--color-emerald-500)]" />
                      ) : (
                        <Circle className="h-6 w-6 text-[var(--color-charcoal-600)]" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-[var(--color-charcoal-100)]">{section.title}</h3>
                        <p className="text-sm text-[var(--color-charcoal-500)]">{section.tips}</p>
                      </div>
                      <CaretRight className="h-5 w-5 text-[var(--color-charcoal-600)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-auto py-4 bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)]">
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">Download CV</span>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 border-[var(--color-charcoal-700)]">
                <div className="text-center">
                  <Lightning className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">AI Review</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Interview Tab */}
        {activeTab === "interview" && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[var(--color-charcoal-100)]">Interview Readiness</h2>
                <span className="text-2xl font-bold text-[var(--color-emerald-400)]">{interviewProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-charcoal-800)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-emerald-600)] to-[var(--color-emerald-400)] transition-all"
                  style={{ width: `${interviewProgress}%` }}
                />
              </div>
            </div>

            {/* Practice Topics */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-4">Practice Topics</h2>
              <div className="space-y-3">
                {INTERVIEW_TOPICS.map((topic) => (
                  <div
                    key={topic.title}
                    className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {topic.practiced ? (
                        <CheckCircle weight="fill" className="h-6 w-6 text-[var(--color-emerald-500)]" />
                      ) : (
                        <VideoCamera className="h-6 w-6 text-[var(--color-charcoal-500)]" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-[var(--color-charcoal-100)]">{topic.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            topic.difficulty === "Easy" 
                              ? "bg-green-500/20 text-green-400"
                              : topic.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs text-[var(--color-charcoal-500)]">
                            {topic.questions} questions
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={topic.practiced ? "outline" : "default"}
                        className={topic.practiced 
                          ? "border-[var(--color-charcoal-700)]" 
                          : "bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)]"
                        }
                      >
                        {topic.practiced ? "Review" : "Practice"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Mock Interview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-emerald-900)]/50 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-800)]/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[var(--color-emerald-500)]/20 flex items-center justify-center">
                  <VideoCamera weight="fill" className="h-6 w-6 text-[var(--color-emerald-400)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-charcoal-100)]">AI Mock Interview</h3>
                  <p className="text-sm text-[var(--color-charcoal-400)]">Practice with our AI interviewer</p>
                </div>
                <Button className="bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)]">
                  Start
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Internship Tab */}
        {activeTab === "internship" && (
          <div className="space-y-6">
            {/* Internship Plan */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)] mb-4">
                Your Internship Roadmap
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[var(--color-charcoal-800)]" />
                
                <div className="space-y-4">
                  {INTERNSHIP_STEPS.map((step, index) => (
                    <div key={step.step} className="relative flex gap-4">
                      {/* Step indicator */}
                      <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                        step.done 
                          ? "bg-[var(--color-emerald-500)]"
                          : step.current
                          ? "bg-[var(--color-emerald-500)]/20 border-2 border-[var(--color-emerald-500)]"
                          : "bg-[var(--color-charcoal-800)]"
                      }`}>
                        {step.done ? (
                          <CheckCircle weight="fill" className="h-5 w-5 text-white" />
                        ) : (
                          <span className={`text-sm font-bold ${
                            step.current ? "text-[var(--color-emerald-400)]" : "text-[var(--color-charcoal-500)]"
                          }`}>
                            {step.step}
                          </span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 p-4 rounded-xl ${
                        step.current 
                          ? "bg-[var(--color-emerald-500)]/10 border border-[var(--color-emerald-500)]/30"
                          : "bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]"
                      }`}>
                        <h3 className="font-medium text-[var(--color-charcoal-100)]">{step.title}</h3>
                        <p className="text-sm text-[var(--color-charcoal-400)] mt-1">{step.description}</p>
                        {step.current && (
                          <Button size="sm" className="mt-3 bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)]">
                            Continue
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]">
              <h3 className="font-semibold text-[var(--color-charcoal-100)] mb-3">Pro Tips</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[var(--color-charcoal-400)]">
                  <Lightning weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Apply to internships 3-6 months before your preferred start date
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--color-charcoal-400)]">
                  <Lightning weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Customize your CV for each company you apply to
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--color-charcoal-400)]">
                  <Lightning weight="fill" className="h-4 w-4 text-[var(--color-emerald-400)] mt-0.5" />
                  Connect with employees on LinkedIn before applying
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Masters Tab */}
        {activeTab === "masters" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-emerald-900)]/50 to-[var(--color-charcoal-900)] border border-[var(--color-emerald-800)]/30">
              <h2 className="font-semibold text-[var(--color-charcoal-100)]">Explore Masters Programs</h2>
              <p className="text-sm text-[var(--color-charcoal-400)] mt-1">
                Based on your {profile?.department || "field"} background
              </p>
            </div>

            {/* Country Options */}
            <div className="space-y-4">
              {MASTERS_OPTIONS.map((option) => (
                <div
                  key={option.country}
                  className="p-4 rounded-xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[var(--color-charcoal-100)]">{option.country}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      option.cost === "Free/Low" || option.cost === "Low"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {option.cost} Cost
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[var(--color-charcoal-400)]">
                      <GraduationCap className="h-4 w-4" />
                      <span>{option.universities.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-charcoal-400)]">
                      <Clock className="h-4 w-4" />
                      <span>{option.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-charcoal-400)]">
                      <Certificate className="h-4 w-4" />
                      <span>{option.requirements}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {option.pros.map((pro) => (
                      <span
                        key={pro}
                        className="px-2 py-1 rounded-full text-xs bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]"
                      >
                        {pro}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)]"
                  >
                    Learn More
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
