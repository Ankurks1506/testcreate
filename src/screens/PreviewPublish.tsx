import { useEffect, useState } from 'react';
import { Clock, HelpCircle, Weight, CheckCircle, Pencil, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { getTestById, getSubjects, fetchBulkQuestions, updateTest } from '../api/endpoints';
import type { Test, Subject, QuestionItem } from '../types';

interface PreviewPublishProps {
  testId: string;
  onBack: () => void;
  onDone: () => void;
  onEditTest?: (id: string) => void;
  onEditQuestions?: (id: string) => void;
}

export default function PreviewPublish({ testId, onBack, onDone, onEditTest, onEditQuestions }: PreviewPublishProps) {
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [subjectName, setSubjectName] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [testRes, subjectsRes] = await Promise.all([getTestById(testId), getSubjects()]);
        const t = testRes.data.data;
        setTest(t);

        const sm: Record<string, string> = {};
        (subjectsRes.data.data || []).forEach((s: Subject) => { sm[s.id] = s.name; });
        setSubjectName(sm[t.subject] || t.subject || '');

        if (t.questions && t.questions.length > 0) {
          const qRes = await fetchBulkQuestions(t.questions);
          setQuestions(qRes.data.data || []);
        }
      } catch {
        // ignore
      }
    })();
  }, [testId]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await updateTest(testId, { status: 'live' });
      setPublished(true);
    } catch {
      setPublishing(false);
    }
  };

  if (!test) {
    return (
      <div className="p-6">
        <div className="max-w-[900px] mx-auto">
          <p className="text-sm text-text-muted">Loading test details...</p>
        </div>
      </div>
    );
  }

  if (published) {
    return (
      <div className="p-6">
        <div className="max-w-[500px] mx-auto mt-20 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-success-bg flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-main mb-2">Test Published Successfully!</h2>
          <p className="text-sm text-text-muted mb-8">
            Your test "{test.name}" is now live on the platform.
          </p>
          <Button onClick={onDone}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={onBack} className="cursor-pointer text-text-muted hover:text-text-main">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-text-main">Preview & Publish</h2>
        </div>

        {/* Test Summary */}
        <div className="mb-5 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="navy">{(test.type || 'chapterwise').charAt(0).toUpperCase() + (test.type || 'chapterwise').slice(1)}</Badge>
            <span className="font-semibold text-text-main">{test.name}</span>
            <Badge variant="green">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {test.difficulty}
            </Badge>
            <button
              onClick={() => onEditTest?.(testId)}
              className="ml-auto cursor-pointer text-text-muted hover:text-primary transition-colors"
              title="Edit test details"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-text-muted">Subject :</span>
            <span className="font-medium text-text-main">{subjectName || '-'}</span>
            <span className="ml-auto flex items-center gap-4 text-text-muted">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {test.total_time} Min</span>
              <span className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> {test.total_questions} Q's</span>
              <span className="flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> {test.total_marks} Marks</span>
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="text-text-muted">Wrong: <span className="font-medium text-text-main">{test.wrong_marks}</span></span>
            <span className="text-text-muted">Unattempt: <span className="font-medium text-text-main">{test.unattempt_marks}</span></span>
            <span className="text-text-muted">Correct: <span className="font-medium text-text-main">{test.correct_marks}</span></span>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="mb-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">Questions ({questions.length})</h3>
              <button
                onClick={() => onEditQuestions?.(testId)}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer"
              >
                <Pencil className="h-4 w-4" /> Edit Questions
              </button>
            </div>
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-xl border border-border bg-surface p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">Q{i + 1}. {q.question}</span>
                  {q.difficulty && <Badge variant="amber">{q.difficulty}</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2 ml-4">
                  {(['option1', 'option2', 'option3', 'option4'] as const).map((key) => {
                    const val = q[key];
                    const isCorrect = q.correct_option === key;
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          isCorrect ? 'bg-success-bg text-success-text font-medium' : 'bg-gray-50 text-text-main'
                        }`}
                      >
                        {isCorrect && <CheckCircle className="h-3.5 w-3.5 shrink-0" />}
                        <span>{val}</span>
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <p className="mt-3 text-xs text-text-muted"><strong>Explanation:</strong> {q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-5">
          <Button variant="secondary" onClick={onBack}>Back</Button>
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? 'Publishing...' : 'Publish Test'}
          </Button>
        </div>
      </div>
    </div>
  );
}
