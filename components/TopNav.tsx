"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/onboard", label: "Home" },
  { href: "/onboard/pending", label: "Pending" },
  { href: "/onboard/legal-matters", label: "Legal Matters" },
];

export function TopNav({
  clientName = "Nimbus Robotics, Inc.",
  clientContact = "Jordan A. Rivera",
}: {
  clientName?: string;
  clientContact?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-14 py-5 bg-white/90 backdrop-blur-md border-b border-wa-hair">
      <Image
        src="/westaway-logo.png"
        alt="Westaway"
        width={170}
        height={40}
        className="h-8 w-auto"
      />
      <nav className="flex gap-2 bg-wa-tint rounded-full p-1">
        {NAV_ITEMS.map(({ href, label }) => {
          const active =
            href === "/onboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium px-5 py-2 rounded-full ${
                active ? "bg-white text-wa-navy shadow-sm" : "text-wa-meta hover:text-wa-navy"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-wa-navy text-sm font-medium">{clientName}</div>
          <div className="text-wa-meta text-xs">{clientContact}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-wa-blue-light text-wa-blue font-semibold flex items-center justify-center flex-shrink-0">
          {clientName
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
      </div>
    </div>
  );
}
