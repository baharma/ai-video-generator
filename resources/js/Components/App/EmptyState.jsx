import Card from './Card';

export default function EmptyState({ title, description, action }) {
    return (
        <Card className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                <span className="text-lg font-semibold">AI</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-950">
                {title}
            </h3>
            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </Card>
    );
}
