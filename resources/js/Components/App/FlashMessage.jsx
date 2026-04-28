export default function FlashMessage({ children, type = 'info' }) {
    const styles = {
        info: 'border-cyan-200 bg-cyan-50 text-cyan-800',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        warning: 'border-amber-200 bg-amber-50 text-amber-900',
    };

    return (
        <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                styles[type] || styles.info
            }`}
        >
            {children}
        </div>
    );
}
