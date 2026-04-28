import Card from '@/Components/App/Card';
import DangerButton from '@/Components/App/DangerButton';
import MetadataBadge from '@/Components/App/MetadataBadge';
import PageHeader from '@/Components/App/PageHeader';
import SceneCard from '@/Components/App/SceneCard';
import SecondaryButton from '@/Components/App/SecondaryButton';
import VideoPreview from '@/Components/App/VideoPreview';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Show({
    generation,
    usageLogs = [],
    events = [],
}) {
    const pollingRequestInFlight = useRef(false);
    const [pollingEnabled, setPollingEnabled] = useState(true);

    const isProviderPending =
        generation.has_provider_project &&
        ['video_submitted', 'video_processing'].includes(generation.status) &&
        !['complete', 'completed', 'failed', 'error', 'canceled'].includes(
            generation.provider_status,
        );
    const shouldPollProvider = pollingEnabled && isProviderPending;

    const refreshProject = () => {
        if (pollingRequestInFlight.current) {
            return;
        }

        pollingRequestInFlight.current = true;

        router.post(route('generations.refresh', generation.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                pollingRequestInFlight.current = false;
            },
        });
    };

    useEffect(() => {
        if (!shouldPollProvider) {
            return undefined;
        }

        const interval = window.setInterval(refreshProject, 5000);

        return () => window.clearInterval(interval);
    }, [
        shouldPollProvider,
        generation.id,
        generation.status,
        generation.provider_status,
    ]);

    const destroyGeneration = () => {
        if (!window.confirm(`Delete "${generation.title}"?`)) {
            return;
        }

        router.delete(route('generations.destroy', generation.id));
    };

    const statusTone = (status) => {
        if (status === 'completed') return 'emerald';
        if (status === 'failed') return 'amber';
        if (status === 'video_processing' || status === 'video_submitted') {
            return 'violet';
        }

        return 'default';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Generation Detail
                </h2>
            }
        >
            <Head title={generation.title} />

            <div className="bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title={generation.title}
                        description={generation.summary}
                        action={
                            <div className="flex flex-wrap gap-3">
                                <SecondaryButton
                                    as="a"
                                    href={route('generations.index')}
                                >
                                    Back to History
                                </SecondaryButton>
                                {generation.has_provider_project && (
                                    <SecondaryButton onClick={refreshProject}>
                                        Refresh Status
                                    </SecondaryButton>
                                )}
                                <SecondaryButton
                                    as="a"
                                    href={route('generations.export', generation.id)}
                                >
                                    Export Script
                                </SecondaryButton>
                                <DangerButton onClick={destroyGeneration}>
                                    Delete
                                </DangerButton>
                            </div>
                        }
                    />

                    <div className="flex flex-wrap gap-2">
                        <MetadataBadge tone="cyan">
                            {generation.video_type}
                        </MetadataBadge>
                        <MetadataBadge tone="violet">
                            {generation.tone}
                        </MetadataBadge>
                        <MetadataBadge tone="emerald">
                            {generation.duration}
                        </MetadataBadge>
                        <MetadataBadge tone={statusTone(generation.status)}>
                            {generation.status}
                        </MetadataBadge>
                        {generation.provider_status && (
                            <MetadataBadge tone="amber">
                                Provider: {generation.provider_status}
                            </MetadataBadge>
                        )}
                        {shouldPollProvider && (
                            <MetadataBadge tone="violet">
                                Auto refresh every 5s
                            </MetadataBadge>
                        )}
                        <MetadataBadge>
                            Created at {generation.created_at}
                        </MetadataBadge>
                    </div>

                    {isProviderPending && (
                        <Card className="border-cyan-200 bg-cyan-50 p-5 text-sm text-cyan-900">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`h-3 w-3 rounded-full bg-cyan-600 ${
                                            pollingEnabled ? 'animate-pulse' : ''
                                        }`}
                                    />
                                    <p>
                                        Magic Hour status is{' '}
                                        <span className="font-semibold">
                                            {generation.provider_status || 'queued'}
                                        </span>
                                        .{' '}
                                        {pollingEnabled
                                            ? 'Checking again every 5 seconds until it becomes complete.'
                                            : 'Auto refresh is paused.'}
                                    </p>
                                </div>
                                <SecondaryButton
                                    onClick={() =>
                                        setPollingEnabled((enabled) => !enabled)
                                    }
                                    className="border-cyan-200 bg-white"
                                >
                                    {pollingEnabled
                                        ? 'Pause Auto Refresh'
                                        : 'Resume Auto Refresh'}
                                </SecondaryButton>
                            </div>
                        </Card>
                    )}

                    {generation.error_message && (
                        <Card className="border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
                            {generation.error_message}
                        </Card>
                    )}

                    {generation.video_url ? (
                        <Card className="overflow-hidden">
                            <video
                                className="aspect-video w-full bg-slate-950"
                                src={generation.video_url}
                                controls
                            />
                            <div className="grid gap-3 border-t border-slate-200 p-5 text-sm text-slate-600 md:grid-cols-3">
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Project:
                                    </span>{' '}
                                    {generation.provider_project_name ||
                                        generation.provider_project_id}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Size:
                                    </span>{' '}
                                    {generation.width && generation.height
                                        ? `${generation.width}x${generation.height}`
                                        : '-'}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        URL expires:
                                    </span>{' '}
                                    {generation.video_url_expires_at || '-'}
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <VideoPreview
                            title={generation.title}
                            scenes={generation.scenes}
                        />
                    )}

                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="space-y-6">
                            <Card className="p-6">
                                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                    Script
                                </p>
                                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                                    {generation.script}
                                </p>
                            </Card>

                            <Card className="bg-slate-950 p-6 text-white">
                                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                                    Call to Action
                                </p>
                                <h3 className="mt-3 text-2xl font-semibold">
                                    {generation.cta}
                                </h3>
                                <p className="mt-4 text-sm leading-6 text-slate-300">
                                    Use this closing message at the end of the
                                    video or adapt it for a social caption.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                    Magic Hour
                                </p>
                                <dl className="mt-4 grid gap-3 text-sm text-slate-600">
                                    <div>
                                        <dt className="font-semibold text-slate-900">
                                            Project ID
                                        </dt>
                                        <dd>{generation.provider_project_id || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-900">
                                            Credits Charged
                                        </dt>
                                        <dd>{generation.credits_charged ?? '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-900">
                                            Frame Cost
                                        </dt>
                                        <dd>
                                            {generation.total_frame_cost ??
                                                generation.estimated_frame_cost ??
                                                '-'}
                                        </dd>
                                    </div>
                                </dl>
                            </Card>
                        </div>

                        <section className="space-y-4">
                            <PageHeader
                                title="Scene Breakdown"
                                description="Storyboard-ready visual direction, voice over, and text overlay for each section."
                            />
                            <div className="grid gap-4">
                                {generation.scenes.map((scene) => (
                                    <SceneCard key={scene.scene_number} {...scene} />
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="p-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                Lifecycle Events
                            </p>
                            <div className="mt-4 divide-y divide-slate-100">
                                {events.map((event) => (
                                    <div key={event.id} className="py-3 text-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <p className="font-semibold text-slate-900">
                                                {event.event_type}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {event.created_at}
                                            </p>
                                        </div>
                                        {(event.from_status || event.to_status) && (
                                            <p className="mt-1 text-slate-600">
                                                {event.from_status || '-'} to{' '}
                                                {event.to_status || '-'}
                                            </p>
                                        )}
                                        {event.message && (
                                            <p className="mt-1 text-rose-700">
                                                {event.message}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                API Usage Logs
                            </p>
                            <div className="mt-4 divide-y divide-slate-100">
                                {usageLogs.map((log) => (
                                    <div key={log.id} className="py-3 text-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <p className="font-semibold text-slate-900">
                                                {log.provider} / {log.action}
                                            </p>
                                            <MetadataBadge
                                                tone={
                                                    log.success
                                                        ? 'emerald'
                                                        : 'amber'
                                                }
                                            >
                                                {log.http_status || 'no status'}
                                            </MetadataBadge>
                                        </div>
                                        <p className="mt-1 text-slate-600">
                                            {log.duration_ms ?? 0}ms
                                            {log.credits_charged
                                                ? ` | ${log.credits_charged} credits`
                                                : ''}
                                        </p>
                                        {log.error_message && (
                                            <p className="mt-1 text-rose-700">
                                                {log.error_message}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
