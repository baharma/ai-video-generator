import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/App/Card';
import GenerationTable from '@/Components/App/GenerationTable';
import PageHeader from '@/Components/App/PageHeader';
import PrimaryButton from '@/Components/App/PrimaryButton';
import SecondaryButton from '@/Components/App/SecondaryButton';
import StatCard from '@/Components/App/StatCard';
import { Head, usePage } from '@inertiajs/react';

const latestGenerations = [
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

export default function Dashboard() {
    const user = usePage().props.auth?.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <Card className="overflow-hidden">
                        <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_0.6fr] lg:p-8">
                            <PageHeader
                                title={`Welcome back, ${user?.name || 'Guest'}`}
                                description="Create AI-powered video scripts, storyboards, and scene breakdowns in seconds."
                                action={
                                    <div className="flex flex-wrap gap-3">
                                        <PrimaryButton
                                            as="a"
                                            href={route('generations.create')}
                                        >
                                            Create Video
                                        </PrimaryButton>
                                        <SecondaryButton
                                            as="a"
                                            href={route('generations.index')}
                                        >
                                            View History
                                        </SecondaryButton>
                                    </div>
                                }
                            />

                            <div className="rounded-2xl bg-slate-950 p-5 text-white">
                                <p className="text-sm font-medium text-cyan-200">
                                    Next generation
                                </p>
                                <h3 className="mt-3 text-xl font-semibold">
                                    Turn one idea into a structured video plan.
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    Draft the concept, organize the scenes, and
                                    preview the story flow before production.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard
                            title="Total Generations"
                            value="12"
                            description="Scripts and storyboards created so far."
                        />
                        <StatCard
                            title="This Month"
                            value="5"
                            description="New AI video concepts drafted in April."
                        />
                        <StatCard
                            title="Saved Scripts"
                            value="9"
                            description="Reusable scripts kept for export later."
                        />
                    </div>

                    <section className="space-y-4">
                        <PageHeader
                            title="Latest Generations"
                            description="Recent dummy video concepts from your workspace."
                        />
                        <GenerationTable generations={latestGenerations} />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
