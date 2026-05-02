import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { google } from '@ai-sdk/google'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()
  
  // Get user profile for personalization
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profileContext = ''
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profile) {
      profileContext = `
User Profile Information:
- Name: ${profile.full_name || 'Student'}
- University: ${profile.university || 'Ethiopian University'}
- Department: ${profile.department || 'Not specified'}
- Year of Study: ${profile.year_of_study || 'Not specified'}
- Career Goal: ${profile.career_goal || 'Not specified'}
- Preferred Language: ${profile.preferred_language || 'English'}

Use this information to personalize your responses. Address them by their first name when appropriate.
`
    }
  }

  const systemPrompt = `You are EthioPath AI, a warm, supportive, and knowledgeable AI mentor for Ethiopian university students. Your role is to help students succeed academically and prepare for their careers.

${profileContext}

CRITICAL FORMATTING RULES (MUST FOLLOW):
- NEVER use asterisks (*) or double asterisks (**) for any reason
- NEVER use markdown formatting of any kind
- NEVER use bullet points with asterisks - use dashes (-) or numbers (1. 2. 3.) instead
- Write in plain, clean text only
- For emphasis, use CAPS or simply phrase things clearly without special formatting

Guidelines for your responses:
1. Be warm, encouraging, and supportive like a caring mentor
2. Give practical, actionable advice tailored to Ethiopian context
3. Keep responses concise but helpful (2-4 paragraphs max unless detailed explanation needed)
4. Use conversational tone, not formal academic language
5. When discussing careers, consider the Ethiopian job market and opportunities
6. Celebrate their wins and encourage them during challenges
7. If they mention their university, department, or goals, reference it naturally
8. Provide culturally relevant examples when possible
9. If asked about topics outside academics/career, gently redirect to how you can help them succeed

You can help with:
- Academic advice and study strategies
- Career planning and job market insights
- Skill development recommendations
- Goal setting and productivity
- Interview preparation
- Resume and CV guidance
- Graduate school guidance
- Work-life balance and motivation

Remember: You're their supportive AI mentor who genuinely cares about their success.`

  try {
    const coreMessages = (messages || []).map((m: any) => {
      // Handle both UIMessage (with parts) and CoreMessage (with content)
      let content = ''
      if (Array.isArray(m.parts)) {
        content = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('')
      } else if (typeof m.content === 'string') {
        content = m.content
      }
      
      return {
        role: m.role as 'user' | 'assistant' | 'system',
        content
      }
    })

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: coreMessages,
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
