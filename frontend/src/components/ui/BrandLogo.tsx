import { useBranding } from '../../context/BrandingContext';

type BrandLogoProps = {
    className?: string;
};

const BrandLogo = ({ className = '' }: BrandLogoProps) => {
    const { logoUrl, siteName } = useBranding();

    return (
        <div className={`flex min-w-0 items-center gap-3 ${className}`}>
            {logoUrl ? (
                <img src={logoUrl} alt={`${siteName} logo`} className="h-11 w-11 shrink-0 rounded-2xl object-contain" />
            ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300 text-sm font-semibold text-white shadow-sm">
                    DS
                </div>
            )}
            <p className="truncate text-sm font-semibold">{siteName}</p>
        </div>
    );
};

export default BrandLogo;