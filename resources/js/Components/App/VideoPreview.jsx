export default function VideoPreview({ title, scenes = [] }) {
    const activeScene = scenes[0];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/10">
            <div className="relative aspect-video min-h-[260px] bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(16,185,129,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#111827_100%)]" />
                <div className="absolute inset-x-6 top-5 flex items-center justify-between gap-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
                        Storyboard Preview
                    </span>
                    <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                        {activeScene?.duration || '0-30s'}
                    </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        type="button"
                        className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-2xl shadow-cyan-950/30 transition hover:scale-105"
                        aria-label="Play preview"
                    >
                        <span className="ml-1 h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent border-l-cyan-600 transition group-hover:border-l-cyan-700" />
                    </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-6">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                            {activeScene
                                ? `Scene ${activeScene.scene_number}`
                                : 'Scene 1'}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                            {title}
                        </h3>
                        <p className="mt-3 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg">
                            {activeScene?.text_overlay ||
                                'Create. Preview. Publish.'}
                        </p>
                    </div>
                </div>
            </div>

            {scenes.length > 0 && (
                <div className="grid gap-px bg-slate-800 sm:grid-cols-3">
                    {scenes.map((scene) => (
                        <div key={scene.scene_number} className="bg-slate-900 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                                    Scene {scene.scene_number}
                                </p>
                                <p className="text-xs font-semibold text-slate-400">
                                    {scene.duration}
                                </p>
                            </div>
                            <p className="mt-2 max-h-12 overflow-hidden text-sm leading-6 text-slate-200">
                                {scene.visual}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
