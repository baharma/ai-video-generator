import { forwardRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', children, ...props },
    ref,
) {
    return (
        <select
            {...props}
            ref={ref}
            className={`w-full rounded-xl border-slate-200 bg-white text-sm text-slate-900 shadow-sm transition focus:border-cyan-500 focus:ring-cyan-500 ${className}`}
        >
            {children}
        </select>
    );
});
