export function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-wa-hair p-6 shadow-sm hover:shadow-md">
      <div className="text-xs uppercase tracking-wide text-wa-meta font-medium">{label}</div>
      <div className="text-5xl text-wa-navy font-semibold mt-3">{value}</div>
      <div className="absolute top-5 right-5 w-11 h-11 rounded-xl bg-wa-blue-light flex items-center justify-center text-wa-blue">
        {icon}
      </div>
    </div>
  );
}
