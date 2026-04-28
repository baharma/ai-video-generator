import { Link } from '@inertiajs/react';

export default function GuestLayout({
    children,
    title = 'AI Video Generator',
    description = 'Create scripts, storyboards, and scene breakdowns from one clear idea.',
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
                <section className="hidden border-r border-slate-200 bg-white px-10 py-10 lg:flex lg:flex-col lg:justify-between">
                    <div>
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

                        <div className="mt-20 max-w-xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                                Script to storyboard
                            </p>
                            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                                Build better video concepts before production.
                            </h1>
                            <p className="mt-5 text-base leading-8 text-slate-600">
                                Plan persuasive scripts, organize scenes, and
                                preview the structure of every video campaign in
                                one clean dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                    Latest concept
                                </p>
                                <h2 className="mt-3 text-xl font-semibold">
                                    Boost Your Brand with Smart Video Content
                                </h2>
                            </div>
                            <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                                30s
                            </span>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {['Hook', 'AI ideas', 'CTA'].map((item, index) => (
                                <div
                                    key={item}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                                >
                                    <p className="text-xs font-semibold text-slate-400">
                                        Scene {index + 1}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-slate-100">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <main className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-12">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-8 lg:hidden">
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
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                                    {title}
                                </h1>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {description}
                                </p>
                            </div>

                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
