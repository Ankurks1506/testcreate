import { useState } from 'react';
import {
  Clock, HelpCircle, Weight, ChevronLeft, ChevronRight,
  Trash2, Plus, CheckCircle, Circle, Pencil,
  Italic, Underline, Link, Bold, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image, Code, FileDown,
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SelectField from '../components/SelectField';
import { createQuestionsBulk, updateTest } from '../api/endpoints';
import type { TestFormState, QuestionItem } from '../types';

interface WorkspaceProps {
  form: TestFormState;
  testId: string;
  onBack: () => void;
  onPublish: (newTestId: string) => void;
}

interface LocalQuestion {
  localId: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  media_url: string;
}

const difficulties = ['Easy', 'Medium', 'Difficult'];
const topicsList = ['Grammar', 'Algebra', 'Physics'];
const subTopicsList = ['Tenses', 'Linear Equations', 'Mechanics'];

export default function Workspace({ form, testId, onBack, onPublish }: WorkspaceProps) {
  const [questions, setQuestions] = useState<LocalQuestion[]>(() =>
    Array.from({ length: Math.max(form.total_questions, 1) }, (_, i) => ({
      localId: i + 1,
      question: '',
      option1: '', option2: '', option3: '', option4: '',
      correct_option: '',
      explanation: '',
      difficulty: 'Easy',
      media_url: '',
    })),
  );
  const [currentId, setCurrentId] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentQ = questions.find((q) => q.localId === currentId) || questions[0];
  const currentIdx = currentQ ? questions.indexOf(currentQ) : 0;

  const updateCurrent = (field: keyof LocalQuestion, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.localId === currentId ? { ...q, [field]: value } : q)),
    );
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.localId)) + 1;
    setQuestions((prev) => [
      ...prev,
      { localId: newId, question: '', option1: '', option2: '', option3: '', option4: '', correct_option: '', explanation: '', difficulty: 'Easy', media_url: '' },
    ]);
    setCurrentId(newId);
  };

  const removeCurrent = () => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.localId !== currentId));
    setCurrentId(questions[0].localId === currentId ? questions[1]?.localId || questions[0].localId : currentId);
  };

  const handleSave = async () => {
    const filled = questions.filter((q) => q.question.trim() && q.option1.trim() && q.option2.trim() && q.correct_option);
    if (filled.length < 1) {
      setError('At least one question must have text, both options, and a correct answer selected');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (filled.length !== questions.length) {
        setError(`Only ${filled.length} of ${questions.length} questions are complete. Fill in the remaining questions or remove them.`);
        setSaving(false);
        return;
      }
      const payload = {
        questions: filled.map((q) => ({
          type: 'mcq' as const,
          subject: form.subject,
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correct_option: q.correct_option,
          explanation: q.explanation || undefined,
          difficulty: q.difficulty.toLowerCase(),
          media_url: q.media_url || undefined,
          test_id: testId,
        })),
      };
      const res = await createQuestionsBulk(payload);
      const createdIds = (res.data.data || []).map((q: QuestionItem) => q.id);
      await updateTest(testId, {
        total_questions: filled.length,
        total_marks: form.correct_marks * filled.length,
        questions: createdIds,
      });
      onPublish(testId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save questions');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = questions.filter(
    (q) => q.question.trim() && q.option1.trim() && q.option2.trim() && q.correct_option,
  ).length;

  return (
    <div className="flex h-full">
      {/* Left Question Panel */}
      <aside className="w-[160px] shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <span className="text-xs font-semibold text-text-main">Question creation</span>
          <button className="cursor-pointer text-text-muted hover:text-text-main">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="px-3 py-2 text-[11px] text-text-muted border-b border-border">
          Total Questions : {questions.length}
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {questions.map((q) => {
            const isCurrent = q.localId === currentId;
            const done = q.question.trim() && q.option1.trim() && q.correct_option ? true : false;
            return (
              <button
                key={q.localId}
                onClick={() => setCurrentId(q.localId)}
                className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'border border-primary bg-white shadow-sm text-text-main font-semibold'
                    : 'border border-transparent text-text-muted hover:text-text-main'
                }`}
              >
                {done ? (
                  <CheckCircle className="h-3 w-3 text-success shrink-0" />
                ) : (
                  <Circle className="h-3 w-3 text-gray-300 shrink-0" />
                )}
                <span className="truncate flex-1 text-left">Question {q.localId}</span>
                <ChevronRight className="h-2.5 w-2.5 shrink-0" />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="flex flex-1 flex-col bg-page-bg overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[860px] mx-auto p-6 pb-20">
          {/* Test Metadata Header */}
          <div className="mb-5 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="navy">Chapter Wise</Badge>
              <span className="flex items-center gap-2 text-sm font-semibold text-text-main">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
                Chapter 1
              </span>
              <Badge variant="green">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Easy
              </Badge>
              <button className="ml-auto cursor-pointer text-text-muted hover:text-primary transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
              <span>Select: <span className="font-medium text-text-main">English</span></span>
              <span className="flex items-center gap-1">
                Topic:
                <Badge variant="amber">Grammar</Badge>
                <Badge variant="amber">Writing</Badge>
              </span>
              <span className="flex items-center gap-1">
                Sub Topic:
                <Badge variant="amber">Application</Badge>
              </span>
              <span className="ml-auto flex items-center gap-3 text-text-muted">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {form.total_time} Min</span>
                <span className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> {questions.length} Q's</span>
                <span className="flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> {form.total_marks} Marks</span>
              </span>
            </div>
          </div>

          {/* Question Body */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-main">Question {currentIdx + 1}/{questions.length}</h3>
              <div className="flex items-center gap-4">
                <button onClick={addQuestion} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> MCQ
                </button>
                <button className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-main cursor-pointer">
                  <FileDown className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
            </div>

            {questions.length > 1 && (
              <button
                onClick={removeCurrent}
                className="mb-3 flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete All Edits
              </button>
            )}

            {/* Rich text toolbar */}
            <div className="mb-2 flex items-center gap-1 border border-border rounded-lg bg-white px-2 py-1.5 overflow-x-auto">
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Bold className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Italic className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Underline className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Link className="h-3.5 w-3.5" /></button>
              <span className="mx-1 h-5 w-px bg-border" />
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><List className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><ListOrdered className="h-3.5 w-3.5" /></button>
              <span className="mx-1 h-5 w-px bg-border" />
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><AlignLeft className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><AlignCenter className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><AlignRight className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><AlignJustify className="h-3.5 w-3.5" /></button>
              <span className="mx-1 h-5 w-px bg-border" />
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Image className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Code className="h-3.5 w-3.5" /></button>
              <span className="mx-1 h-5 w-px bg-border" />
              <button className="rounded p-1 text-text-muted hover:bg-gray-100 hover:text-text-main cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>

            {/* Question text */}
            <textarea
              placeholder="Type here"
              value={currentQ?.question || ''}
              onChange={(e) => updateCurrent('question', e.target.value)}
              className="mb-5 min-h-[80px] w-full resize-none rounded-lg border border-border bg-white p-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {/* Options */}
            <p className="mb-3 text-sm font-bold text-text-main">Type the options below</p>
            {(['option1', 'option2', 'option3', 'option4'] as const).map((key) => (
              <div key={key} className="flex items-center gap-2.5 mb-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={currentQ?.correct_option === key}
                  onChange={() => updateCurrent('correct_option', key)}
                  className="h-4 w-4 shrink-0 accent-primary cursor-pointer"
                />
                <input
                  placeholder="Type Option here"
                  value={currentQ?.[key] || ''}
                  onChange={(e) => updateCurrent(key, e.target.value)}
                  className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button className="cursor-pointer text-text-muted hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Add Solution */}
            <div className="mt-5 mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-text-main">Add Solution</p>
                <button className="cursor-pointer text-text-muted hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                placeholder="Type here"
                value={currentQ?.explanation || ''}
                onChange={(e) => updateCurrent('explanation', e.target.value)}
                className="min-h-[70px] w-full resize-none rounded-lg border border-border bg-white p-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Pagination */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  const idx = questions.findIndex((q) => q.localId === currentId);
                  if (idx > 0) setCurrentId(questions[idx - 1].localId);
                }}
                disabled={currentIdx === 0}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-gray-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-text-muted">{currentIdx + 1}/{questions.length}</span>
              <button
                onClick={() => {
                  const idx = questions.findIndex((q) => q.localId === currentId);
                  if (idx < questions.length - 1) setCurrentId(questions[idx + 1].localId);
                }}
                disabled={currentIdx === questions.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-gray-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Question settings */}
            <div>
              <p className="mb-3 text-sm font-bold text-text-main">Question settings</p>
              <div className="grid grid-cols-3 gap-4">
                <SelectField
                  label="Level of Difficulty"
                  placeholder="Select from Drop-down"
                  value={currentQ?.difficulty || 'Easy'}
                  onChange={(e) => updateCurrent('difficulty', e.target.value)}
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectField>
                <SelectField
                  label="Topic"
                  placeholder="Select from Drop-down"
                  value=""
                  onChange={() => {}}
                >
                  {topicsList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </SelectField>
                <SelectField
                  label="Sub-topic"
                  placeholder="Select from Drop-down"
                  value=""
                  onChange={() => {}}
                >
                  {subTopicsList.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </SelectField>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-destructive-bg px-4 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          </div>
        </div>

        <div className="border-t border-border bg-surface px-6 py-3 flex items-center justify-between shrink-0">
          <Button variant="danger" onClick={onBack}>Exit Test Creation</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : `Next (${completedCount}/${questions.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
