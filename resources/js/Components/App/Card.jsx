export default function Card({
    children,
    className = '',
    as: Component = 'div',
    ...props
}) {
    return (
        <Component
            className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
