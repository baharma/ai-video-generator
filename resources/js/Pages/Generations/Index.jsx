import EmptyState from '@/Components/App/EmptyState';
import GenerationTable from '@/Components/App/GenerationTable';
import PageHeader from '@/Components/App/PageHeader';
import PrimaryButton from '@/Components/App/PrimaryButton';
import SecondaryButton from '@/Components/App/SecondaryButton';
import SelectInput from '@/Components/App/SelectInput';
import TextInput from '@/Components/App/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    generations,
    filters = {},
    videoTypes = [],
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [videoType, setVideoType] = useState(filters.video_type || '');
    const rows = generations?.data || [];

    const submitFilters = (event) => {
        event.preventDefault();

        router.get(
            route('generations.index'),
            {
                search,
                video_type: videoType,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Generation History
                </h2>
            }
        >
            <Head title="Generation History" />

            <div className="bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Generation History"
                        description="Browse scripts, storyboards, Magic Hour video jobs, and saved outputs."
                        action={
                            <PrimaryButton
                                as="a"
                                href={route('generations.create')}
                            >
                                Create New Video
                            </PrimaryButton>
                        }
                    />

                    <form
                        onSubmit={submitFilters}
                        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px_auto]"
                    >
                        <TextInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search titles, topics, or keywords"
                        />
                        <SelectInput
                            value={videoType}
                            onChange={(event) => setVideoType(event.target.value)}
                        >
                            <option value="">All Types</option>
                            {videoTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </SelectInput>
                        <SecondaryButton type="submit">Filter</SecondaryButton>
                    </form>

                    {rows.length > 0 ? (
                        <div className="space-y-4">
                            <GenerationTable generations={rows} />

                            {generations.links?.length > 3 && (
                                <div className="flex flex-wrap gap-2">
                                    {generations.links.map((link) => (
                                        <SecondaryButton
                                            key={`${link.label}-${link.url}`}
                                            as="a"
                                            href={link.url || '#'}
                                            disabled={!link.url}
                                            className={
                                                link.active
                                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                                                    : ''
                                            }
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </SecondaryButton>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState
                            title="No generations yet"
                            description="Create your first AI video project to see it listed here."
                            action={
                                <PrimaryButton
                                    as="a"
                                    href={route('generations.create')}
                                >
                                    Create New Video
                                </PrimaryButton>
                            }
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
