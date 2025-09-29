export function FilterIcon({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <rect x="12" y="16" width="40" height="8" rx="4" fill="#1a2540" />
      <rect x="20" y="28" width="24" height="8" rx="4" fill="#1a2540" />
      <rect x="28" y="40" width="8" height="8" rx="4" fill="#1a2540" />
    </svg>
  );
}
