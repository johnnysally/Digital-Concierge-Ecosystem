import React from 'react';
import { Link } from 'react-router-dom';

const Error304Page = () => (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 text-center shadow-2xl shadow-black/40 sm:p-10 lg:p-12">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-400 sm:text-sm">Error 304</p>
            <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl md:text-6xl">304</h1>
            <p className="mt-4 text-sm text-slate-300 sm:text-base">
                The requested resource was not modified, but an error occurred while rendering the response.
            </p>
            <p className="mt-4 mx-auto max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                This page is displayed when the system reaches a 304-style error state. Refresh the page or return to the dashboard to continue.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
                <Link
                    to="/"
                    className="inline-flex w-full justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 sm:w-auto sm:px-6 sm:text-base"
                >
                    Go home
                </Link>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex w-full justify-center rounded-full border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 sm:w-auto sm:px-6 sm:text-base"
                >
                    Reload page
                </button>
            </div>
        </div>
    </div>
);

export default Error304Page;
