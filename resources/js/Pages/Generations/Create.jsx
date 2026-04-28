import Card from '@/Components/App/Card';
import FormGroup from '@/Components/App/FormGroup';
import PageHeader from '@/Components/App/PageHeader';
import PrimaryButton from '@/Components/App/PrimaryButton';
import SceneCard from '@/Components/App/SceneCard';
import SecondaryButton from '@/Components/App/SecondaryButton';
import SelectInput from '@/Components/App/SelectInput';
import TextArea from '@/Components/App/TextArea';
import TextInput from '@/Components/App/TextInput';
import VideoPreview from '@/Components/App/VideoPreview';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const videoTypes = [
    'Marketing Video',
    'Educational Clip',
    'Social Media Reel',
    'Product Demo',
    'Explainer Video',
];

const tones = [
    'Formal',
    'Casual',
    'Persuasive',
    'Friendly',
    'Professional',
    'Inspirational',
];

const durations = ['30 seconds', '60 seconds', '90 seconds'];

const dummyResult = {
    title: 'Boost Your Brand with Smart Video Content',
    summary:
        'A short persuasive video concept designed to attract new customers and explain the main product value.',
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

export default function Create() {
    const [form, setForm] = useState({
        video_type: 'Marketing Video',
        topic: '',
        keywords: '',
        target_audience: '',
        tone: 'Persuasive',
        duration: '30 seconds',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleGenerate = (event) => {
        event.preventDefault();
        setLoading(true);
        setResult(null);

        window.setTimeout(() => {
            setResult(dummyResult);
            setLoading(false);
        }, 900);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Video
                </h2>
            }
        >
            <Head title="Create AI Video" />

            <div className="bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Create AI Video"
                        description="Design a video script, storyboard, and scene plan from a simple idea. This screen uses local React state and dummy output only."
                    />

                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                        <Card className="p-6 lg:p-8">
                            <form onSubmit={handleGenerate} className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormGroup label="Video Type">
                                        <SelectInput
                                            value={form.video_type}
                                            onChange={(event) =>
                                                updateField(
                                                    'video_type',
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            {videoTypes.map((videoType) => (
                                                <option
                                                    key={videoType}
                                                    value={videoType}
                                                >
                                                    {videoType}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>

                                    <FormGroup label="Duration">
                                        <SelectInput
                                            value={form.duration}
                                            onChange={(event) =>
                                                updateField(
                                                    'duration',
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            {durations.map((duration) => (
                                                <option
                                                    key={duration}
                                                    value={duration}
                                                >
                                                    {duration}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>
                                </div>

                                <FormGroup label="Topic / Idea">
                                    <TextArea
                                        value={form.topic}
                                        onChange={(event) =>
                                            updateField('topic', event.target.value)
                                        }
                                        placeholder="Example: AI marketing campaign for a small business"
                                    />
                                </FormGroup>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormGroup label="Keywords">
                                        <TextInput
                                            value={form.keywords}
                                            onChange={(event) =>
                                                updateField(
                                                    'keywords',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="AI, brand, content"
                                        />
                                    </FormGroup>

                                    <FormGroup label="Target Audience">
                                        <TextInput
                                            value={form.target_audience}
                                            onChange={(event) =>
                                                updateField(
                                                    'target_audience',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Small business owners"
                                        />
                                    </FormGroup>
                                </div>

                                <FormGroup label="Tone">
                                    <SelectInput
                                        value={form.tone}
                                        onChange={(event) =>
                                            updateField('tone', event.target.value)
                                        }
                                    >
                                        {tones.map((tone) => (
                                            <option key={tone} value={tone}>
                                                {tone}
                                            </option>
                                        ))}
                                    </SelectInput>
                                </FormGroup>

                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <PrimaryButton type="submit" loading={loading}>
                                        Generate
                                    </PrimaryButton>
                                    <SecondaryButton
                                        onClick={() => {
                                            setResult(null);
                                            setForm({
                                                video_type: 'Marketing Video',
                                                topic: '',
                                                keywords: '',
                                                target_audience: '',
                                                tone: 'Persuasive',
                                                duration: '30 seconds',
                                            });
                                        }}
                                    >
                                        Reset
                                    </SecondaryButton>
                                </div>
                            </form>
                        </Card>

                        <Card className="overflow-hidden">
                            <div className="border-b border-slate-200 p-6">
                                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                    Draft Settings
                                </p>
                                <h3 className="mt-2 text-xl font-semibold text-slate-950">
                                    {form.video_type}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Tone: {form.tone} | Duration: {form.duration}
                                </p>
                            </div>
                            <div className="space-y-4 p-6 text-sm leading-6 text-slate-600">
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Topic:
                                    </span>{' '}
                                    {form.topic || 'Waiting for your idea...'}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Keywords:
                                    </span>{' '}
                                    {form.keywords || 'No keywords yet'}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Audience:
                                    </span>{' '}
                                    {form.target_audience ||
                                        'No audience selected yet'}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {result && (
                        <section className="space-y-6">
                            <PageHeader
                                title="Generated Preview"
                                description={result.summary}
                            />

                            <VideoPreview
                                title={result.title}
                                scenes={result.scenes}
                            />

                            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                                <Card className="p-6">
                                    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                        Script
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-slate-950">
                                        {result.title}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-slate-600">
                                        {result.script}
                                    </p>
                                    <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                                        {result.cta}
                                    </div>
                                </Card>

                                <div className="grid gap-4">
                                    {result.scenes.map((scene) => (
                                        <SceneCard key={scene.scene_number} {...scene} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
