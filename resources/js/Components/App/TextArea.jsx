import { forwardRef } from 'react';

export default forwardRef(function TextArea(
    { className = '', rows = 4, ...props },
    ref,
) {
    return (
        <textarea
            {...props}
            rows={rows}
            ref={ref}
            className={`w-full rounded-xl border-slate-200 bg-white text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500 ${className}`}
        />
    );
});
