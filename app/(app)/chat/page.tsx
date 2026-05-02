"use client"

// Force re-compile to fix module factory error
import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, UIMessage } from "ai"
import Image from "next/image"
import { 
  PaperPlaneTilt, 
  Robot, 
  User, 
  ArrowDown,
  List,
  Sparkle,
  Paperclip,
  X,
  File,
  Image as ImageIcon
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ChatSidebar } from "@/components/chat-sidebar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface ChatMessage {
  id: string
  session_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

// Helper to clean markdown asterisks from text
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1')     // Remove *italic*
    .replace(/^\s*\*\s+/gm, '- ')      // Replace * bullet points with -
    .replace(/\*\*/g, '')              // Remove any remaining **
    .replace(/\*/g, '')                // Remove any remaining *
}

// Helper to extract text from UIMessage parts
function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  const text = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
  
  // Only clean assistant messages, not user messages
  if (message.role === "assistant") {
    return cleanMarkdown(text)
  }
  return text
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [savedMessageCount, setSavedMessageCount] = useState(0)
  const [attachedFile, setAttachedFile] = useState<{
    name: string
    type: string
    size: number
    isImage: boolean
    base64?: string
    extractedText?: string
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase.auth])

  // Load sessions on mount
  const loadSessions = useCallback(async () => {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("updated_at", { ascending: false })

    if (!error && data) {
      setSessions(data)
    }
  }, [supabase])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Handle scroll to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  // Save messages to Supabase when conversation updates
  useEffect(() => {
    const saveMessages = async () => {
      if (!currentSessionId || !userId || messages.length === 0) return
      if (isLoading) return // Wait for streaming to finish before saving batch

      // Only save new messages (messages we haven't saved yet)
      const messagesToSave = messages.slice(savedMessageCount)
      if (messagesToSave.length === 0) return

      try {
        // Prepare batch insert
        const inserts = messagesToSave.map(msg => ({
          session_id: currentSessionId,
          user_id: userId,
          role: msg.role as "user" | "assistant",
          content: getMessageText(msg),
        })).filter(item => item.content)

        if (inserts.length > 0) {
          const { error: insertError } = await supabase.from("chat_messages").insert(inserts)
          if (insertError) throw insertError
        }

        // Update saved count locally
        setSavedMessageCount(messages.length)

        // Auto-generate title if this is the first interaction in a new session
        const currentSession = sessions.find(s => s.id === currentSessionId)
        const shouldUpdateTitle = currentSession && (currentSession.title === "New Chat" || currentSession.title === "")

        if (shouldUpdateTitle) {
          const firstUserMsg = messages.find(m => m.role === "user")
          if (firstUserMsg) {
            const text = getMessageText(firstUserMsg)
            const newTitle = text.slice(0, 40) + (text.length > 40 ? "..." : "")
            
            await supabase
              .from("chat_sessions")
              .update({ title: newTitle, updated_at: new Date().toISOString() })
              .eq("id", currentSessionId)
            
            // Refresh sessions list to show new title
            loadSessions()
          }
        } else {
          // Just update the timestamp
          await supabase
            .from("chat_sessions")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", currentSessionId)
          
          // Optionally update local sessions list timestamp without full refresh
          setSessions(prev => prev.map(s => 
            s.id === currentSessionId ? { ...s, updated_at: new Date().toISOString() } : s
          ))
        }
      } catch (err: any) {
        console.error("Error saving messages:", err.message || err)
        if (err.message?.includes("schema cache") || err.message?.includes("relation")) {
          toast.error("Chat history not saving: Tables missing in Supabase.")
        }
      }
    }

    saveMessages()
  }, [messages, currentSessionId, userId, isLoading, savedMessageCount, supabase, loadSessions])

  // Create new session
  const handleNewSession = async () => {
    if (!userId) {
      toast.error("Please log in to start a new chat")
      return
    }

    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: userId, title: "New Chat" })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setSessions(prev => [data, ...prev])
        setCurrentSessionId(data.id)
        setMessages([])
        setSavedMessageCount(0)
        setSidebarOpen(false)
        toast.success("New chat started")
      }
    } catch (err: any) {
      console.error("Failed to create session:", err.message || err)
      
      if (err.message?.includes("schema cache") || err.message?.includes("relation") || err.message?.includes("not found")) {
        toast.error("Database tables missing. Please run the SQL setup script in your Supabase dashboard.", {
          duration: 10000,
          action: {
            label: "How to fix?",
            onClick: () => window.open("https://github.com/supabase/supabase/discussions", "_blank")
          }
        })
      } else {
        toast.error("Failed to start chat. Please try again.")
      }

      // Fallback to local session
      const mockId = `local-${Date.now()}`
      setCurrentSessionId(mockId)
      setMessages([])
      setSavedMessageCount(0)
      setSidebarOpen(false)
    }
  }

  // Select existing session
  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === currentSessionId) {
      setSidebarOpen(false)
      return
    }

    setIsLoadingSession(true)
    setCurrentSessionId(sessionId)
    setSidebarOpen(false)
    setSavedMessageCount(0) // Reset count so we don't try to save existing messages

    try {
      // Load messages for this session
      const { data: messagesData, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })

      if (error) throw error

      if (messagesData) {
        const uiMessages: UIMessage[] = messagesData.map((msg: ChatMessage) => ({
          id: msg.id,
          role: msg.role,
          parts: [{ type: "text" as const, text: msg.content }],
          createdAt: new Date(msg.created_at),
        }))
        setMessages(uiMessages)
        setSavedMessageCount(uiMessages.length)
      }
    } catch (err) {
      console.error("Failed to load messages:", err)
      toast.error("Failed to load chat history")
    } finally {
      setIsLoadingSession(false)
    }
  }

  // Rename session
  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from("chat_sessions")
        .update({ title: newTitle })
        .eq("id", sessionId)

      if (error) throw error
      
      setSessions(prev =>
        prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s)
      )
      toast.success("Chat renamed")
    } catch (err) {
      toast.error("Failed to rename chat")
    }
  }

  // Delete session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return

    try {
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId)

      if (error) throw error

      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null)
        setMessages([])
        setSavedMessageCount(0)
      }
      toast.success("Chat deleted")
    } catch (err) {
      toast.error("Failed to delete chat")
    }
  }

  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported. Please upload PDF, DOCX, PPTX, TXT, JPG, or PNG files.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      setAttachedFile({
        name: data.file.name,
        type: data.file.type,
        size: data.file.size,
        isImage: data.file.isImage,
        base64: data.file.base64,
        extractedText: data.file.extractedText,
      })
      toast.success("File attached")
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Remove attached file
  const handleRemoveFile = () => {
    setAttachedFile(null)
  }

  // Handle send message
  const handleSend = async () => {
    const text = input.trim()
    if ((!text && !attachedFile) || isLoading) return

    let activeSessionId = currentSessionId

    // Create session if none exists
    if (!activeSessionId && userId) {
      try {
        const { data, error } = await supabase
          .from("chat_sessions")
          .insert({ user_id: userId, title: "New Chat" })
          .select()
          .single()

        if (error) throw error
        
        if (data) {
          setSessions(prev => [data, ...prev])
          activeSessionId = data.id
          setCurrentSessionId(data.id)
          setSavedMessageCount(0)
        }
      } catch (err) {
        console.error("Failed to create session on the fly:", err)
        activeSessionId = `local-${Date.now()}`
        setCurrentSessionId(activeSessionId)
      }
    }

    // Build message with file context
    let messageText = text
    if (attachedFile) {
      if (attachedFile.isImage && attachedFile.base64) {
        messageText = `[Attached Image: ${attachedFile.name}]\n\n${text || 'Please analyze this image.'}`
      } else if (attachedFile.extractedText) {
        messageText = `${attachedFile.extractedText}\n\nUser's question: ${text || 'Please summarize this document.'}`
      }
    }

    setInput("")
    setAttachedFile(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    sendMessage({ text: messageText })
  }

  // Handle suggestion click
  const handleSuggestion = async (text: string) => {
    if (!currentSessionId && userId) {
      await handleNewSession()
    }
    sendMessage({ text })
  }

  // Handle textarea resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
  }

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    "Help me create a study schedule",
    "How do I improve my GPA?",
    "What career paths fit my major?",
    "Tips for time management",
  ]

  return (
    <div className="flex h-[100dvh] bg-[var(--color-charcoal-950)]">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-950)]">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-50)]"
              onClick={() => setSidebarOpen(true)}
            >
              <List className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg overflow-hidden bg-[var(--color-charcoal-900)] flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="EthioPath AI Logo" 
                  width={36} 
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-[var(--color-charcoal-50)]">EthioPath AI</h1>
                <p className="text-xs text-[var(--color-emerald-500)]">Online</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto pb-4 relative"
        >
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Empty State */}
            {messages.length === 0 && !isLoadingSession && (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--color-emerald-600)] to-[var(--color-emerald-800)] flex items-center justify-center mb-6">
                  <Sparkle weight="fill" className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-charcoal-50)] mb-2">
                  How can I help you today?
                </h2>
                <p className="text-[var(--color-charcoal-400)] mb-8 max-w-md">
                  I&apos;m your AI mentor, ready to help with academics, career planning, and personal growth.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(suggestion)}
                      className="p-4 text-left rounded-xl border border-[var(--color-charcoal-700)] bg-[var(--color-charcoal-900)] hover:bg-[var(--color-charcoal-800)] hover:border-[var(--color-emerald-700)] transition-all"
                    >
                      <p className="text-sm text-[var(--color-charcoal-200)]">{suggestion}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Session */}
            {isLoadingSession && (
              <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="flex items-center gap-3 text-[var(--color-charcoal-400)]">
                  <div className="h-5 w-5 border-2 border-[var(--color-emerald-500)] border-t-transparent rounded-full animate-spin" />
                  <span>Loading conversation...</span>
                </div>
              </div>
            )}

            {/* Messages */}
            {!isLoadingSession && messages.length > 0 && (
              <div className="space-y-6">
                {messages.map((message) => {
                  const text = getMessageText(message)
                  const isUser = message.role === "user"

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isUser ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                          isUser
                            ? "bg-[var(--color-charcoal-700)]"
                            : "bg-[var(--color-emerald-600)]"
                        )}
                      >
                        {isUser ? (
                          <User weight="fill" className="h-4 w-4 text-[var(--color-charcoal-300)]" />
                        ) : (
                          <Robot weight="fill" className="h-4 w-4 text-white" />
                        )}
                      </div>

                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          isUser
                            ? "bg-[var(--color-emerald-600)] text-white rounded-br-md"
                            : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-100)] rounded-bl-md shadow-sm"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Error Message */}
                {error && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
                      <Robot weight="fill" className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-red-900/50 border border-red-700 rounded-2xl rounded-bl-md px-4 py-3">
                      <p className="text-sm text-red-200 font-medium mb-1">
                        AI Error
                      </p>
                      <p className="text-sm text-red-200 opacity-90">
                        {error instanceof Error ? error.message : (typeof error === 'string' ? error : "I encountered an error while generating a response. Please try again.")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Typing Indicator */}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-[var(--color-emerald-600)] flex items-center justify-center">
                      <Robot weight="fill" className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-[var(--color-charcoal-800)] rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[var(--color-charcoal-500)] animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-[var(--color-charcoal-500)] animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-[var(--color-charcoal-500)] animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-[var(--color-charcoal-800)] border border-[var(--color-charcoal-700)] flex items-center justify-center text-[var(--color-charcoal-300)] hover:bg-[var(--color-charcoal-700)] transition-colors shadow-lg z-10"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-[var(--color-charcoal-800)] bg-[var(--color-charcoal-950)] p-4 pb-20 md:pb-4">
          <div className="max-w-3xl mx-auto">
            {/* Attached File Preview */}
            {attachedFile && (
              <div className="mb-2 flex items-center gap-2 p-2 bg-[var(--color-charcoal-900)] rounded-lg border border-[var(--color-charcoal-700)]">
                <div className="h-10 w-10 rounded-lg bg-[var(--color-charcoal-800)] flex items-center justify-center">
                  {attachedFile.isImage ? (
                    <ImageIcon weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
                  ) : (
                    <File weight="fill" className="h-5 w-5 text-[var(--color-emerald-500)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-charcoal-200)] truncate">{attachedFile.name}</p>
                  <p className="text-xs text-[var(--color-charcoal-500)]">
                    {(attachedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-[var(--color-charcoal-400)] hover:text-[var(--color-charcoal-200)] hover:bg-[var(--color-charcoal-800)] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="relative flex items-end gap-2 bg-[var(--color-charcoal-900)] rounded-2xl border border-[var(--color-charcoal-700)] focus-within:border-[var(--color-emerald-600)] transition-colors">
              {/* File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="m-1.5 h-10 w-10 rounded-xl text-[var(--color-charcoal-400)] hover:text-[var(--color-emerald-500)] hover:bg-[var(--color-charcoal-800)]"
              >
                {isUploading ? (
                  <div className="h-5 w-5 border-2 border-[var(--color-emerald-500)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Paperclip className="h-5 w-5" />
                )}
              </Button>

              <textarea
                ref={textareaRef}
                value={input}
                placeholder={attachedFile ? "Ask about this file..." : "Ask me anything..."}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={1}
                className="flex-1 resize-none bg-transparent py-3 text-[var(--color-charcoal-100)] placeholder:text-[var(--color-charcoal-500)] focus:outline-none max-h-[200px]"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !attachedFile)}
                size="icon"
                className="m-1.5 h-10 w-10 rounded-xl bg-[var(--color-emerald-600)] hover:bg-[var(--color-emerald-700)] disabled:opacity-50"
              >
                <PaperPlaneTilt weight="fill" className="h-5 w-5 text-white" />
              </Button>
            </div>
            <p className="text-center text-xs text-[var(--color-charcoal-600)] mt-2">
              Attach PDF, DOCX, PPTX, TXT, or images. EthioPath AI can make mistakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
