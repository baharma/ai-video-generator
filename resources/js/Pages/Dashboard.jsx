import Card from '@/Components/App/Card';
import EmptyState from '@/Components/App/EmptyState';
import GenerationTable from '@/Components/App/GenerationTable';
import PageHeader from '@/Components/App/PageHeader';
import PrimaryButton from '@/Components/App/PrimaryButton';
import SecondaryButton from '@/Components/App/SecondaryButton';
import StatCard from '@/Components/App/StatCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ stats, latestGenerations = [] }) {
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
                                description="Create AI-powered video scripts, storyboards, and Magic Hour video projects from one prompt."
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
                                    Magic Hour workflow
                                </p>
                                <h3 className="mt-3 text-xl font-semibold">
                                    Submit, track, refresh, and save the output.
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    Each generation stores script data, provider
                                    status, usage logs, and event history.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard
                            title="Total Generations"
                            value={stats?.total ?? 0}
                            description="All scripts, storyboards, and video projects."
                        />
                        <StatCard
                            title="Completed"
                            value={stats?.completed ?? 0}
                            description="Generations with completed video output."
                        />
                        <StatCard
                            title="Processing"
                            value={stats?.processing ?? 0}
                            description="Jobs currently in script or video processing."
                        />
                    </div>

                    <section className="space-y-4">
                        <PageHeader
                            title="Latest Generations"
                            description="Recent AI video generation history from your account."
                        />
                        {latestGenerations.length > 0 ? (
                            <GenerationTable generations={latestGenerations} />
                        ) : (
                            <EmptyState
                                title="No generations yet"
                                description="Create your first video project to see it here."
                                action={
                                    <PrimaryButton
                                        as="a"
                                        href={route('generations.create')}
                                    >
                                        Create Video
                                    </PrimaryButton>
                                }
                            />
                        )}
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
