import { useState, useCallback } from 'react';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import ChapterWise from './screens/ChapterWise';
import Workspace from './screens/Workspace';
import PreviewPublish from './screens/PreviewPublish';
import PublishConfig from './screens/PublishConfig';
import EditTestModal from './screens/EditTestModal';
import AppLayout from './layout/AppLayout';
import { useAuth } from './context/AuthContext';
import { createTest, getTestById } from './api/endpoints';
import type { AppView, TestFormState } from './types';

export default function App() {
  const { token } = useAuth();
  const [view, setView] = useState<AppView>('login');
  const [formState, setFormState] = useState<TestFormState | null>(null);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!token) {
    return <Login />;
  }

  const resolvedView: AppView = token && view === 'login' ? 'dashboard' : view;

  const activeNav =
    resolvedView === 'dashboard' || resolvedView === 'previewPublish'
      ? 'Dashboard'
      : 'Test creation';

  const handleNav = useCallback((label: string) => {
    if (label === 'Dashboard') {
      setFormState(null);
      setCurrentTestId(null);
      setEditingTestId(null);
      setView('dashboard');
    } else if (label === 'Test creation') {
      setFormState(null);
      setEditingTestId(null);
      setCurrentTestId(null);
      setView('chapterWise');
    }
  }, []);

  const navProps = { activeNav, onNav: handleNav };

  // ── Dashboard ──
  if (resolvedView === 'dashboard') {
    return (
      <AppLayout breadcrumbs={['Dashboard']} {...navProps}>
        <Dashboard
          onCreateTest={() => {
            setFormState(null);
            setEditingTestId(null);
            setView('chapterWise');
          }}
          onEditTest={async (id) => {
            try {
              const res = await getTestById(id);
              const t = res.data.data;
              setFormState({
                name: t.name,
                type: t.type || 'chapterwise',
                subject: t.subject,
                topics: t.topics || [],
                sub_topics: t.sub_topics || [],
                correct_marks: t.correct_marks,
                wrong_marks: t.wrong_marks,
                unattempt_marks: t.unattempt_marks,
                difficulty: t.difficulty,
                total_time: t.total_time,
                total_marks: t.total_marks,
                total_questions: t.total_questions,
              });
              setEditingTestId(id);
              setView('chapterWise');
            } catch {
              // ignore
            }
          }}
          onViewTest={(id) => {
            setCurrentTestId(id);
            setView('previewPublish');
          }}
        />
      </AppLayout>
    );
  }

  // ── Create / Edit Test (ChapterWise) ──
  if (resolvedView === 'chapterWise') {
    return (
      <AppLayout breadcrumbs={['Test Creation', 'Create Test', 'Chapter Wise']} {...navProps}>
        <ChapterWise
          initial={formState || undefined}
          onBack={() => setView('dashboard')}
          onSave={async (data) => {
            try {
              if (editingTestId) {
                setCurrentTestId(editingTestId);
                setFormState(data);
                setView('workspace');
                return;
              }
              const res = await createTest({ ...data, difficulty: data.difficulty.toLowerCase(), status: 'draft' });
              const newId = res.data.data.id;
              setCurrentTestId(newId);
              setFormState(data);
              setView('workspace');
            } catch (err) {
              throw err;
            }
          }}
        />
      </AppLayout>
    );
  }

  // ── Add Questions (Workspace) ──
  if (resolvedView === 'workspace' && currentTestId) {
    const wsForm = formState || {
      name: '', type: 'chapterwise', subject: '', topics: [], sub_topics: [],
      correct_marks: 4, wrong_marks: -1, unattempt_marks: 0, difficulty: 'Easy' as const,
      total_time: 60, total_marks: 250, total_questions: 50,
    };
    return (
      <AppLayout breadcrumbs={['Test Creation', 'Create Test', 'Chapter Wise']} {...navProps}>
        <Workspace
          form={wsForm}
          testId={currentTestId}
          onBack={() => setView('chapterWise')}
          onPublish={(newTestId) => {
            setCurrentTestId(newTestId);
            setView('publish');
          }}
        />
      </AppLayout>
    );
  }

  // ── Publish Config ──
  if (resolvedView === 'publish' && currentTestId && formState) {
    return (
      <AppLayout breadcrumbs={['Test Creation', 'Create Test', 'Chapter Wise']} {...navProps}>
        <PublishConfig
          testId={currentTestId}
          testName={formState.name}
          totalTime={formState.total_time}
          totalQuestions={formState.total_questions}
          totalMarks={formState.total_marks}
          difficulty={formState.difficulty}
          onBack={() => setView('workspace')}
          onDone={() => {
            setFormState(null);
            setCurrentTestId(null);
            setView('dashboard');
          }}
        />
      </AppLayout>
    );
  }

  // ── Preview Publish (view from dashboard) ──
  if (resolvedView === 'previewPublish' && currentTestId) {
    return (
      <AppLayout breadcrumbs={['Dashboard', 'Preview & Publish']} {...navProps}>
        <PreviewPublish
          testId={currentTestId}
          onBack={() => setView('dashboard')}
          onDone={() => {
            setCurrentTestId(null);
            setView('dashboard');
          }}
          onEditTest={async (id) => {
            try {
              const res = await getTestById(id);
              const t = res.data.data;
              setFormState({
                name: t.name,
                type: t.type || 'chapterwise',
                subject: t.subject,
                topics: t.topics || [],
                sub_topics: t.sub_topics || [],
                correct_marks: t.correct_marks,
                wrong_marks: t.wrong_marks,
                unattempt_marks: t.unattempt_marks,
                difficulty: t.difficulty,
                total_time: t.total_time,
                total_marks: t.total_marks,
                total_questions: t.total_questions,
              });
              setEditingTestId(id);
              setEditModalOpen(true);
            } catch { /* ignore */ }
          }}
          onEditQuestions={(id) => {
            setCurrentTestId(id);
            setView('workspace');
          }}
        />
        <EditTestModal
          open={editModalOpen}
          initial={formState || undefined}
          onClose={() => setEditModalOpen(false)}
          onSave={async (data) => {
            if (editingTestId) {
              setFormState(data);
              setEditModalOpen(false);
            }
          }}
        />
      </AppLayout>
    );
  }

  return null;
}
