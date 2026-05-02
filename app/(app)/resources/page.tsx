"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkle,
  BookOpen,
  ArrowLeft,
  Link as LinkIcon,
  Plus,
  MagnifyingGlass,
  ArrowUpRight,
  FolderOpen,
  Funnel,
  GraduationCap
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

type Category = "all" | "course" | "tool" | "tutorial" | "video" | "website" | "career"

interface Resource {
  id: string
  title: string
  url: string
  category: string
  description: string
  department: string
  tags?: string[]
}

const DEPARTMENTS = [
  "All",
  "General",
  "Software Engineering",
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business / Accounting",
  "Health Sciences",
  "Agriculture",
  "Architecture",
  "Law",
  "Economics"
]

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "course", label: "Courses" },
  { value: "tutorial", label: "Tutorials" },
  { value: "tool", label: "Tools" },
  { value: "video", label: "Videos" },
  { value: "website", label: "Websites" },
  { value: "career", label: "Career" },
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [activeDepartment, setActiveDepartment] = useState("All")
  const [userDepartment, setUserDepartment] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newResource, setNewResource] = useState({ title: "", url: "", category: "course", department: "General", description: "" })

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Get user profile for personalization
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("department")
            .eq("id", user.id)
            .single()
          
          if (profile?.department) {
            setUserDepartment(profile.department)
            setActiveDepartment(profile.department)
          }
        }

        // Fetch resources
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .order("title")
        
        if (error) throw error
        setResources(data || [])
      } catch (err) {
        console.error("Error loading resources:", err)
        // Fallback or empty state
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredResources = resources.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory
    const matchesDepartment = activeDepartment === "All" || r.department === activeDepartment || r.department === "General"
    const matchesSearch = 
      r.title.toLowerCase().includes(search.toLowerCase()) || 
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    
    return matchesCategory && matchesDepartment && matchesSearch
  })

  async function addResource() {
    if (!newResource.title || !newResource.url) return
    
    try {
      const url = newResource.url.startsWith("http") ? newResource.url : `https://${newResource.url}`
      const { data, error } = await supabase
        .from("resources")
        .insert([{
          title: newResource.title,
          url,
          category: newResource.category,
          department: newResource.department,
          description: newResource.description
        }])
        .select()
      
      if (error) throw error
      if (data) {
        setResources(prev => [...prev, data[0]])
      }
      setNewResource({ title: "", url: "", category: "course", department: "General", description: "" })
      setShowForm(false)
    } catch (err) {
      console.error("Error adding resource:", err)
      alert("Failed to add resource. Please try again.")
    }
  }

  return (
    <div className="min-h-svh bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-charcoal-800)] bg-[var(--background)]/80 backdrop-blur-xl md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-[var(--color-charcoal-400)]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-sm font-bold text-[var(--color-charcoal-50)]">Resources</span>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[var(--color-emerald-500)] text-white"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
        {/* Page Title & Desktop Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-emerald-500)] to-[var(--color-emerald-600)] shadow-lg shadow-[var(--color-emerald-500)]/20">
              <BookOpen weight="fill" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-charcoal-50)]">Resource Hub</h1>
              <p className="text-sm text-[var(--color-charcoal-400)] mt-1">Personalized learning materials for your department</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="hidden md:flex bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>

        {/* Filters Section */}
        <div className="space-y-6 mb-10">
          {/* Search */}
          <div className="relative max-w-2xl">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-charcoal-500)]" />
            <input
              type="text"
              placeholder="Search by title, description or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-500)]/20 focus:border-[var(--color-emerald-500)] transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-charcoal-300)]">
              <Funnel className="h-4 w-4" />
              <span>Department</span>
              {userDepartment && activeDepartment === userDepartment && (
                <span className="text-[10px] bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-400)] px-2 py-0.5 rounded-full ml-2">Recommended for you</span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDepartment(dept)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    activeDepartment === dept
                      ? "bg-[var(--color-emerald-500)] text-white shadow-md shadow-[var(--color-emerald-500)]/20"
                      : "bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)] hover:border-[var(--color-charcoal-600)]"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap border",
                  activeCategory === cat.value
                    ? "bg-[var(--color-charcoal-800)] border-[var(--color-emerald-500)]/50 text-[var(--color-emerald-400)]"
                    : "bg-transparent border-[var(--color-charcoal-800)] text-[var(--color-charcoal-500)] hover:text-[var(--color-charcoal-300)]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] animate-pulse" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[var(--color-charcoal-900)] border border-dashed border-[var(--color-charcoal-800)] max-w-3xl mx-auto">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-charcoal-800)] mx-auto mb-6">
              <FolderOpen weight="light" className="h-10 w-10 text-[var(--color-charcoal-500)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-charcoal-50)]">No resources found</h3>
            <p className="text-[var(--color-charcoal-400)] mt-2 max-w-sm mx-auto">
              We couldn't find any resources matching your current filters. Try switching to "All" departments or searching for something else.
            </p>
            <Button 
              variant="outline" 
              onClick={() => { setActiveDepartment("All"); setActiveCategory("all"); setSearch(""); }}
              className="mt-8 border-[var(--color-charcoal-700)] text-[var(--color-charcoal-300)]"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-500)]/40 hover:bg-[var(--color-charcoal-800)]/30 transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-[var(--color-emerald-500)]/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-emerald-500)]/10 text-[var(--color-emerald-500)] group-hover:bg-[var(--color-emerald-500)] group-hover:text-white transition-all duration-300">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-400)]">
                      {resource.category}
                    </span>
                    <span className="text-[10px] text-[var(--color-charcoal-500)] italic">
                      {resource.department}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[var(--color-charcoal-50)] mb-2 group-hover:text-[var(--color-emerald-400)] transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-[var(--color-charcoal-400)] leading-relaxed mb-6 flex-grow">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t border-[var(--color-charcoal-800)] group-hover:border-[var(--color-emerald-500)]/20 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-charcoal-500)] truncate max-w-[180px]">
                    <ArrowUpRight className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{resource.url.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <span className="text-[10px] font-medium text-[var(--color-emerald-500)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Resource
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Add Resource Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--color-charcoal-900)] border border-[var(--color-charcoal-800)] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-emerald-500)]/10">
                <Plus className="h-5 w-5 text-[var(--color-emerald-500)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-charcoal-100)]">Contribute a Resource</h3>
            </div>
            
            <div className="grid gap-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-[var(--color-charcoal-400)] mb-2 block uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    placeholder="Resource name"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-500)]/20 focus:border-[var(--color-emerald-500)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-charcoal-400)] mb-2 block uppercase tracking-wider">URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-500)]/20 focus:border-[var(--color-emerald-500)]"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-[var(--color-charcoal-400)] mb-2 block uppercase tracking-wider">Department</label>
                  <select
                    value={newResource.department}
                    onChange={(e) => setNewResource({ ...newResource, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-500)]/20 focus:border-[var(--color-emerald-500)] appearance-none"
                  >
                    {DEPARTMENTS.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-charcoal-400)] mb-2 block uppercase tracking-wider">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value as Category })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-500)]/20 focus:border-[var(--color-emerald-500)] appearance-none"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-[var(--color-charcoal-400)] mb-2 block uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="What is this resource and why is it useful?"
                  rows={3}
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-500)]/20 focus:border-[var(--color-emerald-500)] resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="flex-1 text-[var(--color-charcoal-400)] hover:bg-[var(--color-charcoal-800)]"
              >
                Cancel
              </Button>
              <Button
                onClick={addResource}
                className="flex-1 bg-[var(--color-emerald-500)] hover:bg-[var(--color-emerald-600)] text-white shadow-lg shadow-[var(--color-emerald-500)]/20"
              >
                Save Resource
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
