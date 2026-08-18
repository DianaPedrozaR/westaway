import { OnboardSidebar } from "@/components/OnboardSidebar";
import { AppSwitcher } from "@/components/AppSwitcher";
import { BrandBackdrop } from "@/components/BrandBackdrop";

export default function OnboardShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-wa-tint">
      <AppSwitcher current="client" />
      <BrandBackdrop />
      <div className="relative z-10 flex">
        <OnboardSidebar />
        <div className="flex-grow flex justify-center px-14 py-14 min-w-0">
          <div className="w-full max-w-4xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
