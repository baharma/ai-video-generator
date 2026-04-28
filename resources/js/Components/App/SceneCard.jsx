export default function SceneCard({
    scene_number,
    duration,
    visual,
    voice_over,
    text_overlay,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                        Scene {scene_number}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-950">
                        {visual}
                    </h3>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {duration}
                </span>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-6">
                <div>
                    <p className="font-semibold text-slate-800">Voice over</p>
                    <p className="mt-1 text-slate-600">{voice_over}</p>
                </div>
                <div>
                    <p className="font-semibold text-slate-800">Text overlay</p>
                    <p className="mt-1 text-slate-600">{text_overlay}</p>
                </div>
            </div>
        </div>
    );
}
