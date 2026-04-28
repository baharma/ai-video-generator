export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={[
                'inline-flex items-center rounded-xl border border-transparent bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-cyan-700 focus:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 active:bg-cyan-800',
                disabled ? 'cursor-not-allowed opacity-60' : '',
                className,
            ].join(' ')}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
