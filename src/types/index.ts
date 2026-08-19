export type UserRole = 'staff' | 'admin';

export type Department = 'ICT' | 'HR' | 'Finance' | 'Administration' | 'Operations';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  orderNumber: number;
  status: 'published' | 'draft';
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
    callout?: {
      type: 'warning' | 'tip' | 'danger' | 'info';
      title: string;
      message: string;
    };
  }[];
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: 'a' | 'b' | 'c' | 'd';
    text: string;
  }[];
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  relatedLessonId?: string;
}

export type AssessmentType = 'pre_test' | 'quiz' | 'post_test';

export interface QuizAttempt {
  id: string;
  userId: string;
  assessmentType: AssessmentType;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed?: boolean;
  completedAt: string;
  answers: {
    questionId: string;
    selectedAnswer: 'a' | 'b' | 'c' | 'd';
    isCorrect: boolean;
  }[];
}

export interface Simulation {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Credential Harvester' | 'Urgent Invoice / BEC' | 'Cloud Security Alert' | 'HR / Payroll Scams' | 'IT Support / Impersonation' | 'Legitimate Official Notice';
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  dateString: string;
  messageHtml: string;
  messageText: string;
  hasAttachment: boolean;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentType?: string;
  displayUrl?: string;
  actualDestinationUrl?: string;
  isPhishing: boolean;
  warningSigns: string[];
  explanation: string;
  tacticsUsed: string[];
}

export interface SimulationAttempt {
  id: string;
  userId: string;
  simulationId: string;
  selectedAnswer: 'phishing' | 'legitimate';
  isCorrect: boolean;
  completedAt: string;
  timeSpentSeconds?: number;
}

export interface PhishingReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: Department;
  subject: string;
  senderAddress: string;
  suspiciousDetails: string;
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  simulationId?: string;
  isSimulatedCampaign: boolean;
  status: 'Pending Review' | 'Investigating' | 'Confirmed Phish' | 'Simulated Test' | 'False Positive';
  createdAt: string;
  adminNotes?: string;
}

export interface UserProgress {
  userId: string;
  preTestCompleted: boolean;
  preTestScore?: number;
  preTestPercentage?: number;
  completedLessonIds: string[];
  completedSimulationIds: string[];
  quizCompleted: boolean;
  quizScore?: number;
  quizPercentage?: number;
  quizPassed?: boolean;
  postTestCompleted: boolean;
  postTestScore?: number;
  postTestPercentage?: number;
  phishingRecognitionRate: number; // percentage correctly identified
  improvementDelta?: number; // postTest% - preTest%
  trainingCompleted: boolean;
  completionDate?: string;
  certificateId?: string;
}
