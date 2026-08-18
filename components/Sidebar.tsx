"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  DocIcon,
  WaveformIcon,
  EnvelopeIcon,
  ColumnsIcon,
} from "./icons";

const NAV_ITEMS = [
  { href: "/os/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/os/pre-brief", label: "Deal Pre-Brief", Icon: DocIcon },
  { href: "/os/meetings", label: "Meeting Intelligence", Icon: WaveformIcon },
  { href: "/os/email-triage", label: "Email Triage", Icon: EnvelopeIcon },
  { href: "/os/pipeline", label: "Deals Pipeline", Icon: ColumnsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 min-w-72 self-start sticky top-0 h-screen bg-wa-navy flex flex-col py-8 overflow-y-auto">
      <div className="px-8 pb-10">
        <Image
          src="/westaway-logo.png"
          alt="Westaway"
          width={200}
          height={50}
          className="h-9 w-auto invert brightness-0"
        />
      </div>
      <nav className="flex flex-col gap-1 flex-grow px-4">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3.5 px-4 py-3 text-[15px] rounded-xl ${
                active
                  ? "text-white bg-white/10 shadow-sm"
                  : "text-[#B7C2ED] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={active ? "text-wa-blue" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3 px-8 pt-5 mt-5 border-t border-white/10">
        <div className="w-10 h-10 rounded-full bg-wa-blue text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
          KW
        </div>
        <div>
          <div className="text-white text-[15px]">Kyle Westaway</div>
          <div className="text-[#93A0CC] text-xs">Principal Attorney</div>
        </div>
      </div>
    </div>
  );
}
