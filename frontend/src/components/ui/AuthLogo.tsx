import { useBranding } from '../../context/BrandingContext';

type AuthLogoProps = {
    className?: string;
    textClassName?: string;
    size?: 'sm' | 'md' | 'lg';
};

const AuthLogo = ({ className = '', textClassName = '', size = 'md' }: AuthLogoProps) => {
    const { logoUrl, siteName } = useBranding();

    const sizes = {
        sm: { img: 'h-8 w-8', text: 'text-sm' },
        md: { img: 'h-10 w-10', text: 'text-base' },
        lg: { img: 'h-12 w-12', text: 'text-lg' },
    };

    const s = sizes[size];

    return (
        <div className={`inline-flex items-center gap-3 ${className}`}>
            {logoUrl ? (
                <img src={logoUrl} alt={`${siteName} logo`} className={`${s.img} rounded-2xl object-contain shrink-0`} />
            ) : (
                <span className={`flex ${s.img} items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-400 to-sky-500 text-sm font-semibold text-white`}>
                    DS
                </span>
            )}
            <span className={`font-semibold ${s.text} ${textClassName}`}>{siteName}</span>
        </div>
    );
};

export default AuthLogo;