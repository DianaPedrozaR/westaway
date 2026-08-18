import { Sidebar } from "@/components/Sidebar";
import { AppSwitcher } from "@/components/AppSwitcher";
import { BrandBackdrop } from "@/components/BrandBackdrop";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-wa-tint">
      <AppSwitcher current="team" />
      <BrandBackdrop />
      <div className="relative z-10 flex">
        <Sidebar />
        <div className="flex-grow px-12 py-10 min-w-0">{children}</div>
      </div>
    </div>
  );
}
