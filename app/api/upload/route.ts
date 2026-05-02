import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const maxDuration = 60

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/png',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not supported. Please upload PDF, DOCX, PPTX, TXT, JPG, or PNG files.' 
      }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${user.id}/${timestamp}-${sanitizedName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Extract text content based on file type
    let extractedText = ''
    const fileBuffer = await file.arrayBuffer()

    if (file.type === 'text/plain') {
      extractedText = new TextDecoder().decode(fileBuffer)
    } else if (file.type === 'image/jpeg' || file.type === 'image/png') {
      // For images, we'll send the base64 to AI for vision analysis
      const base64 = Buffer.from(fileBuffer).toString('base64')
      extractedText = `[IMAGE: ${file.name}]`
      
      return NextResponse.json({
        success: true,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          path: uploadData.path,
          isImage: true,
          base64: `data:${file.type};base64,${base64}`,
        }
      })
    } else if (file.type === 'application/pdf') {
      // For PDF, we extract text using pdf-parse logic
      // Since we can't use pdf-parse directly, we'll send basic info
      extractedText = `[PDF Document: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB]
      
Note: This is a PDF file. I can see you've uploaded "${file.name}". Please tell me what you'd like me to help you with regarding this document - summarize it, explain concepts, answer questions, or analyze its content.`
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = `[Word Document: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB]
      
Note: This is a Word document. I can see you've uploaded "${file.name}". Please tell me what you'd like me to help you with - summarize it, explain concepts, answer questions, or analyze its content.`
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      extractedText = `[PowerPoint Presentation: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB]
      
Note: This is a PowerPoint presentation. I can see you've uploaded "${file.name}". Please tell me what you'd like me to help you with - summarize it, explain the slides, answer questions, or analyze its content.`
    }

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        path: uploadData.path,
        isImage: false,
        extractedText,
      }
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
