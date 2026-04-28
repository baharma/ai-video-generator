export default function DangerButton({
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
            className={`inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                disabled ? 'pointer-events-none opacity-70' : ''
            } ${className}`}
        >
            {children}
        </Component>
    );
}
