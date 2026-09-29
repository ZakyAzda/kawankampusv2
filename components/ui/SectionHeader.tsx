import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-sans font-bold text-[18px] md:text-[20px] text-on-surface tracking-tight truncate">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="font-sans text-[13px] text-secondary mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
