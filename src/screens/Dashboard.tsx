import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { getTests, updateTest, getSubjects } from '../api/endpoints';
import type { Test, Subject } from '../types';

interface DashboardProps {
  onCreateTest: () => void;
  onEditTest: (id: string) => void;
  onViewTest: (id: string) => void;
}

const statusBadge = (status: Test['status']) => {
  if (status === 'live') return <Badge variant="success">Live</Badge>;
  if (status === 'draft') return <Badge variant="amber">Draft</Badge>;
  if (status === 'scheduled') return <Badge variant="navy">Scheduled</Badge>;
  if (status === 'expired') return <Badge variant="default">Expired</Badge>;
  return <Badge variant="default">{status || 'Unknown'}</Badge>;
};

export default function Dashboard({ onCreateTest, onEditTest, onViewTest }: DashboardProps) {
  const [tests, setTests] = useState<Test[]>([]);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [testsRes, subjectsRes] = await Promise.all([getTests(), getSubjects()]);
      setTests(testsRes.data.data || []);
      const sm: Record<string, string> = {};
      (subjectsRes.data.data || []).forEach((s: Subject) => { sm[s.id] = s.name; });
      setSubjectMap(sm);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await updateTest(id, { status: 'expired' });
      setTests((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // ignore
    }
  };

  const filtered = tests.filter(
    (t) => t.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-main">Tests</h2>
          <Button onClick={onCreateTest}>
            <Plus className="h-4 w-4 mr-1.5" /> Create New Test
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-xs">
          <input
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        </div>

        {loading ? (
          <p className="text-sm text-text-muted">Loading tests...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-10 text-center">
            <p className="text-sm text-text-muted">No tests found. Create one to get started.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-left text-xs font-semibold text-text-muted">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 font-medium text-text-main">{t.name}</td>
                    <td className="px-5 py-3.5 text-text-muted">{subjectMap[t.subject] || t.subject}</td>
                    <td className="px-5 py-3.5">{statusBadge(t.status)}</td>
                    <td className="px-5 py-3.5 text-text-muted">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onViewTest(t.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary cursor-pointer transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => onEditTest(t.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary cursor-pointer transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="rounded-lg p-1.5 text-text-muted hover:bg-destructive-bg hover:text-destructive cursor-pointer transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
