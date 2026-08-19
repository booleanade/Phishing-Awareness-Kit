import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Google / Firebase UID
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('staff'), // 'staff' | 'admin'
  department: text('department').notNull().default('Operations'),
  status: text('status').notNull().default('active'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Progress table
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  preTestCompleted: boolean('pre_test_completed').notNull().default(false),
  preTestScore: integer('pre_test_score').notNull().default(0),
  preTestPercentage: integer('pre_test_percentage').notNull().default(0),
  completedLessonIds: text('completed_lesson_ids').notNull().default('[]'),
  completedSimulationIds: text('completed_simulation_ids').notNull().default('[]'),
  quizCompleted: boolean('quiz_completed').notNull().default(false),
  quizScore: integer('quiz_score').notNull().default(0),
  quizPercentage: integer('quiz_percentage').notNull().default(0),
  quizPassed: boolean('quiz_passed').notNull().default(false),
  postTestCompleted: boolean('post_test_completed').notNull().default(false),
  postTestScore: integer('post_test_score').notNull().default(0),
  postTestPercentage: integer('post_test_percentage').notNull().default(0),
  phishingRecognitionRate: integer('phishing_recognition_rate').notNull().default(0),
  improvementDelta: integer('improvement_delta').notNull().default(0),
  trainingCompleted: boolean('training_completed').notNull().default(false),
  completionDate: text('completion_date'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Phishing Reports table
export const phishingReports = pgTable('phishing_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  department: text('department').notNull(),
  subject: text('subject').notNull(),
  senderAddress: text('sender_address').notNull(),
  suspiciousDetails: text('suspicious_details').notNull(),
  urgencyLevel: text('urgency_level').notNull().default('High'),
  simulationId: text('simulation_id'),
  isSimulatedCampaign: boolean('is_simulated_campaign').notNull().default(false),
  status: text('status').notNull().default('Pending Review'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Simulation Attempts table
export const simulationAttempts = pgTable('simulation_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  simulationId: text('simulation_id').notNull(),
  selectedAnswer: text('selected_answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  completedAt: text('completed_at').notNull(),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
});

// Quiz Attempts table
export const quizAttempts = pgTable('quiz_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  assessmentType: text('assessment_type').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  percentage: integer('percentage').notNull(),
  passed: boolean('passed').notNull().default(false),
  completedAt: text('completed_at').notNull(),
  answersJson: text('answers_json').notNull(),
});
