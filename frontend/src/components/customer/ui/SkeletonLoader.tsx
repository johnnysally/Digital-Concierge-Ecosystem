import React from "react";

const SkeletonLoader = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`animate-pulse rounded-2xl bg-slate-800/70 ${className}`}
    style={style}
  />
);

export default SkeletonLoader;
