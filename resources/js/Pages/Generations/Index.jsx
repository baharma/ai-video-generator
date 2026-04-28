import EmptyState from '@/Components/App/EmptyState';
import GenerationTable from '@/Components/App/GenerationTable';
import PageHeader from '@/Components/App/PageHeader';
import PrimaryButton from '@/Components/App/PrimaryButton';
import SelectInput from '@/Components/App/SelectInput';
import TextInput from '@/Components/App/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const generations = [
    {
        id: 1,
        title: 'Boost Your Brand with Smart Video Content',
        topic: 'AI marketing campaign',
        video_type: 'Marketing Video',
        tone: 'Persuasive',
        duration: '30 seconds',
        created_at: '2026-04-28',
    },
    {
        id: 2,
        title: 'Learn Laravel in 60 Seconds',
        topic: 'Laravel beginner tutorial',
        video_type: 'Educational Clip',
        tone: 'Friendly',
        duration: '60 seconds',
        created_at: '2026-04-27',
    },
    {
        id: 3,
        title: 'Promote Your Property Listing',
        topic: 'Real estate social media reel',
        video_type: 'Social Media Reel',
        tone: 'Professional',
        duration: '30 seconds',
        created_at: '2026-04-26',
    },
];

export default function Index() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All Types');

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
                        description="Browse previously generated video concepts. Search, filters, and actions are visual only for now."
                        action={
                            <PrimaryButton
                                as="a"
                                href={route('generations.create')}
                            >
                                Create New Video
                            </PrimaryButton>
                        }
                    />

                    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px]">
                        <TextInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search generation titles or topics"
                        />
                        <SelectInput
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                        >
                            <option>All Types</option>
                            <option>Marketing Video</option>
                            <option>Educational Clip</option>
                            <option>Social Media Reel</option>
                            <option>Product Demo</option>
                            <option>Explainer Video</option>
                        </SelectInput>
                    </div>

                    {generations.length > 0 ? (
                        <GenerationTable generations={generations} />
                    ) : (
                        <EmptyState
                            title="No generations yet"
                            description="Create your first AI video script to see it listed here."
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
