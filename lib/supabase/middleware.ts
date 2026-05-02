import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/onboarding', '/chat', '/roadmap', '/career', '/settings', '/finance', '/study', '/goals', '/tasks', '/resources']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // For authenticated users, check onboarding status
  if (user) {
    // Skip onboarding check if already on onboarding page
    if (request.nextUrl.pathname.startsWith('/onboarding')) {
      return supabaseResponse
    }

    // Check if user needs to complete onboarding when accessing protected app routes
    const appRoutes = ['/dashboard', '/chat', '/roadmap', '/career', '/settings', '/finance', '/study', '/goals', '/tasks', '/resources']
    const isAppRoute = appRoutes.some(path => request.nextUrl.pathname.startsWith(path))
    
    if (isAppRoute) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        // Redirect to onboarding if not completed
        if (!profile?.onboarding_completed) {
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      } catch {
        // If profiles table doesn't exist yet, allow access
      }
    }

    // Redirect logged-in users away from auth pages
    if (
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup' ||
      request.nextUrl.pathname === '/forgot-password'
    ) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        const url = request.nextUrl.clone()
        url.pathname = profile?.onboarding_completed ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(url)
      } catch {
        // If profiles table doesn't exist, redirect to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
