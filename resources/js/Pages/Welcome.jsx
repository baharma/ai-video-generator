import { Head, Link } from '@inertiajs/react';

const features = [
    {
        title: 'Script Generator',
        description:
            'Turn a simple topic into a focused script with a strong hook, body, and call to action.',
    },
    {
        title: 'Storyboard Preview',
        description:
            'Review each scene visually before moving into recording, editing, or publishing.',
    },
    {
        title: 'Scene Breakdown',
        description:
            'Get duration, visual direction, voice over, and text overlay in one structured output.',
    },
];

const scenes = [
    {
        number: 1,
        duration: '0-5s',
        title: 'Hook',
        text: 'Need better content?',
    },
    {
        number: 2,
        duration: '5-15s',
        title: 'AI Ideas',
        text: 'Generate scripts instantly',
    },
    {
        number: 3,
        duration: '15-30s',
        title: 'CTA',
        text: 'Create. Preview. Publish.',
    },
];

export default function Welcome({ auth }) {
    const user = auth?.user;

    return (
        <>
            <Head title="AI Video Generator" />

            <main className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950">
                                <span className="text-sm font-bold text-cyan-300">
                                    AI
                                </span>
                            </span>
                            <span className="text-base font-semibold text-slate-950">
                                AI Video Generator
                            </span>
                        </Link>

                        <nav className="flex items-center gap-2">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="hidden rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
                    <div className="flex flex-col justify-center">
                        <span className="w-fit rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 ring-1 ring-cyan-100">
                            AI script, storyboard, and scene planning
                        </span>

                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Create video concepts from one clear idea.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            Generate persuasive video scripts, storyboard-ready
                            scenes, voice over direction, and text overlays in a
                            clean production dashboard.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route('generations.create')}
                                className="inline-flex justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                                Create Video
                            </Link>
                            <Link
                                href={route('dashboard')}
                                className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                            >
                                View Dashboard
                            </Link>
                        </div>

                        <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                            <div>
                                <p className="text-2xl font-semibold text-slate-950">
                                    12
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Generations
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-slate-950">
                                    5
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    This month
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-slate-950">
                                    9
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Saved scripts
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10 sm:p-5">
                            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                                <div className="relative aspect-video min-h-[280px] bg-slate-950">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,0.25),transparent_28%),radial-gradient(circle_at_76%_26%,rgba(16,185,129,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]" />

                                    <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
                                        Storyboard Preview
                                    </div>

                                    <div className="absolute right-5 top-5 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                                        30 seconds
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-950 shadow-2xl shadow-cyan-950/30">
                                            <span className="ml-1 h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent border-l-cyan-600" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent p-6">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                            Marketing Video
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-white">
                                            Boost Your Brand with Smart Video
                                            Content
                                        </h2>
                                        <p className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                                            Create. Preview. Publish.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-px bg-slate-800 sm:grid-cols-3">
                                    {scenes.map((scene) => (
                                        <div
                                            key={scene.number}
                                            className="bg-slate-900 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                                    Scene {scene.number}
                                                </p>
                                                <p className="text-xs font-semibold text-slate-400">
                                                    {scene.duration}
                                                </p>
                                            </div>
                                            <h3 className="mt-3 font-semibold text-white">
                                                {scene.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-300">
                                                {scene.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold text-slate-500">
                                    Tone
                                </p>
                                <p className="mt-2 text-lg font-semibold text-slate-950">
                                    Persuasive
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold text-slate-500">
                                    Output
                                </p>
                                <p className="mt-2 text-lg font-semibold text-slate-950">
                                    Script + 3 scenes
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-slate-200 bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                Production workflow
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                                Everything needed before editing starts.
                            </h2>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {features.map((feature) => (
                                <article
                                    key={feature.title}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-100">
                                        AI
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-950">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {feature.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10 sm:p-8 lg:flex lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                                Try the preview
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold">
                                Start with dummy data and explore the UI.
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                The current version is frontend-only, so you can
                                review the product flow before adding real AI
                                generation and saved history.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
                            <Link
                                href={route('generations.create')}
                                className="inline-flex justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Open Create Page
                            </Link>
                            <Link
                                href={route('generations.index')}
                                className="inline-flex justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                            >
                                View History
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
