"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { 
  User, 
  Palette, 
  Globe, 
  Lock, 
  Check, 
  GraduationCap, 
  Briefcase,
  Envelope,
  Bell,
  Trash,
  Key,
  Warning
} from "@phosphor-icons/react"
import { toast } from "sonner"

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

export function SettingsContent({ initialProfile, userEmail }: { initialProfile: any, userEmail: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  
  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  const [formData, setFormData] = useState({
    fullName: initialProfile?.full_name || "",
    university: UNIVERSITIES.includes(initialProfile?.university) ? initialProfile?.university : (initialProfile?.university ? "Other" : ""),
    customUniversity: UNIVERSITIES.includes(initialProfile?.university) ? "" : (initialProfile?.university || ""),
    department: DEPARTMENTS.includes(initialProfile?.department) ? initialProfile?.department : (initialProfile?.department ? "Other" : ""),
    customDepartment: DEPARTMENTS.includes(initialProfile?.department) ? "" : (initialProfile?.department || ""),
    yearOfStudy: initialProfile?.year_of_study || "",
    careerGoal: CAREER_GOALS.includes(initialProfile?.career_goal) ? initialProfile?.career_goal : (initialProfile?.career_goal ? "Other" : ""),
    customCareerGoal: CAREER_GOALS.includes(initialProfile?.career_goal) ? "" : (initialProfile?.career_goal || ""),
    preferredLanguage: initialProfile?.preferred_language || "en",
    newEmail: userEmail,
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const finalUniversity = formData.university === "Other" ? formData.customUniversity : formData.university
      const finalDepartment = formData.department === "Other" ? formData.customDepartment : formData.department
      const finalCareerGoal = formData.careerGoal === "Other" ? formData.customCareerGoal : formData.careerGoal

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          university: finalUniversity,
          department: finalDepartment,
          year_of_study: formData.yearOfStudy,
          career_goal: finalCareerGoal,
          preferred_language: formData.preferredLanguage,
        })
        .eq("id", user.id)

      if (error) throw error
      toast.success("Profile updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = async (lang: string) => {
    setFormData(prev => ({ ...prev, preferredLanguage: lang }))
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ preferred_language: lang })
          .eq("id", user.id)
        if (error) throw error
        toast.success(`Language changed to ${LANGUAGES.find(l => l.value === lang)?.label}`)
      }
    } catch (error: any) {
      toast.error("Failed to save language preference")
      console.error(error)
    }
  }

  const handlePasswordReset = async () => {
    setIsResettingPassword(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      toast.success("Password reset email sent! Check your inbox.")
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email")
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (formData.newEmail === userEmail) return
    setIsUpdatingEmail(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: formData.newEmail })
      if (error) throw error
      toast.success("Confirmation email sent to your new address!")
    } catch (error: any) {
      toast.error(error.message || "Failed to update email")
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you absolutely sure? This will delete all your data and cannot be undone.")) {
      toast.error("Account deletion requires administrative privileges. Please contact support.")
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <User weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
          <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)]">Profile Settings</h2>
        </div>
        
        <div className="rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input 
                  id="email" 
                  value={formData.newEmail} 
                  onChange={(e) => setFormData({...formData, newEmail: e.target.value})}
                  className="bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)]"
                />
                <Button 
                  onClick={handleUpdateEmail} 
                  disabled={isUpdatingEmail || formData.newEmail === userEmail}
                  variant="outline"
                  size="sm"
                  className="border-[var(--color-charcoal-700)] text-xs"
                >
                  {isUpdatingEmail ? "Updating..." : "Update"}
                </Button>
              </div>
              <p className="text-[10px] text-[var(--color-charcoal-500)]">Updating email requires confirmation from both old and new addresses.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <select
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                className="w-full h-10 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
              >
                <option value="">Select University</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {formData.university === "Other" && (
                <Input 
                  placeholder="Enter university name"
                  value={formData.customUniversity}
                  onChange={(e) => setFormData({...formData, customUniversity: e.target.value})}
                  className="mt-2 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)]"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full h-10 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {formData.department === "Other" && (
                <Input 
                  placeholder="Enter department name"
                  value={formData.customDepartment}
                  onChange={(e) => setFormData({...formData, customDepartment: e.target.value})}
                  className="mt-2 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)]"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year of Study</Label>
              <select
                id="year"
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({...formData, yearOfStudy: e.target.value})}
                className="w-full h-10 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
              >
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Career Goal</Label>
              <select
                id="goal"
                value={formData.careerGoal}
                onChange={(e) => setFormData({...formData, careerGoal: e.target.value})}
                className="w-full h-10 px-3 rounded-md bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] focus:border-[var(--color-emerald-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-emerald-500)]"
              >
                <option value="">Select Goal</option>
                {CAREER_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {formData.careerGoal === "Other" && (
                <Input 
                  placeholder="Enter career goal"
                  value={formData.customCareerGoal}
                  onChange={(e) => setFormData({...formData, customCareerGoal: e.target.value})}
                  className="mt-2 bg-[var(--color-charcoal-800)] border-[var(--color-charcoal-700)]"
                />
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleSaveProfile} 
            disabled={isLoading}
            className="bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white w-full sm:w-auto"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Palette weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
          <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)]">Appearance Settings</h2>
        </div>
        
        <div className="rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-[var(--color-charcoal-500)]">
                Toggle between light and dark theme.
              </p>
            </div>
            {mounted ? (
              <Switch 
                checked={theme === "dark"} 
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
              />
            ) : (
              <div className="h-6 w-11 rounded-full bg-[var(--color-charcoal-800)] animate-pulse" />
            )}
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Globe weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
          <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)]">Language Settings</h2>
        </div>
        
        <div className="rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  formData.preferredLanguage === lang.value
                    ? "border-[var(--color-emerald-500)] bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)]"
                    : "border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)] hover:border-[var(--color-charcoal-700)]"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{lang.label}</span>
                  <span className="text-xs opacity-70">{lang.native}</span>
                </div>
                {formData.preferredLanguage === lang.value && <Check weight="bold" className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Lock weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
          <h2 className="text-lg font-semibold text-[var(--color-charcoal-100)]">Account Settings</h2>
        </div>
        
        <div className="rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] divide-y divide-[var(--color-charcoal-800)]">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[var(--color-charcoal-800)] flex items-center justify-center">
                <Bell className="h-5 w-5 text-[var(--color-charcoal-400)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-charcoal-200)]">Notifications</p>
                <p className="text-xs text-[var(--color-charcoal-500)]">Manage your alert preferences</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-[var(--color-emerald-500)]">Manage</Button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[var(--color-charcoal-800)] flex items-center justify-center">
                <Key className="h-5 w-5 text-[var(--color-charcoal-400)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-charcoal-200)]">Password</p>
                <p className="text-xs text-[var(--color-charcoal-500)]">Reset your account password</p>
              </div>
            </div>
            <Button 
              onClick={handlePasswordReset} 
              disabled={isResettingPassword}
              variant="ghost" 
              size="sm" 
              className="text-[var(--color-emerald-500)]"
            >
              {isResettingPassword ? "Sending..." : "Reset"}
            </Button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-500">Delete Account</p>
                <p className="text-xs text-[var(--color-charcoal-500)]">Permanently remove your data</p>
              </div>
            </div>
            <Button 
              onClick={handleDeleteAccount}
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:bg-red-500/10"
            >
              Delete
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
