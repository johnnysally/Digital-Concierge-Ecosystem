import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

type StatusErrorPageProps = {
    statusCode?: number | string;
};

const resolveStatusCode = (value?: number | string) => {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 404;
    }

    return 404;
};

const getStatusDetails = (statusCode: number) => {
    switch (statusCode) {
        case 304:
            return {
                label: 'Error 304',
                title: 'Content not modified',
                message: 'The requested resource did not change, so the system could not render a fresh response.',
                details: 'Refresh the page or head back to your Digital Safaris workspace to continue.',
            };
        case 500:
            return {
                label: 'Error 500',
                title: 'Server error',
                message: 'Something went wrong on our side while trying to fulfill your request.',
                details: 'Please retry in a moment or return to the Digital Safaris dashboard.',
            };
        case 404:
        default:
            return {
                label: 'Error 404',
                title: 'Page not found',
                message: 'The page you are looking for may have moved, been removed, or never existed.',
                details: 'Double-check the link or return to Digital Safaris to continue safely.',
            };
    }
};

const getHomePath = (pathname: string) => {
    if (pathname.startsWith('/accommodation') || pathname.startsWith('/AccommodationPartner')) {
        return '/accommodation';
    }

    if (pathname.startsWith('/restaurant-admin')) {
        return '/restaurant-admin';
    }

    if (pathname.startsWith('/TransportPartner')) {
        return '/TransportPartner';
    }

    return '/';
};

const StatusErrorPage = ({ statusCode }: StatusErrorPageProps) => {
    const params = useParams<{ statusCode?: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const resolvedCode = resolveStatusCode(statusCode ?? params.statusCode);
    const { label, title, message, details } = getStatusDetails(resolvedCode);
    const homePath = getHomePath(location.pathname);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 lg:flex-row">
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-12">
                    <div className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-300 sm:text-xs">
                        Digital Safaris
                    </div>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400 sm:text-base">
                        {label}
                    </p>
                    <h1 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                        {resolvedCode}
                    </h1>
                    <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                        {title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                        {message}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        {details}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={homePath}
                            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                            Back to Digital Safaris
                        </Link>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                        >
                            Go back
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-500/12 via-slate-900/80 to-slate-950 p-6 sm:p-8 lg:p-10">
                    <div className="w-full max-w-md rounded-[24px] border border-emerald-400/20 bg-slate-900/75 p-6 shadow-lg shadow-emerald-950/30">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-xl text-emerald-300">
                                ✦
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
                                    Need help?
                                </p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                    {title}
                                </p>
                            </div>
                        </div>

                        <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
                            <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                Check the URL or link you followed.
                            </li>
                            <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                Return to the Digital Safaris dashboard to continue.
                            </li>
                            <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                If the issue continues, contact support for assistance.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusErrorPage;
