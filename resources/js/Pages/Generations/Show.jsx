import Card from '@/Components/App/Card';
import DangerButton from '@/Components/App/DangerButton';
import MetadataBadge from '@/Components/App/MetadataBadge';
import PageHeader from '@/Components/App/PageHeader';
import SceneCard from '@/Components/App/SceneCard';
import SecondaryButton from '@/Components/App/SecondaryButton';
import VideoPreview from '@/Components/App/VideoPreview';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const generation = {
    title: 'Boost Your Brand with Smart Video Content',
    summary:
        'A short persuasive video concept designed to attract new customers and explain the main product value.',
    video_type: 'Marketing Video',
    tone: 'Persuasive',
    duration: '30 seconds',
    created_at: '2026-04-28',
    script:
        'Are you struggling to create content that captures attention? With the right message, your brand can stand out, connect with your audience, and turn viewers into customers.',
    scenes: [
        {
            scene_number: 1,
            duration: '0-5s',
            visual: 'A business owner looking at an empty content calendar.',
            voice_over: 'Creating content every day can feel overwhelming.',
            text_overlay: 'Need better content?',
        },
        {
            scene_number: 2,
            duration: '5-15s',
            visual: 'AI-generated ideas appearing on a clean dashboard.',
            voice_over:
                'Our AI helps you turn simple ideas into structured video scripts.',
            text_overlay: 'Generate scripts instantly',
        },
        {
            scene_number: 3,
            duration: '15-30s',
            visual: 'A finished social media video preview with strong call-to-action.',
            voice_over: 'Create clear, engaging, and persuasive videos faster.',
            text_overlay: 'Create. Preview. Publish.',
        },
    ],
    cta: 'Start creating your video script today.',
};

export default function Show() {
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
                                <SecondaryButton>Export Script</SecondaryButton>
                                <DangerButton>Delete</DangerButton>
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
                        <MetadataBadge tone="amber">
                            Created at {generation.created_at}
                        </MetadataBadge>
                    </div>

                    <VideoPreview
                        title={generation.title}
                        scenes={generation.scenes}
                    />

                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="space-y-6">
                            <Card className="p-6">
                                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                    Script
                                </p>
                                <p className="mt-4 text-base leading-8 text-slate-700">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
