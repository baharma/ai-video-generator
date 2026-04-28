export default function FormGroup({ label, error, children }) {
    return (
        <div>
            {label && (
                <label className="mb-2 block text-sm font-medium text-slate-800">
                    {label}
                </label>
            )}
            {children}
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </div>
    );
}
