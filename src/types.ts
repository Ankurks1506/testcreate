// ── API Response Wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ── Auth ──
export interface User {
  id: string;
  name?: string;
  email?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ── Subjects / Topics / Sub-topics ──
export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

// ── App navigation ──
export type AppView = 'login' | 'dashboard' | 'chapterWise' | 'workspace' | 'publish' | 'previewPublish';

export type Difficulty = 'Easy' | 'Medium' | 'Difficult';

// ── Test ──
export type TestStatus = 'draft' | 'live' | 'unpublished' | 'scheduled' | 'expired';

export interface Test {
  id: string;
  name: string;
  subject: string; // subject name or id
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: TestStatus;
  created_at?: string;
  questions?: string[];
  type?: string;
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: TestStatus;
}

export interface UpdateTestPayload {
  name?: string;
  total_questions?: number;
  total_marks?: number;
  status?: string;
  questions?: string[];
}

// ── Questions ──
export interface QuestionItem {
  id: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: string;
  test_id?: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
}

export interface BulkQuestionPayload {
  questions: Omit<QuestionItem, 'id'>[];
}

// ── Local form state (mirrors Test for ChapterWise) ──
export interface TestFormState {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_time: number;
  total_marks: number;
  total_questions: number;
}

// ── Live Until / Publish ──
export type LiveUntilOption =
  | 'Always Available'
  | '1 Week'
  | '2 Weeks'
  | '3 Weeks'
  | '1 Month'
  | 'Custom Duration';

export type PublishTab = 'publishNow' | 'schedulePublish';
