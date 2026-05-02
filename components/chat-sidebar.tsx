"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { 
  ChatCircle, 
  Plus, 
  DotsThree, 
  Pencil, 
  Trash, 
  X,
  Check,
  MagnifyingGlass
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentSessionId: string | null
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
  onRenameSession: (sessionId: string, newTitle: string) => void
  onDeleteSession: (sessionId: string) => void
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onRenameSession,
  onDeleteSession,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartEdit = (session: ChatSession) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const handleSaveEdit = (sessionId: string) => {
    if (editTitle.trim()) {
      onRenameSession(sessionId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  // Group sessions by date
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = new Date(session.updated_at)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    let group: string
    if (diffDays === 0) {
      group = "Today"
    } else if (diffDays === 1) {
      group = "Yesterday"
    } else if (diffDays < 7) {
      group = "Previous 7 Days"
    } else if (diffDays < 30) {
      group = "Previous 30 Days"
    } else {
      group = "Older"
    }
    
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(session)
    return groups
  }, {} as Record<string, ChatSession[]>)

  const groupOrder = ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days", "Older"]

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-72 bg-[var(--color-charcoal-950)] border-r border-[var(--color-charcoal-800)] flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-charcoal-800)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-charcoal-50)]">Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-50)]"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            onClick={onNewSession}
            className="w-full bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          
          {/* Search */}
          <div className="relative mt-3">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-charcoal-500)]" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)] text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)]"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <ChatCircle className="h-12 w-12 text-[var(--color-charcoal-600)] mb-3" />
              <p className="text-sm text-[var(--color-charcoal-500)]">
                {searchQuery ? "No chats found" : "No conversations yet"}
              </p>
              {!searchQuery && (
                <p className="text-xs text-[var(--color-charcoal-600)] mt-1">
                  Start a new chat to begin
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {groupOrder.map((group) => {
                const groupSessions = groupedSessions[group]
                if (!groupSessions || groupSessions.length === 0) return null
                
                return (
                  <div key={group}>
                    <p className="text-xs font-medium text-[var(--color-charcoal-500)] px-2 mb-1">
                      {group}
                    </p>
                    <div className="space-y-1">
                      {groupSessions.map((session) => (
                        <div
                          key={session.id}
                          className={cn(
                            "group relative rounded-lg transition-colors",
                            currentSessionId === session.id
                              ? "bg-[var(--color-charcoal-800)]"
                              : "hover:bg-[var(--color-charcoal-900)]"
                          )}
                        >
                          {editingId === session.id ? (
                            <div className="flex items-center gap-1 p-2">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="h-8 text-sm bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-600)]"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit(session.id)
                                  if (e.key === "Escape") handleCancelEdit()
                                }}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-[var(--color-emerald-400)]"
                                onClick={() => handleSaveEdit(session.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-[var(--color-charcoal-400)]"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onSelectSession(session.id)}
                              className="w-full text-left p-2 pr-10"
                            >
                              <p className="text-sm font-medium text-[var(--color-charcoal-100)] truncate">
                                {session.title}
                              </p>
                              <p className="text-xs text-[var(--color-charcoal-500)] mt-0.5">
                                {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                              </p>
                            </button>
                          )}
                          
                          {editingId !== session.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-100)]"
                                >
                                  <DotsThree weight="bold" className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end"
                                className="bg-[var(--color-charcoal-900)] border-[var(--color-charcoal-700)]"
                              >
                                <DropdownMenuItem
                                  onClick={() => handleStartEdit(session)}
                                  className="text-[var(--color-charcoal-200)] focus:bg-[var(--color-charcoal-800)] focus:text-[var(--color-charcoal-50)]"
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteSession(session.id)}
                                  className="text-red-400 focus:bg-red-950 focus:text-red-300"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
