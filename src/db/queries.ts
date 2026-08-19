import { eq, or, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { users, userProgress, phishingReports, simulationAttempts, quizAttempts } from './schema.ts';

// User Helpers
export async function getOrCreateUser(
  uid: string,
  email: string,
  name: string,
  avatarUrl?: string,
  role: string = 'staff',
  department: string = 'Operations'
) {
  try {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    
    // Look up by UID or Email
    const existing = await db
      .select()
      .from(users)
      .where(cleanEmail ? or(eq(users.uid, uid), eq(users.email, cleanEmail)) : eq(users.uid, uid))
      .limit(1);

    if (existing.length > 0) {
      const user = existing[0];
      const updates: Record<string, any> = {};

      if (user.uid !== uid) updates.uid = uid;
      if (avatarUrl && avatarUrl !== user.avatarUrl) updates.avatarUrl = avatarUrl;
      if (name && name !== user.name) updates.name = name;
      if (department && department !== user.department) updates.department = department;
      if (role === 'admin' && user.role !== 'admin') updates.role = 'admin';

      let updatedUser = user;
      if (Object.keys(updates).length > 0) {
        const result = await db.update(users).set(updates).where(eq(users.id, user.id)).returning();
        if (result.length > 0) updatedUser = result[0];
      }

      // Ensure progress record exists
      await db
        .insert(userProgress)
        .values({
          userId: uid,
          completedLessonIds: '[]',
          completedSimulationIds: '[]',
        })
        .onConflictDoNothing();

      return {
        ...updatedUser,
        id: String(updatedUser.id),
        createdAt: updatedUser.createdAt ? updatedUser.createdAt.toISOString() : new Date().toISOString()
      };
    }

    // Insert new user with conflict handling on UID
    const inserted = await db
      .insert(users)
      .values({
        uid,
        name: name || (cleanEmail ? cleanEmail.split('@')[0] : 'Employee'),
        email: cleanEmail,
        role,
        department,
        status: 'active',
        avatarUrl: avatarUrl || null
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          name: name || (cleanEmail ? cleanEmail.split('@')[0] : 'Employee'),
          email: cleanEmail,
          avatarUrl: avatarUrl || null,
          department
        }
      })
      .returning();

    const newUser = inserted[0];

    // Initialize progress record
    await db
      .insert(userProgress)
      .values({
        userId: uid,
        completedLessonIds: '[]',
        completedSimulationIds: '[]',
      })
      .onConflictDoNothing();

    return {
      ...newUser,
      id: String(newUser.id),
      createdAt: newUser.createdAt ? newUser.createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('Failed to retrieve or create user', { cause: error });
  }
}

export async function getUserById(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!result[0]) return null;
    return {
      ...result[0],
      id: String(result[0].id),
      createdAt: result[0].createdAt ? result[0].createdAt.toISOString() : new Date().toISOString()
    };
  } catch (error) {
    console.error('getUserById error:', error);
    throw new Error('Failed to get user by id', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    const list = await db.select().from(users).orderBy(desc(users.createdAt));
    return list.map(u => ({
      ...u,
      id: String(u.id),
      createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString()
    }));
  } catch (error) {
    console.error('getAllUsers error:', error);
    throw new Error('Failed to fetch users', { cause: error });
  }
}

// User Progress Helpers
export async function getUserProgressByUid(uid: string) {
  try {
    const result = await db.select().from(userProgress).where(eq(userProgress.userId, uid)).limit(1);
    if (result.length > 0) {
      return {
        ...result[0],
        completedLessonIds: JSON.parse(result[0].completedLessonIds || '[]'),
        completedSimulationIds: JSON.parse(result[0].completedSimulationIds || '[]'),
      };
    }

    // Create default if not exists
    const inserted = await db
      .insert(userProgress)
      .values({
        userId: uid,
        completedLessonIds: '[]',
        completedSimulationIds: '[]',
      })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: { updatedAt: new Date() }
      })
      .returning();

    return {
      ...inserted[0],
      completedLessonIds: [],
      completedSimulationIds: [],
    };
  } catch (error) {
    console.error('getUserProgressByUid error:', error);
    throw new Error('Failed to fetch user progress', { cause: error });
  }
}

export async function updateUserProgressInDb(
  uid: string,
  updates: Partial<{
    preTestCompleted: boolean;
    preTestScore: number;
    preTestPercentage: number;
    completedLessonIds: string[];
    completedSimulationIds: string[];
    quizCompleted: boolean;
    quizScore: number;
    quizPercentage: number;
    quizPassed: boolean;
    postTestCompleted: boolean;
    postTestScore: number;
    postTestPercentage: number;
    phishingRecognitionRate: number;
    improvementDelta: number;
    trainingCompleted: boolean;
    completionDate: string;
  }>
) {
  try {
    const dbUpdates: any = { ...updates };
    if (updates.completedLessonIds) {
      dbUpdates.completedLessonIds = JSON.stringify(updates.completedLessonIds);
    }
    if (updates.completedSimulationIds) {
      dbUpdates.completedSimulationIds = JSON.stringify(updates.completedSimulationIds);
    }
    dbUpdates.updatedAt = new Date();

    const result = await db
      .update(userProgress)
      .set(dbUpdates)
      .where(eq(userProgress.userId, uid))
      .returning();

    if (result.length > 0) {
      return {
        ...result[0],
        completedLessonIds: JSON.parse(result[0].completedLessonIds || '[]'),
        completedSimulationIds: JSON.parse(result[0].completedSimulationIds || '[]'),
      };
    }
    return null;
  } catch (error) {
    console.error('updateUserProgressInDb error:', error);
    throw new Error('Failed to update progress', { cause: error });
  }
}

export async function getAllProgress() {
  try {
    const list = await db.select().from(userProgress);
    return list.map(item => ({
      ...item,
      completedLessonIds: JSON.parse(item.completedLessonIds || '[]'),
      completedSimulationIds: JSON.parse(item.completedSimulationIds || '[]'),
    }));
  } catch (error) {
    console.error('getAllProgress error:', error);
    throw new Error('Failed to fetch all progress', { cause: error });
  }
}

// Phishing Reports Helpers
export async function createPhishingReportInDb(report: {
  id: string;
  userId: string;
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
}) {
  try {
    const inserted = await db
      .insert(phishingReports)
      .values({
        id: report.id,
        userId: report.userId,
        userName: report.userName,
        userEmail: report.userEmail,
        department: report.department,
        subject: report.subject,
        senderAddress: report.senderAddress,
        suspiciousDetails: report.suspiciousDetails,
        urgencyLevel: report.urgencyLevel,
        simulationId: report.simulationId || null,
        isSimulatedCampaign: report.isSimulatedCampaign,
        status: report.status,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.error('createPhishingReportInDb error:', error);
    throw new Error('Failed to create phishing report', { cause: error });
  }
}

export async function getAllPhishingReports() {
  try {
    return await db.select().from(phishingReports).orderBy(desc(phishingReports.createdAt));
  } catch (error) {
    console.error('getAllPhishingReports error:', error);
    throw new Error('Failed to get phishing reports', { cause: error });
  }
}

export async function updateReportStatusInDb(id: string, status: string, adminNotes?: string) {
  try {
    const result = await db
      .update(phishingReports)
      .set({ status, adminNotes })
      .where(eq(phishingReports.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('updateReportStatusInDb error:', error);
    throw new Error('Failed to update report status', { cause: error });
  }
}

// Simulation Attempts
export async function saveSimulationAttemptInDb(attempt: {
  id: string;
  userId: string;
  simulationId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  completedAt: string;
  timeSpentSeconds?: number;
}) {
  try {
    const inserted = await db
      .insert(simulationAttempts)
      .values({
        id: attempt.id,
        userId: attempt.userId,
        simulationId: attempt.simulationId,
        selectedAnswer: attempt.selectedAnswer,
        isCorrect: attempt.isCorrect,
        completedAt: attempt.completedAt,
        timeSpentSeconds: attempt.timeSpentSeconds || 0,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.error('saveSimulationAttemptInDb error:', error);
    throw new Error('Failed to save simulation attempt', { cause: error });
  }
}

export async function getSimulationAttemptsByUserId(userId: string) {
  try {
    return await db.select().from(simulationAttempts).where(eq(simulationAttempts.userId, userId));
  } catch (error) {
    console.error('getSimulationAttemptsByUserId error:', error);
    throw new Error('Failed to get simulation attempts', { cause: error });
  }
}

// Quiz Attempts
export async function saveQuizAttemptInDb(attempt: {
  id: string;
  userId: string;
  assessmentType: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed?: boolean;
  completedAt: string;
  answers: any[];
}) {
  try {
    const inserted = await db
      .insert(quizAttempts)
      .values({
        id: attempt.id,
        userId: attempt.userId,
        assessmentType: attempt.assessmentType,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed ?? false,
        completedAt: attempt.completedAt,
        answersJson: JSON.stringify(attempt.answers),
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.error('saveQuizAttemptInDb error:', error);
    throw new Error('Failed to save quiz attempt', { cause: error });
  }
}
