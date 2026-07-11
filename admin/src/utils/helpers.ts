export const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

export const truncate = (str: string, length: number) => str.length > length ? str.slice(0, length) + '...' : str;

export const getInitials = (firstName: string, lastName: string) => `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();