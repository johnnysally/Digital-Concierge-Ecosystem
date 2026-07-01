type IconProps = {
  className?: string;
};

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2l1.176 3.529L17 6.5l-2.5 2.073L15.352 12 12 10.147 8.648 12 9.5 8.573 7 6.5l3.824-.971L12 2z" />
      <path d="M4 13.5l3.5-.5L8.2 17 12 14.5l3.8 2.5-.3-4 3.5-.5-3-2.8L20 8" />
    </svg>
  );
}
