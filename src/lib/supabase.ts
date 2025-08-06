import { createClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    __SUPABASE_URL__?: string
    __SUPABASE_ANON_KEY__?: string
  }
}

const supabaseUrl = (typeof window !== 'undefined' && window.__SUPABASE_URL__) || import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__) || import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase is connected via Lovable. If auth fails, ensure the integration is active.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
