import {
  User,
  Lesson,
  QuizQuestion,
  Simulation,
  PhishingReport,
  UserProgress,
  QuizAttempt,
  SimulationAttempt,
  AssessmentType,
  Department
} from '../types';
import {
  INITIAL_USERS,
  LESSONS,
  PRE_TEST_QUESTIONS,
  QUIZ_QUESTIONS,
  POST_TEST_QUESTIONS,
  SIMULATIONS,
  INITIAL_REPORTS,
  INITIAL_PROGRESS_LIST,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_SIM_ATTEMPTS
} from '../data/initialData';
import { ApiService } from './api';

const STORAGE_KEYS = {
  USERS: 'pak_users',
  CURRENT_USER_ID: 'pak_current_user_id',
  LESSONS: 'pak_lessons',
  SIMULATIONS: 'pak_simulations',
  REPORTS: 'pak_reports',
  PROGRESS: 'pak_progress',
  QUIZ_ATTEMPTS: 'pak_quiz_attempts',
  SIM_ATTEMPTS: 'pak_sim_attempts',
  PASSING_SCORE: 'pak_passing_score',
};

// Safe LocalStorage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export class StorageService {
  // Initialize default data if empty
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.LESSONS)) {
      setItem(STORAGE_KEYS.LESSONS, LESSONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SIMULATIONS)) {
      setItem(STORAGE_KEYS.SIMULATIONS, SIMULATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PASSING_SCORE)) {
      setItem(STORAGE_KEYS.PASSING_SCORE, 70); // 70% passing requirement
    }
  }

  // Users
  static getUsers(): User[] {
    return getItem<User[]>(STORAGE_KEYS.USERS, []);
  }

  static getUserById(id: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.id === id);
  }

  static getCurrentUser(): User | null {
    const currentId = getItem<string | null>(STORAGE_KEYS.CURRENT_USER_ID, null);
    if (!currentId) return null;
    const user = this.getUserById(currentId);
    return user || null;
  }

  static setCurrentUser(userId: string | null): void {
    if (userId === null) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    } else {
      setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    }
  }

  static addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);

    // Also initialize progress
    const progressList = this.getAllProgress();
    progressList.push({
      userId: newUser.id,
      preTestCompleted: false,
      completedLessonIds: [],
      completedSimulationIds: [],
      quizCompleted: false,
      postTestCompleted: false,
      phishingRecognitionRate: 0,
      trainingCompleted: false
    });
    setItem(STORAGE_KEYS.PROGRESS, progressList);

    return newUser;
  }

  // Lessons
  static getLessons(): Lesson[] {
    return getItem<Lesson[]>(STORAGE_KEYS.LESSONS, LESSONS);
  }

  static getLessonById(id: string): Lesson | undefined {
    return this.getLessons().find(l => l.id === id);
  }

  // Simulations
  static getSimulations(): Simulation[] {
    return getItem<Simulation[]>(STORAGE_KEYS.SIMULATIONS, SIMULATIONS);
  }

  static getSimulationById(id: string): Simulation | undefined {
    return this.getSimulations().find(s => s.id === id);
  }

  static addSimulation(sim: Omit<Simulation, 'id'>): Simulation {
    const simulations = this.getSimulations();
    const newSim: Simulation = {
      ...sim,
      id: `sim-${Date.now()}`
    };
    simulations.push(newSim);
    setItem(STORAGE_KEYS.SIMULATIONS, simulations);
    return newSim;
  }

  // Question Pools
  static getQuestionsForAssessment(type: AssessmentType): QuizQuestion[] {
    switch (type) {
      case 'pre_test':
        return PRE_TEST_QUESTIONS;
      case 'quiz':
        return QUIZ_QUESTIONS;
      case 'post_test':
        return POST_TEST_QUESTIONS;
    }
  }

  static getPassingScore(): number {
    return getItem<number>(STORAGE_KEYS.PASSING_SCORE, 70);
  }

  static setPassingScore(score: number): void {
    setItem(STORAGE_KEYS.PASSING_SCORE, score);
  }

  // User Progress
  static getAllProgress(): UserProgress[] {
    return getItem<UserProgress[]>(STORAGE_KEYS.PROGRESS, []);
  }

  static getUserProgress(userId: string): UserProgress {
    const list = this.getAllProgress();
    let progress = list.find(p => p.userId === userId);
    if (!progress) {
      progress = {
        userId,
        preTestCompleted: false,
        completedLessonIds: [],
        completedSimulationIds: [],
        quizCompleted: false,
        postTestCompleted: false,
        phishingRecognitionRate: 0,
        trainingCompleted: false
      };
      list.push(progress);
      setItem(STORAGE_KEYS.PROGRESS, list);
    }
    return progress;
  }

  static updateUserProgress(userId: string, updates: Partial<UserProgress>): UserProgress {
    const list = this.getAllProgress();
    const index = list.findIndex(p => p.userId === userId);
    const current = this.getUserProgress(userId);
    const updated: UserProgress = {
      ...current,
      ...updates
    };

    // Calculate improvement delta if both pre and post test exist
    if (updated.preTestPercentage !== undefined && updated.postTestPercentage !== undefined) {
      updated.improvementDelta = updated.postTestPercentage - updated.preTestPercentage;
    }

    // Check if entire training workflow is completed
    const totalLessons = this.getLessons().length;
    const totalSims = this.getSimulations().length;
    const lessonsDone = updated.completedLessonIds.length >= totalLessons;
    const simsDone = updated.completedSimulationIds.length >= 4; // At least 4 simulations completed
    const quizPassed = (updated.quizPassed === true) || (updated.quizPercentage !== undefined && updated.quizPercentage >= this.getPassingScore());
    const testsDone = updated.preTestCompleted && updated.postTestCompleted;

    if (lessonsDone && simsDone && quizPassed && testsDone && !updated.trainingCompleted) {
      updated.trainingCompleted = true;
      updated.completionDate = new Date().toISOString();
      const user = this.getUserById(userId);
      const dept = user?.department || 'CORP';
      updated.certificateId = `PAK-2026-${Math.floor(10000 + Math.random() * 90000)}-${dept}`;
    }

    if (index >= 0) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    setItem(STORAGE_KEYS.PROGRESS, list);

    // Sync to Cloud SQL PostgreSQL database
    ApiService.updateUserProgress(updated).catch(err => {
      console.warn('Background database sync deferred:', err.message);
    });

    return updated;
  }

  static markLessonComplete(userId: string, lessonId: string): UserProgress {
    const progress = this.getUserProgress(userId);
    if (!progress.completedLessonIds.includes(lessonId)) {
      const updatedList = [...progress.completedLessonIds, lessonId];
      return this.updateUserProgress(userId, { completedLessonIds: updatedList });
    }
    return progress;
  }

  // Quiz / Assessment Attempts
  static getQuizAttempts(): QuizAttempt[] {
    return getItem<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
  }

  static recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completedAt'>): QuizAttempt {
    const attempts = this.getQuizAttempts();
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `att-${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    attempts.push(newAttempt);
    setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);

    // Sync attempt to database
    ApiService.saveQuizAttempt({
      userId: attempt.userId,
      assessmentType: attempt.assessmentType,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      passed: attempt.passed,
      completedAt: newAttempt.completedAt,
      answers: attempt.answers
    }).catch(err => {
      console.warn('Background quiz sync deferred:', err.message);
    });

    // Update user progress metrics
    const userId = attempt.userId;
    if (attempt.assessmentType === 'pre_test') {
      this.updateUserProgress(userId, {
        preTestCompleted: true,
        preTestScore: attempt.score,
        preTestPercentage: attempt.percentage
      });
    } else if (attempt.assessmentType === 'quiz') {
      this.updateUserProgress(userId, {
        quizCompleted: true,
        quizScore: attempt.score,
        quizPercentage: attempt.percentage,
        quizPassed: attempt.percentage >= this.getPassingScore()
      });
    } else if (attempt.assessmentType === 'post_test') {
      this.updateUserProgress(userId, {
        postTestCompleted: true,
        postTestScore: attempt.score,
        postTestPercentage: attempt.percentage
      });
    }

    return newAttempt;
  }

  // Simulation Attempts
  static getSimulationAttempts(): SimulationAttempt[] {
    return getItem<SimulationAttempt[]>(STORAGE_KEYS.SIM_ATTEMPTS, []);
  }

  static recordSimulationAttempt(attempt: Omit<SimulationAttempt, 'id' | 'completedAt'>): SimulationAttempt {
    const attempts = this.getSimulationAttempts();
    const newAttempt: SimulationAttempt = {
      ...attempt,
      id: `satt-${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    attempts.push(newAttempt);
    setItem(STORAGE_KEYS.SIM_ATTEMPTS, attempts);

    // Sync attempt to database
    ApiService.saveSimulationAttempt({
      userId: attempt.userId,
      simulationId: attempt.simulationId,
      selectedAnswer: attempt.selectedAnswer,
      isCorrect: attempt.isCorrect,
      completedAt: newAttempt.completedAt,
      timeSpentSeconds: 15
    }).catch(err => {
      console.warn('Background sim sync deferred:', err.message);
    });

    // Update completed simulation IDs and user recognition rate
    const userAttempts = attempts.filter(a => a.userId === attempt.userId);
    const uniqueSimIds = Array.from(new Set(userAttempts.map(a => a.simulationId)));
    const correctCount = userAttempts.filter(a => a.isCorrect).length;
    const recognitionRate = userAttempts.length > 0 ? Math.round((correctCount / userAttempts.length) * 100) : 0;

    this.updateUserProgress(attempt.userId, {
      completedSimulationIds: uniqueSimIds,
      phishingRecognitionRate: recognitionRate
    });

    return newAttempt;
  }

  // Reports
  static getReports(): PhishingReport[] {
    return getItem<PhishingReport[]>(STORAGE_KEYS.REPORTS, []);
  }

  static addReport(report: Omit<PhishingReport, 'id' | 'createdAt'>): PhishingReport {
    const reports = this.getReports();
    const newReport: PhishingReport = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    setItem(STORAGE_KEYS.REPORTS, reports);

    // Sync report to database
    ApiService.reportPhishing({
      userName: report.userName,
      userEmail: report.userEmail,
      department: report.department,
      subject: report.subject,
      senderAddress: report.senderAddress,
      suspiciousDetails: report.suspiciousDetails,
      urgencyLevel: report.urgencyLevel,
      simulationId: report.simulationId,
      isSimulatedCampaign: report.isSimulatedCampaign,
      status: report.status
    }).catch(err => {
      console.warn('Background report sync deferred:', err.message);
    });

    return newReport;
  }

  static updateReportStatus(reportId: string, status: PhishingReport['status'], notes?: string): PhishingReport[] {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = status;
      if (notes !== undefined) rep.adminNotes = notes;
      setItem(STORAGE_KEYS.REPORTS, reports);

      ApiService.updateReportStatus(reportId, status, notes).catch(err => {
        console.warn('Background report status sync deferred:', err.message);
      });
    }
    return reports;
  }

  // Aggregate Admin Statistics
  static getAdminStats() {
    const users = this.getUsers().filter(u => u.role === 'staff');
    const totalStaff = users.length;
    const progressList = this.getAllProgress();
    const activeStaff = users.filter(u => u.status === 'active').length;

    const completedStaff = progressList.filter(p => p.trainingCompleted).length;
    const completionRate = totalStaff > 0 ? Math.round((completedStaff / totalStaff) * 100) : 0;

    const preTestList = progressList.filter(p => p.preTestCompleted && p.preTestPercentage !== undefined);
    const avgPreTest = preTestList.length > 0 
      ? Math.round(preTestList.reduce((acc, curr) => acc + (curr.preTestPercentage || 0), 0) / preTestList.length)
      : 0;

    const postTestList = progressList.filter(p => p.postTestCompleted && p.postTestPercentage !== undefined);
    const avgPostTest = postTestList.length > 0 
      ? Math.round(postTestList.reduce((acc, curr) => acc + (curr.postTestPercentage || 0), 0) / postTestList.length)
      : 0;

    const avgImprovement = avgPostTest - avgPreTest;

    const simAttempts = this.getSimulationAttempts();
    const correctSims = simAttempts.filter(a => a.isCorrect).length;
    const recognitionRate = simAttempts.length > 0 
      ? Math.round((correctSims / simAttempts.length) * 100)
      : 0;

    const reports = this.getReports();

    return {
      totalStaff,
      activeStaff,
      completedStaff,
      completionRate,
      avgPreTest,
      avgPostTest,
      avgImprovement,
      recognitionRate,
      totalReports: reports.length,
      simulatedReports: reports.filter(r => r.isSimulatedCampaign).length,
      realThreatReports: reports.filter(r => !r.isSimulatedCampaign).length
    };
  }

  static getAdminAnalytics() {
    const users = this.getUsers().filter(u => u.role === 'staff');
    const totalUsers = users.length;
    const progressList = this.getAllProgress();

    const completedTrainingCount = progressList.filter(p => p.trainingCompleted).length;
    const completionRate = totalUsers > 0 ? Math.round((completedTrainingCount / totalUsers) * 100) : 0;

    const preTestList = progressList.filter(p => p.preTestCompleted && p.preTestPercentage !== undefined);
    const averagePreTestScore = preTestList.length > 0
      ? Math.round(preTestList.reduce((acc, curr) => acc + (curr.preTestPercentage || 0), 0) / preTestList.length)
      : 0;

    const postTestList = progressList.filter(p => p.postTestCompleted && p.postTestPercentage !== undefined);
    const averagePostTestScore = postTestList.length > 0
      ? Math.round(postTestList.reduce((acc, curr) => acc + (curr.postTestPercentage || 0), 0) / postTestList.length)
      : 0;

    const averageImprovementDelta = averagePostTestScore - averagePreTestScore;

    const simAttempts = this.getSimulationAttempts();
    const correctSims = simAttempts.filter(a => a.isCorrect).length;
    const simulationRecognitionRate = simAttempts.length > 0
      ? Math.round((correctSims / simAttempts.length) * 100)
      : 0;

    // Departmental breakdowns
    const departments: Department[] = ['Finance', 'HR', 'ICT', 'Administration', 'Operations'];
    const departmentStats = departments.map(dept => {
      const deptStaff = users.filter(u => u.department === dept);
      const staffCount = deptStaff.length;
      if (staffCount === 0) {
        return {
          department: dept,
          staffCount: 0,
          avgPreScore: 0,
          avgPostScore: 0,
          avgImprovementDelta: 0,
          completionRate: 0
        };
      }

      const deptUserIds = deptStaff.map(u => u.id);
      const deptProgress = progressList.filter(p => deptUserIds.includes(p.userId));

      const deptPre = deptProgress.filter(p => p.preTestCompleted && p.preTestPercentage !== undefined);
      const avgPre = deptPre.length > 0
        ? Math.round(deptPre.reduce((a, c) => a + (c.preTestPercentage || 0), 0) / deptPre.length)
        : 0;

      const deptPost = deptProgress.filter(p => p.postTestCompleted && p.postTestPercentage !== undefined);
      const avgPost = deptPost.length > 0
        ? Math.round(deptPost.reduce((a, c) => a + (c.postTestPercentage || 0), 0) / deptPost.length)
        : 0;

      const completed = deptProgress.filter(p => p.trainingCompleted).length;
      const deptCompRate = Math.round((completed / staffCount) * 100);

      return {
        department: dept,
        staffCount,
        avgPreScore: avgPre,
        avgPostScore: avgPost,
        avgImprovementDelta: avgPost - avgPre,
        completionRate: deptCompRate
      };
    });

    return {
      totalUsers,
      completedTrainingCount,
      completionRate,
      averagePreTestScore,
      averagePostTestScore,
      averageImprovementDelta,
      simulationRecognitionRate,
      departmentStats
    };
  }

  // Reset user data
  static resetUserData(userId: string): void {
    const progressList = this.getAllProgress().filter(p => p.userId !== userId);
    progressList.push({
      userId,
      preTestCompleted: false,
      completedLessonIds: [],
      completedSimulationIds: [],
      quizCompleted: false,
      postTestCompleted: false,
      phishingRecognitionRate: 0,
      trainingCompleted: false
    });
    setItem(STORAGE_KEYS.PROGRESS, progressList);

    const quizAttempts = this.getQuizAttempts().filter(a => a.userId !== userId);
    setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, quizAttempts);

    const simAttempts = this.getSimulationAttempts().filter(a => a.userId !== userId);
    setItem(STORAGE_KEYS.SIM_ATTEMPTS, simAttempts);
  }
}
