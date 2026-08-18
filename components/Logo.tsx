export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={`font-bold uppercase tracking-widest ${light ? "text-white" : "text-wa-navy"} ${className}`}
    >
      Westaway
    </span>
  );
}
