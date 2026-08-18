import { TopNav } from "@/components/TopNav";

export default function OnboardShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="flex justify-center px-14 py-14">
        <div className="w-full max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
