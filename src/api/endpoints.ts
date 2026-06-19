import client from './client';
import type {
  ApiResponse,
  LoginResponse,
  Subject,
  Topic,
  SubTopic,
  Test,
  CreateTestPayload,
  UpdateTestPayload,
  QuestionItem,
  BulkQuestionPayload,
} from '../types';

// ── Auth ──
export const loginApi = (userId: string, password: string) =>
  client.post<ApiResponse<LoginResponse>>('/auth/login', { userId, password });

// ── Subjects ──
export const getSubjects = () =>
  client.get<ApiResponse<Subject[]>>('/subjects');

// ── Topics ──
export const getTopicsBySubject = (subjectId: string) =>
  client.get<ApiResponse<Topic[]>>(`/topics/subject/${subjectId}`);

// ── Sub-topics ──
export const getSubTopicsByTopic = (topicId: string) =>
  client.get<ApiResponse<SubTopic[]>>(`/sub-topics/topic/${topicId}`);

export const getSubTopicsByMultiTopics = (topicIds: string[]) =>
  client.post<ApiResponse<SubTopic[]>>('/sub-topics/multi-topics', { topicIds });

// ── Tests ──
export const getTests = () =>
  client.get<ApiResponse<Test[]>>('/tests');

export const getTestById = (id: string) =>
  client.get<ApiResponse<Test>>(`/tests/${id}`);

export const createTest = (payload: CreateTestPayload) =>
  client.post<ApiResponse<Test>>('/tests', payload);

export const updateTest = (id: string, payload: UpdateTestPayload) =>
  client.put<ApiResponse<Test>>(`/tests/${id}`, payload);

// ── Questions ──
export const createQuestionsBulk = (payload: BulkQuestionPayload) =>
  client.post<ApiResponse<QuestionItem[]>>('/questions/bulk', payload);

export const fetchBulkQuestions = (questionIds: string[]) =>
  client.post<ApiResponse<QuestionItem[]>>('/questions/fetchBulk', { question_ids: questionIds });
