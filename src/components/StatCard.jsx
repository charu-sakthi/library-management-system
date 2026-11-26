export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = 'navy',
}) {
  const iconStyle =
    accent === 'gold'
      ? 'bg-amber-50/70 text-[#9a7222] border-amber-200/70'
      : 'bg-slate-50 text-[#172554] border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 transition-colors duration-150 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        {Icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg border shrink-0 ${iconStyle}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <div>
        <p className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>
    </div>
  );
}
