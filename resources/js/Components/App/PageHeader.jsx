export default function PageHeader({ title, description, action }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
