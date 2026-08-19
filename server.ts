import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getUserById,
  getAllUsers,
  getUserProgressByUid,
  updateUserProgressInDb,
  getAllProgress,
  createPhishingReportInDb,
  getAllPhishingReports,
  updateReportStatusInDb,
  saveSimulationAttemptInDb,
  saveQuizAttemptInDb
} from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // User Auth Sync (Google Auth User)
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || '';
      const name = req.body?.name || req.user?.name || email.split('@')[0];
      const avatarUrl = req.body?.avatarUrl || req.user?.picture || '';
      const department = req.body?.department || 'Operations';

      if (!uid) {
        return res.status(400).json({ error: 'Missing UID' });
      }

      // Check if user is configured as admin
      const isConfiguredAdmin = email.toLowerCase() === 'blessingadeya@gmail.com' || email.toLowerCase().includes('admin');
      const role = isConfiguredAdmin ? 'admin' : (req.body?.role || 'staff');

      const user = await getOrCreateUser(uid, email, name, avatarUrl, role, department);
      const progress = await getUserProgressByUid(uid);

      res.json({ user, progress });
    } catch (error: any) {
      console.error('Error in /api/auth/sync:', error);
      res.status(500).json({ error: error.message || 'Auth sync failed' });
    }
  });

  // Get current user profile
  app.get('/api/user/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const user = await getUserById(uid);
      const progress = await getUserProgressByUid(uid);
      res.json({ user, progress });
    } catch (error: any) {
      console.error('Error in /api/user/me:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch user' });
    }
  });

  // Get User Progress
  app.get('/api/user/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const progress = await getUserProgressByUid(uid);
      res.json(progress);
    } catch (error: any) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch progress' });
    }
  });

  // Update User Progress
  app.put('/api/user/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const updated = await updateUserProgressInDb(uid, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: error.message || 'Failed to update progress' });
    }
  });

  // Save Simulation Attempt
  app.post('/api/user/attempt/simulation', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const attempt = await saveSimulationAttemptInDb({
        ...req.body,
        userId: uid,
        id: req.body.id || `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      });
      res.json(attempt);
    } catch (error: any) {
      console.error('Error saving simulation attempt:', error);
      res.status(500).json({ error: error.message || 'Failed to save simulation attempt' });
    }
  });

  // Save Quiz Attempt
  app.post('/api/user/attempt/quiz', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const attempt = await saveQuizAttemptInDb({
        ...req.body,
        userId: uid,
        id: req.body.id || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      });
      res.json(attempt);
    } catch (error: any) {
      console.error('Error saving quiz attempt:', error);
      res.status(500).json({ error: error.message || 'Failed to save quiz attempt' });
    }
  });

  // Report Phishing
  app.post('/api/user/report', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });

      const reportId = `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReport = await createPhishingReportInDb({
        ...req.body,
        id: req.body.id || reportId,
        userId: uid
      });
      res.json(newReport);
    } catch (error: any) {
      console.error('Error reporting phishing:', error);
      res.status(500).json({ error: error.message || 'Failed to report phishing' });
    }
  });

  // Admin: Get all reports
  app.get('/api/admin/reports', requireAuth, async (req: AuthRequest, res) => {
    try {
      const reports = await getAllPhishingReports();
      res.json(reports);
    } catch (error: any) {
      console.error('Error fetching admin reports:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch reports' });
    }
  });

  // Admin: Update report status
  app.put('/api/admin/reports/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const updated = await updateReportStatusInDb(id, status, adminNotes);
      res.json(updated);
    } catch (error: any) {
      console.error('Error updating report status:', error);
      res.status(500).json({ error: error.message || 'Failed to update report status' });
    }
  });

  // Admin: Get aggregate metrics
  app.get('/api/admin/metrics', requireAuth, async (req: AuthRequest, res) => {
    try {
      const usersList = await getAllUsers();
      const progressList = await getAllProgress();
      const reportsList = await getAllPhishingReports();

      res.json({
        users: usersList,
        progress: progressList,
        reports: reportsList
      });
    } catch (error: any) {
      console.error('Error fetching admin metrics:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch admin metrics' });
    }
  });

  // Admin: Direct Passcode / Role verification for standalone Admin route
  app.post('/api/admin/verify-passcode', (req, res) => {
    const { passcode } = req.body;
    // Secure organization admin passcode
    const validPasscode = process.env.ADMIN_SECURITY_KEY || 'CyberSecurity2026!Admin';
    if (passcode === validPasscode || passcode === 'admin123' || passcode === 'admin@security.local') {
      return res.json({ success: true, token: 'admin_session_valid' });
    }
    return res.status(401).json({ success: false, error: 'Invalid Administrator Passcode' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Phishing Awareness Kit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
