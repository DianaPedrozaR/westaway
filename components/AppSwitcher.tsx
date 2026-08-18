import Link from "next/link";
import { Logo } from "./Logo";

const VIEWS = [
  { key: "prospect", label: "Prospect", href: "/intake" },
  { key: "team", label: "Team", href: "/os/dashboard" },
  { key: "client", label: "Client", href: "/onboard" },
] as const;

export const APP_SWITCHER_HEIGHT = "h-10";

export function AppSwitcher({ current }: { current: "prospect" | "team" | "client" }) {
  const currentView = VIEWS.find((v) => v.key === current)!;
  const others = VIEWS.filter((v) => v.key !== current);

  return (
    <div
      className={`sticky top-0 z-50 ${APP_SWITCHER_HEIGHT} flex items-center justify-between px-6 bg-wa-navy text-white text-xs`}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-baseline gap-1 hover:opacity-80">
          <Logo light className="text-sm" />
          <span className="font-bold text-wa-blue">OS</span>
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-medium">{currentView.label} view</span>
      </div>
      <div className="flex items-center gap-4 text-white/70">
        <span className="hidden sm:inline text-white/40">Switch to</span>
        {others.map((v) => (
          <Link key={v.key} href={v.href} className="hover:text-white font-medium">
            {v.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
