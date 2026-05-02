"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  GraduationCap,
  Briefcase,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkle,
} from "@phosphor-icons/react"
import Image from "next/image"

const UNIVERSITIES = [
  "Addis Ababa University",
  "Bahir Dar University",
  "Jimma University",
  "Hawassa University",
  "Mekelle University",
  "Gondar University",
  "Arba Minch University",
  "Adama Science and Technology University",
  "Dire Dawa University",
  "Haramaya University",
  "Wollo University",
  "Debre Berhan University",
  "Debre Markos University",
  "Wollega University",
  "Wolkite University",
  "Jijiga University",
  "Samara University",
  "Dilla University",
  "Mizan-Tepi University",
  "Bule Hora University",
  "Other",
]

const DEPARTMENTS = [
  "Computer Science",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Business Administration",
  "Accounting",
  "Economics",
  "Law",
  "Psychology",
  "Sociology",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Architecture",
  "Agriculture",
  "Veterinary Medicine",
  "Journalism",
  "Political Science",
  "Public Health",
  "Other",
]

const YEARS = [
  { value: "1", label: "1st Year (Freshman)" },
  { value: "2", label: "2nd Year (Sophomore)" },
  { value: "3", label: "3rd Year (Junior)" },
  { value: "4", label: "4th Year (Senior)" },
  { value: "5", label: "5th Year" },
  { value: "6", label: "6th Year" },
  { value: "graduate", label: "Graduate Student" },
]

const CAREER_GOALS = [
  "Software Developer / Engineer",
  "Data Scientist / Analyst",
  "Medical Doctor",
  "Nurse / Healthcare Professional",
  "Business Manager / Entrepreneur",
  "Accountant / Financial Analyst",
  "Lawyer / Legal Professional",
  "Teacher / Professor",
  "Researcher / Scientist",
  "Civil Engineer / Architect",
  "Government / Public Service",
  "NGO / Development Work",
  "Marketing / Communications",
  "Consultant",
  "Not sure yet",
  "Other",
]

const LANGUAGES = [
  { value: "en", label: "English", native: "English" },
  { value: "am", label: "Amharic", native: "አማርኛ" },
  { value: "om", label: "Afaan Oromo", native: "Afaan Oromoo" },
]

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "University", icon: GraduationCap },
  { id: 3, title: "Career Goal", icon: Briefcase },
  { id: 4, title: "Language", icon: Globe },
]

interface FormData {
  fullName: string
  university: string
  customUniversity: string
  department: string
  customDepartment: string
  yearOfStudy: string
  careerGoal: string
  customCareerGoal: string
  preferredLanguage: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    university: "",
    customUniversity: "",
    department: "",
    customDepartment: "",
    yearOfStudy: "",
    careerGoal: "",
    customCareerGoal: "",
    preferredLanguage: "en",
  })

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user already completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push("/dashboard")
        return
      }

      // Pre-fill full name if available
      if (profile?.full_name || user.user_metadata?.full_name) {
        setFormData(prev => ({
          ...prev,
          fullName: profile?.full_name || user.user_metadata?.full_name || ""
        }))
      }

      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [router, supabase])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) {
          setError("Please enter your full name")
          return false
        }
        break
      case 2:
        if (!formData.university) {
          setError("Please select your university")
          return false
        }
        if (formData.university === "Other" && !formData.customUniversity.trim()) {
          setError("Please enter your university name")
          return false
        }
        if (!formData.department) {
          setError("Please select your department")
          return false
        }
        if (formData.department === "Other" && !formData.customDepartment.trim()) {
          setError("Please enter your department name")
          return false
        }
        if (!formData.yearOfStudy) {
          setError("Please select your year of study")
          return false
        }
        break
      case 3:
        if (!formData.careerGoal) {
          setError("Please select your career goal")
          return false
        }
        if (formData.careerGoal === "Other" && !formData.customCareerGoal.trim()) {
          setError("Please enter your career goal")
          return false
        }
        break
      case 4:
        if (!formData.preferredLanguage) {
          setError("Please select your preferred language")
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const profileData = {
        id: user.id,
        full_name: formData.fullName.trim(),
        university: formData.university === "Other" 
          ? formData.customUniversity.trim() 
          : formData.university,
        department: formData.department === "Other" 
          ? formData.customDepartment.trim() 
          : formData.department,
        year_of_study: formData.yearOfStudy,
        career_goal: formData.careerGoal === "Other" 
          ? formData.customCareerGoal.trim() 
          : formData.careerGoal,
        preferred_language: formData.preferredLanguage,
        onboarding_completed: true,
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" })

      if (updateError) throw updateError

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[var(--color-charcoal-950)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-emerald-500)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-950)] flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-emerald-500)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-emerald-600)]/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg overflow-hidden bg-[var(--color-charcoal-900)] flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="EthioPath AI Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-[var(--color-charcoal-50)]">EthioPath AI</span>
          </div>
          <span className="text-sm text-[var(--color-charcoal-500)]">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)]"
                        : currentStep === step.id
                        ? "bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)]"
                        : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-500)]"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check weight="bold" className="h-5 w-5" />
                    ) : (
                      <step.icon weight="fill" className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block transition-colors ${
                      currentStep >= step.id
                        ? "text-[var(--color-charcoal-100)]"
                        : "text-[var(--color-charcoal-500)]"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      currentStep > step.id
                        ? "bg-[var(--color-emerald-500)]"
                        : "bg-[var(--color-charcoal-800)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] rounded-2xl p-8 shadow-xl">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)]">
                    Welcome to EthioPath AI
                  </h1>
                  <p className="mt-2 text-[var(--color-charcoal-400)]">
                    Let&apos;s personalize your experience. What&apos;s your name?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[var(--color-charcoal-200)]">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="h-12 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: University */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)]">
                    Tell us about your studies
                  </h1>
                  <p className="mt-2 text-[var(--color-charcoal-400)]">
                    This helps us tailor your academic support
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-[var(--color-charcoal-200)]">
                      University
                    </Label>
                    <select
                      id="university"
                      value={formData.university}
                      onChange={(e) => updateFormData("university", e.target.value)}
                      className="w-full h-12 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
                    >
                      <option value="">Select your university</option>
                      {UNIVERSITIES.map((uni) => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                  </div>

                  {formData.university === "Other" && (
                    <Input
                      placeholder="Enter your university name"
                      value={formData.customUniversity}
                      onChange={(e) => updateFormData("customUniversity", e.target.value)}
                      className="h-12 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-[var(--color-charcoal-200)]">
                      Department / Field of Study
                    </Label>
                    <select
                      id="department"
                      value={formData.department}
                      onChange={(e) => updateFormData("department", e.target.value)}
                      className="w-full h-12 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
                    >
                      <option value="">Select your department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {formData.department === "Other" && (
                    <Input
                      placeholder="Enter your department name"
                      value={formData.customDepartment}
                      onChange={(e) => updateFormData("customDepartment", e.target.value)}
                      className="h-12 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
                    />
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="yearOfStudy" className="text-[var(--color-charcoal-200)]">
                      Year of Study
                    </Label>
                    <select
                      id="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={(e) => updateFormData("yearOfStudy", e.target.value)}
                      className="w-full h-12 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
                    >
                      <option value="">Select your year</option>
                      {YEARS.map((year) => (
                        <option key={year.value} value={year.value}>{year.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Career Goal */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)]">
                    What&apos;s your career goal?
                  </h1>
                  <p className="mt-2 text-[var(--color-charcoal-400)]">
                    We&apos;ll create a personalized roadmap for you
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--color-charcoal-200)]">
                    Select your primary career goal
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                    {CAREER_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => updateFormData("careerGoal", goal)}
                        className={`p-3 rounded-lg text-left text-sm font-medium transition-all ${
                          formData.careerGoal === goal
                            ? "bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)]"
                            : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-700)]"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.careerGoal === "Other" && (
                  <Input
                    placeholder="Describe your career goal"
                    value={formData.customCareerGoal}
                    onChange={(e) => updateFormData("customCareerGoal", e.target.value)}
                    className="h-12 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:border-[var(--color-emerald-500)] focus:ring-[var(--color-emerald-500)]"
                  />
                )}
              </div>
            )}

            {/* Step 4: Language */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-[var(--color-charcoal-50)]">
                    Choose your language
                  </h1>
                  <p className="mt-2 text-[var(--color-charcoal-400)]">
                    Your AI mentor will communicate in this language
                  </p>
                </div>

                <div className="space-y-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => updateFormData("preferredLanguage", lang.value)}
                      className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                        formData.preferredLanguage === lang.value
                          ? "bg-[var(--color-emerald-500)] text-[var(--color-charcoal-950)]"
                          : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-700)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe weight="fill" className="h-5 w-5" />
                        <span className="font-medium">{lang.label}</span>
                      </div>
                      <span className="text-sm opacity-80">{lang.native}</span>
                    </button>
                  ))}
                </div>

                {/* Summary Preview */}
                <div className="mt-8 p-4 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)]">
                  <h3 className="text-sm font-medium text-[var(--color-emerald-400)] mb-3">
                    Your Profile Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-charcoal-500)]">Name:</span>
                      <span className="text-[var(--color-charcoal-200)]">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-charcoal-500)]">University:</span>
                      <span className="text-[var(--color-charcoal-200)]">
                        {formData.university === "Other" ? formData.customUniversity : formData.university}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-charcoal-500)]">Department:</span>
                      <span className="text-[var(--color-charcoal-200)]">
                        {formData.department === "Other" ? formData.customDepartment : formData.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-charcoal-500)]">Year:</span>
                      <span className="text-[var(--color-charcoal-200)]">
                        {YEARS.find(y => y.value === formData.yearOfStudy)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-charcoal-500)]">Career Goal:</span>
                      <span className="text-[var(--color-charcoal-200)]">
                        {formData.careerGoal === "Other" ? formData.customCareerGoal : formData.careerGoal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 border-[var(--color-charcoal-700)] text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-[var(--color-charcoal-950)] font-medium"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 h-12 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-[var(--color-charcoal-950)] font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
