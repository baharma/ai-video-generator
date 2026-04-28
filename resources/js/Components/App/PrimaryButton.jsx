export default function PrimaryButton({
    children,
    loading = false,
    className = '',
    disabled,
    type = 'button',
    as: Component = 'button',
    ...props
}) {
    const isDisabled = disabled || loading;
    const buttonProps =
        Component === 'button'
            ? { type, disabled: isDisabled }
            : { 'aria-disabled': isDisabled };

    return (
        <Component
            {...props}
            {...buttonProps}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                isDisabled ? 'pointer-events-none opacity-70' : ''
            } ${className}`}
        >
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {children}
        </Component>
    );
}
