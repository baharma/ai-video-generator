import Card from '@/Components/App/Card';
import FormGroup from '@/Components/App/FormGroup';
import PageHeader from '@/Components/App/PageHeader';
import PrimaryButton from '@/Components/App/PrimaryButton';
import SecondaryButton from '@/Components/App/SecondaryButton';
import SelectInput from '@/Components/App/SelectInput';
import TextArea from '@/Components/App/TextArea';
import TextInput from '@/Components/App/TextInput';
import Checkbox from '@/Components/Checkbox';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ options = {}, defaults = {} }) {
    const initialData = {
        video_type: defaults.video_type || 'Marketing Video',
        topic: '',
        keywords: '',
        target_audience: '',
        tone: defaults.tone || 'Persuasive',
        duration: defaults.duration || '30',
        prompt: '',
        name: '',
        model: defaults.model || 'ltx-2',
        resolution: defaults.resolution || '720p',
        aspect_ratio: defaults.aspect_ratio || '16:9',
        submit_video: defaults.submit_video ?? true,
        audio: defaults.audio ?? false,
    };

    const { data, setData, post, processing, errors, reset } = useForm(initialData);

    const handleGenerate = (event) => {
        event.preventDefault();
        post(route('generations.store'));
    };

    const resetForm = () => {
        reset();
        setData(initialData);
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
                        description="Save the user input, generate a script and storyboard, then submit a text-to-video job to Magic Hour."
                    />

                    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                        <Card className="p-6 lg:p-8">
                            <form onSubmit={handleGenerate} className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormGroup
                                        label="Video Type"
                                        error={errors.video_type}
                                    >
                                        <SelectInput
                                            value={data.video_type}
                                            onChange={(event) =>
                                                setData('video_type', event.target.value)
                                            }
                                        >
                                            {(options.videoTypes || []).map((videoType) => (
                                                <option
                                                    key={videoType}
                                                    value={videoType}
                                                >
                                                    {videoType}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>

                                    <FormGroup
                                        label="Duration"
                                        error={errors.duration}
                                    >
                                        <SelectInput
                                            value={data.duration}
                                            onChange={(event) =>
                                                setData('duration', event.target.value)
                                            }
                                        >
                                            {(options.durations || []).map((duration) => (
                                                <option
                                                    key={duration.value}
                                                    value={duration.value}
                                                >
                                                    {duration.label}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>
                                </div>

                                <FormGroup label="Topic / Idea" error={errors.topic}>
                                    <TextArea
                                        value={data.topic}
                                        onChange={(event) =>
                                            setData('topic', event.target.value)
                                        }
                                        placeholder="Example: AI marketing campaign for a small business"
                                    />
                                </FormGroup>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormGroup label="Keywords" error={errors.keywords}>
                                        <TextInput
                                            value={data.keywords}
                                            onChange={(event) =>
                                                setData('keywords', event.target.value)
                                            }
                                            placeholder="AI, brand, content"
                                        />
                                    </FormGroup>

                                    <FormGroup
                                        label="Target Audience"
                                        error={errors.target_audience}
                                    >
                                        <TextInput
                                            value={data.target_audience}
                                            onChange={(event) =>
                                                setData(
                                                    'target_audience',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Small business owners"
                                        />
                                    </FormGroup>
                                </div>

                                <FormGroup label="Tone" error={errors.tone}>
                                    <SelectInput
                                        value={data.tone}
                                        onChange={(event) =>
                                            setData('tone', event.target.value)
                                        }
                                    >
                                        {(options.tones || []).map((tone) => (
                                            <option key={tone} value={tone}>
                                                {tone}
                                            </option>
                                        ))}
                                    </SelectInput>
                                </FormGroup>

                                <FormGroup
                                    label="Custom Magic Hour Prompt"
                                    error={errors.prompt}
                                >
                                    <TextArea
                                        rows={5}
                                        value={data.prompt}
                                        onChange={(event) =>
                                            setData('prompt', event.target.value)
                                        }
                                        placeholder="Optional. Leave blank to build a prompt from the generated script and storyboard."
                                    />
                                </FormGroup>

                                <div className="grid gap-5 sm:grid-cols-3">
                                    <FormGroup label="Model" error={errors.model}>
                                        <SelectInput
                                            value={data.model}
                                            onChange={(event) =>
                                                setData('model', event.target.value)
                                            }
                                        >
                                            {(options.models || []).map((model) => (
                                                <option
                                                    key={model.value}
                                                    value={model.value}
                                                >
                                                    {model.label}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>

                                    <FormGroup
                                        label="Resolution"
                                        error={errors.resolution}
                                    >
                                        <SelectInput
                                            value={data.resolution}
                                            onChange={(event) =>
                                                setData('resolution', event.target.value)
                                            }
                                        >
                                            {(options.resolutions || []).map((resolution) => (
                                                <option
                                                    key={resolution}
                                                    value={resolution}
                                                >
                                                    {resolution}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>

                                    <FormGroup
                                        label="Aspect Ratio"
                                        error={errors.aspect_ratio}
                                    >
                                        <SelectInput
                                            value={data.aspect_ratio}
                                            onChange={(event) =>
                                                setData('aspect_ratio', event.target.value)
                                            }
                                        >
                                            {(options.aspectRatios || []).map((ratio) => (
                                                <option
                                                    key={ratio.value}
                                                    value={ratio.value}
                                                >
                                                    {ratio.label}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </FormGroup>
                                </div>

                                <FormGroup
                                    label="Magic Hour Project Name"
                                    error={errors.name}
                                >
                                    <TextInput
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="Optional custom project name"
                                    />
                                </FormGroup>

                                <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <label className="flex items-start gap-3 text-sm text-slate-700">
                                        <Checkbox
                                            checked={data.submit_video}
                                            onChange={(event) =>
                                                setData(
                                                    'submit_video',
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        <span>
                                            Submit to Magic Hour after saving the
                                            script and storyboard.
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-3 text-sm text-slate-700">
                                        <Checkbox
                                            checked={data.audio}
                                            onChange={(event) =>
                                                setData('audio', event.target.checked)
                                            }
                                            disabled={!data.submit_video}
                                        />
                                        <span>Request audio when the selected model supports it.</span>
                                    </label>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <PrimaryButton type="submit" loading={processing}>
                                        Generate
                                    </PrimaryButton>
                                    <SecondaryButton onClick={resetForm}>
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
                                    {data.video_type}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Tone: {data.tone} | Duration: {data.duration} seconds
                                </p>
                            </div>
                            <div className="space-y-4 p-6 text-sm leading-6 text-slate-600">
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Topic:
                                    </span>{' '}
                                    {data.topic || 'Waiting for your idea...'}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Keywords:
                                    </span>{' '}
                                    {data.keywords || 'No keywords yet'}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Audience:
                                    </span>{' '}
                                    {data.target_audience ||
                                        'No audience selected yet'}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-900">
                                        Provider:
                                    </span>{' '}
                                    {data.submit_video
                                        ? `Magic Hour ${data.model} / ${data.resolution} / ${data.aspect_ratio}`
                                        : 'Script and storyboard only'}
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
