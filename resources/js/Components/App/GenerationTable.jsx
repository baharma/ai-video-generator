import DangerButton from './DangerButton';
import MetadataBadge from './MetadataBadge';
import SecondaryButton from './SecondaryButton';

export default function GenerationTable({ generations = [] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Title
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Tone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Duration
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Created
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {generations.map((generation) => (
                            <tr key={generation.id} className="hover:bg-slate-50">
                                <td className="max-w-sm px-6 py-5">
                                    <p className="font-semibold text-slate-950">
                                        {generation.title}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {generation.topic}
                                    </p>
                                </td>
                                <td className="px-6 py-5">
                                    <MetadataBadge tone="cyan">
                                        {generation.video_type}
                                    </MetadataBadge>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                    {generation.tone}
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-600">
                                    {generation.duration}
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-600">
                                    {generation.created_at}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-2">
                                        <SecondaryButton
                                            as="a"
                                            href={route(
                                                'generations.show',
                                                generation.id,
                                            )}
                                            className="px-3 py-2"
                                        >
                                            View
                                        </SecondaryButton>
                                        <SecondaryButton className="px-3 py-2">
                                            Export
                                        </SecondaryButton>
                                        <DangerButton className="px-3 py-2">
                                            Delete
                                        </DangerButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
                {generations.map((generation) => (
                    <div key={generation.id} className="p-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <MetadataBadge tone="cyan">
                                {generation.video_type}
                            </MetadataBadge>
                            <MetadataBadge>{generation.duration}</MetadataBadge>
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-slate-950">
                            {generation.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {generation.topic}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Tone
                                </p>
                                <p className="mt-1 text-slate-700">
                                    {generation.tone}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Created
                                </p>
                                <p className="mt-1 text-slate-700">
                                    {generation.created_at}
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <SecondaryButton
                                as="a"
                                href={route('generations.show', generation.id)}
                                className="px-3 py-2"
                            >
                                View
                            </SecondaryButton>
                            <SecondaryButton className="px-3 py-2">
                                Export
                            </SecondaryButton>
                            <DangerButton className="px-3 py-2">
                                Delete
                            </DangerButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
