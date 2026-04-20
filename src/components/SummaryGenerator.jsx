import { useCallback, useEffect, useState } from 'react';
import { generateTopicSummary } from '../services/aiService';

export default function SummaryGenerator({ defaultTopic = '' }) {
  const [topic, setTopic] = useState(defaultTopic);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTopic(defaultTopic);
  }, [defaultTopic]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await generateTopicSummary(topic);
      setSummary(response);
    } catch (generationError) {
      setError(generationError.message);
      setSummary('');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  return (
    <section className="glass-card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-coral-500">
            AI Summary
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Generate a quick study recap</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter a topic and get a short mock AI summary that can help with revision, note
            cleanup, and last-minute preparation.
          </p>
        </div>

        <div className="w-full max-w-xl space-y-4">
          <div>
            <label htmlFor="topic" className="mb-2 block text-sm font-semibold text-slate-700">
              Topic
            </label>
            <input
              id="topic"
              className="input-field"
              placeholder="Example: Binary Search Trees"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </div>

          <button type="button" onClick={handleGenerate} className="btn-primary" disabled={loading}>
            {loading ? 'Generating summary...' : 'Generate summary'}
          </button>

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Output
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {summary || 'Your generated summary will appear here.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
