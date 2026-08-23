import { useNavigate } from 'react-router-dom';

const partnerTypes = [
    {
        id: 'accommodation',
        title: 'Accommodation',
        description: 'Hotels, BnBs, apartments, lodges, guest houses, and vacation homes.',
        icon: '🏨',
        adminPath: '/accommodation-admin',
        registerPath: '/accommodation-admin',
        sessionKey: 'digitalsafaris_accommodation',
    },
    {
        id: 'restaurant',
        title: 'Restaurant',
        description: 'Restaurants, cafes, food businesses, and delivery kitchens.',
        icon: '🍽️',
        adminPath: '/restaurant-admin',
        registerPath: '/restaurant-admin',
        sessionKey: 'digitalsafaris_restaurant',
    },
    {
        id: 'transport',
        title: 'Transport',
        description: 'Taxi services, shuttles, buses, and transport providers.',
        icon: '🚗',
        adminPath: '/transport-admin',
        registerPath: '/transport-admin',
        sessionKey: 'digitalsafaris_transport',
    },
];

const PartnerLandingPage = () => {
    const navigate = useNavigate();

    const handlePartnerSelect = (type: (typeof partnerTypes)[0]) => {
        try {
            const session = localStorage.getItem(type.sessionKey);
            if (session) {
                const parsed = JSON.parse(session);
                if (parsed?.token) {
                    navigate(type.adminPath);
                    return;
                }
            }
        } catch {
            // No valid session
        }
        navigate(type.registerPath);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'radial-gradient(circle at top left, rgba(16,185,129,0.2), transparent 40%), radial-gradient(circle at bottom right, rgba(59,130,246,0.15), transparent 40%), #020617' }}>
            <div className="max-w-4xl w-full text-center">
                <div className="mb-6">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-2xl font-bold text-slate-950">DS</div>
                </div>
                <p className="text-emerald-400 font-semibold uppercase tracking-[0.3em] text-sm mb-4">DigitalSafari</p>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Grow your business<br />
                    <span className="text-emerald-400">with DigitalSafari</span>
                </h1>
                <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
                    Join a connected platform designed for travel and hospitality businesses. Reach more customers and manage everything digitally.
                </p>

                <div className="mt-14">
                    <h3 className="text-2xl font-bold text-white mb-8">Choose your business type</h3>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {partnerTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handlePartnerSelect(type)}
                                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-left hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="text-5xl mb-4">{type.icon}</div>
                                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition">{type.title}</h4>
                                <p className="text-sm text-slate-400 mb-6">{type.description}</p>
                                <span className="text-emerald-400 text-sm font-semibold group-hover:translate-x-1 transition inline-block">
                                    Launch →
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-4 max-w-3xl mx-auto">
                    {[
                        { step: '01', title: 'Choose type', description: 'Select your business category.' },
                        { step: '02', title: 'Register', description: 'Complete the partner registration form.' },
                        { step: '03', title: 'Get approved', description: 'Our team reviews and approves your account.' },
                        { step: '04', title: 'Go live', description: 'Start receiving customers.' },
                    ].map((s) => (
                        <div key={s.step} className="text-center">
                            <div className="text-3xl font-bold text-emerald-400 mb-3">{s.step}</div>
                            <h5 className="font-semibold text-white mb-1">{s.title}</h5>
                            <p className="text-xs text-slate-400">{s.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PartnerLandingPage;