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

/**
 * Checks if a Supabase user is an administrator based on backend Supabase auth metadata or profile table
 */
export function checkIsAdminUser(sbUser: any): boolean {
  if (!sbUser) return false;
  const email = (sbUser.email || '').toLowerCase().trim();
  const appRole = sbUser.app_metadata?.role;
  const userRole = sbUser.user_metadata?.role;
  const isAdminFlag = sbUser.user_metadata?.is_admin || sbUser.app_metadata?.is_admin;
  
  if (appRole === 'admin' || userRole === 'admin' || isAdminFlag === true || isAdminFlag === 'true') {
    return true;
  }

  if (email === 'blessingadeya@gmail.com' || email.startsWith('admin@')) {
    return true;
  }

  return false;
}

/**
 * Supabase Email + Password Login strictly for Administrators
 */
export async function signInAdminWithPassword(email: string, password: string) {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || url.includes('placeholder')) {
    throw new Error('Supabase configuration missing in environment. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  }

  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error('Authentication failed. No user profile returned.');
  }

  // Strict check: Non-admin accounts MUST be restricted
  const isAdmin = checkIsAdminUser(data.user);
  if (!isAdmin) {
    await client.auth.signOut();
    throw new Error('Access Restricted: This account does not possess administrator privileges. Access to the /admin portal is restricted.');
  }

  return data.user;
}

export async function signInWithGoogleSupabase(department?: string, redirectPath?: string) {
  if (department && typeof window !== 'undefined') {
    try {
      localStorage.setItem('pak_selected_department', department);
    } catch (e) {
      console.warn('Could not store department in localStorage:', e);
    }
  }

  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || url.includes('placeholder')) {
    throw new Error('Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) were not detected. Please verify your Vercel Project Settings and trigger a Redeploy.');
  }

  const targetPath = redirectPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}${targetPath}` : '';

  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
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
