import { auth } from '../lib/firebase';
import { User, UserProgress, PhishingReport, SimulationAttempt, QuizAttempt } from '../types';

async function getAuthHeader(): Promise<Record<string, string>> {
  const currentUser = auth.currentUser;
  if (!currentUser) return {};
  try {
    const token = await currentUser.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (err) {
    console.error('Error getting auth token:', err);
    return { 'Content-Type': 'application/json' };
  }
}

export const ApiService = {
  // Sync Google user with backend
  async syncAuthUser(googleUser: {
    uid: string;
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
    department?: string;
  }): Promise<{ user: User; progress: UserProgress }> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: googleUser.displayName || googleUser.email.split('@')[0],
        email: googleUser.email,
        avatarUrl: googleUser.photoURL || '',
        department: googleUser.department || 'Operations'
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Sync failed' }));
      throw new Error(err.error || 'Failed to sync authenticated user');
    }

    return res.json();
  },

  // Get current user profile
  async getCurrentUser(): Promise<{ user: User; progress: UserProgress } | null> {
    const headers = await getAuthHeader();
    if (!headers['Authorization']) return null;

    const res = await fetch('/api/user/me', { headers });
    if (!res.ok) return null;
    return res.json();
  },

  // Get user progress
  async getUserProgress(): Promise<UserProgress> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/progress', { headers });
    if (!res.ok) {
      throw new Error('Failed to fetch progress');
    }
    return res.json();
  },

  // Update user progress
  async updateUserProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/progress', {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      throw new Error('Failed to update progress');
    }
    return res.json();
  },

  // Save simulation attempt
  async saveSimulationAttempt(attempt: Omit<SimulationAttempt, 'id'>): Promise<SimulationAttempt> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/attempt/simulation', {
      method: 'POST',
      headers,
      body: JSON.stringify(attempt)
    });
    if (!res.ok) {
      throw new Error('Failed to save simulation attempt');
    }
    return res.json();
  },

  // Save quiz attempt
  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/attempt/quiz', {
      method: 'POST',
      headers,
      body: JSON.stringify(attempt)
    });
    if (!res.ok) {
      throw new Error('Failed to save quiz attempt');
    }
    return res.json();
  },

  // Submit phishing report
  async reportPhishing(reportData: {
    userName: string;
    userEmail: string;
    department: string;
    subject: string;
    senderAddress: string;
    suspiciousDetails: string;
    urgencyLevel: string;
    simulationId?: string;
    isSimulatedCampaign: boolean;
    status: string;
  }): Promise<PhishingReport> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/user/report', {
      method: 'POST',
      headers,
      body: JSON.stringify(reportData)
    });
    if (!res.ok) {
      throw new Error('Failed to submit report');
    }
    return res.json();
  },

  // Admin: Get all reports
  async getAdminReports(): Promise<PhishingReport[]> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/reports', { headers });
    if (!res.ok) return [];
    return res.json();
  },

  // Admin: Update report status
  async updateReportStatus(reportId: string, status: string, adminNotes?: string): Promise<PhishingReport> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/admin/reports/${reportId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status, adminNotes })
    });
    if (!res.ok) throw new Error('Failed to update report');
    return res.json();
  },

  // Admin: Get metrics
  async getAdminMetrics(): Promise<{ users: User[]; progress: UserProgress[]; reports: PhishingReport[] }> {
    const headers = await getAuthHeader();
    const res = await fetch('/api/admin/metrics', { headers });
    if (!res.ok) return { users: [], progress: [], reports: [] };
    return res.json();
  },

  // Admin: Verify admin passcode
  async verifyAdminPasscode(passcode: string): Promise<{ success: boolean; token?: string }> {
    const res = await fetch('/api/admin/verify-passcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    if (!res.ok) return { success: false };
    return res.json();
  }
};
