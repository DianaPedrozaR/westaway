import { Sidebar } from "@/components/Sidebar";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-wa-tint">
      <Sidebar />
      <div className="flex-grow px-12 py-10 min-w-0">{children}</div>
    </div>
  );
}
