import { useState } from 'react';
import { Clock, HelpCircle, Weight, Calendar, ChevronDown, CheckCircle } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { updateTest } from '../api/endpoints';
import type { LiveUntilOption, PublishTab } from '../types';

interface PublishConfigProps {
  testId: string;
  testName: string;
  totalTime: number;
  totalQuestions: number;
  totalMarks: number;
  difficulty?: string;
  subjectName?: string;
  topicTags?: string[];
  subTopicTags?: string[];
  onBack: () => void;
  onDone: () => void;
}

const liveUntilOptions: LiveUntilOption[] = [
  'Always Available', '1 Week', '2 Weeks',
  '3 Weeks', '1 Month', 'Custom Duration',
];

export default function PublishConfig({
  testId, testName, totalTime, totalQuestions, totalMarks,
  difficulty, subjectName, topicTags, subTopicTags,
  onBack, onDone,
}: PublishConfigProps) {
  const [publishTab, setPublishTab] = useState<PublishTab>('publishNow');
  const [liveUntil, setLiveUntil] = useState<LiveUntilOption>('Custom Duration');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handleConfirm = async () => {
    setPublishing(true);
    try {
      await updateTest(testId, { status: 'live' });
      onDone();
    } catch {
      setPublishing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-1 text-xs text-text-muted">Test creation</div>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-main">Test created</h2>
          <Badge variant="success">
            <CheckCircle className="h-3 w-3" /> All {totalQuestions} Questions done
          </Badge>
        </div>

        {/* Summary Card */}
        <div className="mb-5 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="navy">Chapter Wise</Badge>
            <span className="font-semibold text-text-main">{testName || 'Untitled Test'}</span>
            {difficulty && (
              <Badge variant="green">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {difficulty}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
            {subjectName && <span>Subject : <span className="font-medium text-text-main">{subjectName}</span></span>}
            {topicTags && topicTags.length > 0 && (
              <span className="flex items-center gap-1">
                Topic :
                {topicTags.map((t, i) => <Badge key={i} variant="amber">{t}</Badge>)}
              </span>
            )}
            {subTopicTags && subTopicTags.length > 0 && (
              <span className="flex items-center gap-1">
                Sub Topic :
                {subTopicTags.map((t, i) => <Badge key={i} variant="amber">{t}</Badge>)}
              </span>
            )}
            <span className="ml-auto flex items-center gap-3 text-text-muted">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {totalTime} Min</span>
              <span className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> {totalQuestions} Q's</span>
              <span className="flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> {totalMarks} Marks</span>
            </span>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="mb-5 inline-flex rounded-lg bg-gray-100 p-0.5">
          {[
            { label: 'Publish Now', value: 'publishNow' as PublishTab },
            { label: 'Schedule Publish', value: 'schedulePublish' as PublishTab },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPublishTab(opt.value)}
              className={`rounded-md px-5 py-1.5 text-sm font-semibold transition-all cursor-pointer ${
                publishTab === opt.value
                  ? 'bg-surface text-text-main shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Schedule Publish Date/Time */}
        {publishTab === 'schedulePublish' && (
          <div className="mb-5 rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-bold text-text-main">Select Date and Time</h3>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-text-main">Select Date</label>
                <div className="relative">
                  <input
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    placeholder="Select Date"
                    className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Calendar className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-text-main">Select Time</label>
                <div className="relative">
                  <input
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    placeholder="Select Time"
                    className="h-10 w-full rounded-lg border border-border bg-white pl-3 pr-8 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Until */}
        <div className="mb-5 rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1 text-sm font-bold text-text-main">Live Until</h3>
          <p className="mb-4 text-xs text-text-muted">
            Choose how long this test should remain available on the platform.
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {liveUntilOptions.map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                  liveUntil === opt ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="liveUntil"
                  checked={liveUntil === opt}
                  onChange={() => setLiveUntil(opt)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm text-text-main">{opt}</span>
              </label>
            ))}
          </div>
          {liveUntil === 'Custom Duration' && (
            <div className="mt-4 flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-text-main">Select End Date</label>
                <div className="relative">
                  <input
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Select End Date"
                    className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Calendar className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-text-main">Select End Time</label>
                <div className="relative">
                  <input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="Select End Time"
                    className="h-10 w-full rounded-lg border border-border bg-white pl-3 pr-8 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button variant="secondary" onClick={onBack}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={publishing}>
            {publishing ? 'Publishing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
