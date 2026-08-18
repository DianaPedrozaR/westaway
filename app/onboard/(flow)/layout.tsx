import Image from "next/image";
import Link from "next/link";
import { Stepper } from "@/components/Stepper";

export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-wa-tint">
      <div className="sticky top-0 z-20 flex justify-between items-center px-14 py-5 bg-white/90 backdrop-blur-md border-b border-wa-hair">
        <Image
          src="/westaway-logo.png"
          alt="Westaway"
          width={150}
          height={36}
          className="h-8 w-auto"
        />
        <div className="text-wa-navy text-base font-medium">Employment Agreement Onboarding</div>
        <Link href="/onboard" className="text-wa-blue text-base font-medium">
          Save &amp; exit
        </Link>
      </div>
      <Stepper />
      <div className="flex justify-center px-14 pb-16">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-wa-hair p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
