import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://mock-instance.supabase.co', 'mock-anon-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false
      }
    });

export async function signInWithGoogleSupabase(department?: string) {
  if (department) {
    try {
      localStorage.setItem('pak_selected_department', department);
    } catch (e) {
      console.warn('Could not store pending department in localStorage:', e);
    }
  }

  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) need to be configured in your Vercel/environment settings.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signOutSupabase() {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out of Supabase:', error);
  } catch (err) {
    console.error('Supabase signOut error:', err);
  }
}
