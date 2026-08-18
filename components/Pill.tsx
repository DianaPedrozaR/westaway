type PillTone = "muted" | "outline" | "filled" | "closed" | "success" | "danger";

const toneClasses: Record<PillTone, string> = {
  muted: "bg-wa-tint text-wa-navy border border-wa-hair",
  outline: "bg-white text-wa-navy border-[1.5px] border-wa-navy",
  filled: "bg-wa-blue text-white",
  closed: "bg-wa-tint text-wa-dis border border-wa-hair",
  success: "bg-wa-green-light text-wa-green border border-wa-green/20",
  danger: "bg-wa-red-light text-wa-red border border-wa-red/20",
};

export function Pill({
  tone,
  children,
  className = "",
}: {
  tone: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-full ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
