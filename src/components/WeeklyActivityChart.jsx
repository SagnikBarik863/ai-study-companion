import { formatMinutes } from '../services/formatters';

export default function WeeklyActivityChart({ activity = [] }) {
  const maxMinutes = Math.max(...activity.map((item) => item.minutes), 1);

  return (
    <section className="section-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-700">
            Activity
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Weekly Activity Chart</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review your last seven days of study time to spot consistency and quiet gaps.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Based on logged session duration
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-7 items-end gap-3 sm:gap-4">
          {activity.map((item) => {
            const height = item.minutes
              ? Math.max(18, Math.round((item.minutes / maxMinutes) * 180))
              : 10;

            return (
              <div key={item.key} className="flex flex-col items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {item.minutes ? formatMinutes(item.minutes) : '0 min'}
                </span>
                <div className="flex h-48 w-full items-end rounded-3xl bg-slate-100/80 px-2 py-2">
                  <div
                    className="w-full rounded-2xl bg-gradient-to-t from-accent-700 via-accent-500 to-teal-300 shadow-md transition duration-200 hover:opacity-90"
                    style={{ height: `${height}px` }}
                    title={`${item.label}: ${formatMinutes(item.minutes)}`}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

