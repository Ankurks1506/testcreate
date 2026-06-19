import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectField from '../components/SelectField';
import Stepper from '../components/Stepper';
import type { Subject, Topic, SubTopic, TestFormState, Difficulty } from '../types';
import { getSubjects, getTopicsBySubject, getSubTopicsByMultiTopics } from '../api/endpoints';

interface ChapterWiseProps {
  initial?: Partial<TestFormState>;
  onBack: () => void;
  onSave: (data: TestFormState) => void;
  editMode?: boolean;
}

const testTypes = ['Chapter Wise', 'PYQ', 'Mock Test'];

function defaultForm(): TestFormState {
  return {
    name: '',
    type: 'chapterwise',
    subject: '',
    topics: [],
    sub_topics: [],
    correct_marks: 4,
    wrong_marks: -1,
    unattempt_marks: 0,
    difficulty: 'Easy',
    total_time: 60,
    total_marks: 250,
    total_questions: 50,
  };
}

export default function ChapterWise({ initial, onBack, onSave, editMode }: ChapterWiseProps) {
  const [form, setForm] = useState<TestFormState>(initial ? { ...defaultForm(), ...initial } : defaultForm());
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingSubTopics, setLoadingSubTopics] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(testTypes[0]);

  useEffect(() => {
    getSubjects()
      .then((res) => setSubjects(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleSubjectChange = async (subjectId: string) => {
    setForm((prev) => ({ ...prev, subject: subjectId, topics: [], sub_topics: [] }));
    setSubTopics([]);
    setValidationErrors((prev) => ({ ...prev, subject: '' }));
    if (!subjectId) { setTopics([]); return; }
    setLoadingTopics(true);
    try {
      const res = await getTopicsBySubject(subjectId);
      setTopics(res.data.data || []);
    } catch {
      setTopics([]);
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleTopicChange = async (topicId: string) => {
    const newTopics = topicId ? [topicId] : [];
    setForm((prev) => ({ ...prev, topics: newTopics, sub_topics: [] }));
    setValidationErrors((prev) => ({ ...prev, topics: '' }));
    if (!topicId) { setSubTopics([]); return; }
    setLoadingSubTopics(true);
    try {
      const res = await getSubTopicsByMultiTopics([topicId]);
      setSubTopics(res.data.data || []);
    } catch {
      setSubTopics([]);
    } finally {
      setLoadingSubTopics(false);
    }
  };

  const update = <K extends keyof TestFormState>(key: K, value: TestFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => ({ ...prev, [key as string]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Test name is required';
    if (!form.subject) errs.subject = 'Subject is required';
    if (form.topics.length === 0) errs.topics = 'At least one topic is required';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (validateForm: boolean) => {
    setError('');
    if (validateForm && !validate()) return;
    setSaving(true);
    try {
      await onSave(form);
    } catch (err: unknown) {
      const data =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { message?: string; errors?: unknown } } }).response?.data
          : null;
      let msg = data?.message || (err instanceof Error ? err.message : 'Failed to save test');
      if (data?.errors && Array.isArray(data.errors)) {
        const lines = data.errors.map((e: Record<string, unknown>) => {
          const c = e.constraints;
          if (c && typeof c === 'object') return (Object.values(c as Record<string, string>)).join(', ');
          if (e.message) return e.message;
          return JSON.stringify(e);
        });
        if (lines.length) msg = lines.join('\n');
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-[900px] mx-auto">
        {/* Tab group */}
        <div className="mb-5 inline-flex rounded-lg bg-gray-100 p-0.5">
          {testTypes.map((t) => (
            <button
              key={t}
              onClick={() => { setActiveTab(t); update('type', t.toLowerCase().replace(/\s+/g, '')); }}
              className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === t
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-surface p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <SelectField
              label="Subject *"
              placeholder="Choose from Drop-down"
              value={form.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </SelectField>

            <Input
              label="Name of Test *"
              placeholder="Enter name of Test"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />

            <SelectField
              label="Topic *"
              placeholder={form.subject ? 'Select Topic' : 'Select a subject first'}
              value={form.topics[0] || ''}
              onChange={(e) => handleTopicChange(e.target.value)}
              disabled={!form.subject || loadingTopics}
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </SelectField>

            <SelectField
              label="Sub Topic"
              placeholder={form.topics.length > 0 ? 'Select Sub Topic' : 'Select a topic first'}
              value={form.sub_topics[0] || ''}
              onChange={(e) => update('sub_topics', e.target.value ? [e.target.value] : [])}
              disabled={form.topics.length === 0 || loadingSubTopics}
            >
              {subTopics.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </SelectField>

            <Input
              label="Duration (Minutes)"
              type="number"
              placeholder="Enter the time"
              value={form.total_time}
              onChange={(e) => update('total_time', Number(e.target.value))}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-main">Test Difficulty Level</label>
              <div className="flex items-center gap-5 h-10">
                {(['Easy', 'Medium', 'Difficult'] as Difficulty[]).map((d) => (
                  <label key={d} className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={form.difficulty === d}
                      onChange={() => update('difficulty', d)}
                      className="h-4 w-4 accent-primary"
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {validationErrors.name && (
            <p className="mt-2 text-xs text-destructive">{validationErrors.name}</p>
          )}

          <div className="mt-8">
            <h3 className="mb-4 text-sm font-bold text-text-main">Marking Scheme:</h3>
            <div className="grid grid-cols-5 gap-4">
              <Stepper label="Wrong Answer" value={form.wrong_marks} onChange={(v) => update('wrong_marks', v)} />
              <Stepper label="Unattempted" value={form.unattempt_marks} onChange={(v) => update('unattempt_marks', v)} />
              <Stepper label="Correct Answer" value={form.correct_marks} onChange={(v) => update('correct_marks', v)} />
              <Stepper label="No of Questions" value={form.total_questions} onChange={(v) => update('total_questions', v)} placeholder="Ex: 50" />
              <Stepper label="Total Marks" value={form.total_marks} onChange={(v) => update('total_marks', v)} placeholder="Ex:250 Marks" disabled />
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-destructive-bg px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button variant="secondary" onClick={onBack}>Cancel</Button>
            <div className="flex items-center gap-3">
              {!editMode && (
                <Button variant="ghost" onClick={() => handleSave(false)} disabled={saving}>
                  Save as Draft
                </Button>
              )}
              <Button onClick={() => handleSave(true)} disabled={saving}>
                {saving ? 'Saving...' : editMode ? 'Save' : 'Next: Add Questions'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
