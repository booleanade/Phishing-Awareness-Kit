import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env, process env, or browser local storage
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const url = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.NEXT_PUBLIC_SUPABASE_URL) ||
    (typeof window !== 'undefined' ? localStorage.getItem('supabase_url') || '' : '') ||
    ''
  ).trim();

  const anonKey = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.SUPABASE_ANON_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.SUPABASE_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') || '' : '') ||
    ''
  ).trim();

  return { url, anonKey };
}

export function isSupabaseReady(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url &&
    anonKey &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    (url.startsWith('https://') || url.startsWith('http://'))
  );
}

export const isSupabaseConfigured = isSupabaseReady();

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();
  if (url && anonKey && !url.includes('placeholder')) {
    if (!clientInstance) {
      clientInstance = createClient(url, anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    }
    return clientInstance;
  }

  return createClient('https://placeholder-instance.supabase.co', 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
}

export const supabase = getSupabaseClient();

export async function signInWithGoogleSupabase(department?: string) {
  if (department && typeof window !== 'undefined') {
    try {
      localStorage.setItem('pak_selected_department', department);
    } catch (e) {
      console.warn('Could not store department in localStorage:', e);
    }
  }

  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || url.includes('placeholder')) {
    throw new Error('Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are missing. If you just added them in Vercel, please trigger a Redeploy in Vercel to bake the variables into your build.');
  }

  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithOAuth({
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
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) console.error('Error signing out of Supabase:', error);
  } catch (err) {
    console.error('Supabase signOut error:', err);
  }
}
