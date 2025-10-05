// src/lib/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  try {
    const cookieStore = await cookies()

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            try {
              cookieStore.set({ 
                name, 
                value, 
                ...options,
                path: '/',
                sameSite: 'lax'
              })
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          },
          remove(name, options) {
            try {
              cookieStore.set({ 
                name, 
                value: '', 
                ...options,
                path: '/',
                sameSite: 'lax',
                maxAge: 0
              })
            } catch (error) {
              console.error('Error removing cookie:', error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
}