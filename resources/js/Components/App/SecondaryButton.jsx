export default function SecondaryButton({
    children,
    className = '',
    type = 'button',
    as: Component = 'button',
    disabled = false,
    ...props
}) {
    const buttonProps =
        Component === 'button'
            ? { type, disabled }
            : { 'aria-disabled': disabled };

    return (
        <Component
            {...props}
            {...buttonProps}
            className={`inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                disabled ? 'pointer-events-none opacity-70' : ''
            } ${className}`}
        >
            {children}
        </Component>
    );
}
