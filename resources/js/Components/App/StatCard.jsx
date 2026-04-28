import Card from './Card';

export default function StatCard({ title, value, description }) {
    return (
        <Card className="overflow-hidden p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>
                <span className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700">
                    AI
                </span>
            </div>
            {description && (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                    {description}
                </p>
            )}
        </Card>
    );
}
