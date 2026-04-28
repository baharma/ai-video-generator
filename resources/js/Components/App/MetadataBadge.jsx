export default function MetadataBadge({ children, tone = 'default' }) {
    const tones = {
        default: 'bg-slate-100 text-slate-700 ring-slate-200',
        cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
        emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        violet: 'bg-violet-50 text-violet-700 ring-violet-100',
        amber: 'bg-amber-50 text-amber-800 ring-amber-100',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                tones[tone] || tones.default
            }`}
        >
            {children}
        </span>
    );
}
