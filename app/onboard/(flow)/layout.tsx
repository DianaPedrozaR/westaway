import { OnboardSidebar } from "@/components/OnboardSidebar";
import { AppSwitcher } from "@/components/AppSwitcher";
import { BrandBackdrop } from "@/components/BrandBackdrop";
import { Stepper } from "@/components/Stepper";

export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-wa-tint">
      <AppSwitcher current="client" />
      <BrandBackdrop />
      <div className="relative z-10 flex">
        <OnboardSidebar showSaveExit />
        <div className="flex-grow min-w-0">
          <Stepper />
          <div className="flex justify-center px-14 pb-16">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-wa-hair p-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
