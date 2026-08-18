"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import {
  DashboardIcon,
  UploadIcon,
  SparkleIcon,
  DocIcon,
  CheckIcon,
  ColumnsIcon,
  FlagIcon,
  BriefcaseIcon,
} from "./icons";

const NAV_ITEMS = [
  { href: "/onboard", label: "Home", Icon: DashboardIcon, exact: true },
  { href: "/onboard/upload", label: "Upload", Icon: UploadIcon },
  { href: "/onboard/chat", label: "Chatbot", Icon: SparkleIcon },
  { href: "/onboard/prefill", label: "Pre-fill", Icon: DocIcon },
  { href: "/onboard/review", label: "Review", Icon: CheckIcon },
  { href: "/onboard/sheets", label: "Sheets", Icon: ColumnsIcon },
  { href: "/onboard/pending", label: "Pending", Icon: FlagIcon },
  { href: "/onboard/legal-matters", label: "Legal Matters", Icon: BriefcaseIcon },
];

export function OnboardSidebar({
  clientName = "Nimbus Robotics, Inc.",
  clientContact = "Jordan A. Rivera",
}: {
  clientName?: string;
  clientContact?: string;
}) {
  const pathname = usePathname();
  const initials = clientName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Same full-height-outer / sticky-inner pattern as the OS Sidebar, offset
  // below the AppSwitcher banner instead of the raw viewport top.
  return (
    <div className="w-72 min-w-72 bg-wa-navy">
      <div className="sticky top-10 h-[calc(100vh-2.5rem)] flex flex-col py-8 overflow-y-auto">
        <div className="px-8 pb-10">
          <Logo light className="text-xl" />
        </div>
        <nav className="flex flex-col gap-1 flex-grow px-4">
          {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
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
        <div className="px-4">
          <Link
            href="/onboard"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 text-sm font-medium py-2.5"
          >
            Save &amp; exit
          </Link>
        </div>
        <div className="flex items-center gap-3 px-8 pt-5 mt-5 border-t border-white/10">
          <div className="w-10 h-10 rounded-full bg-wa-blue text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-white text-[15px]">{clientName}</div>
            <div className="text-[#93A0CC] text-xs">{clientContact}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
