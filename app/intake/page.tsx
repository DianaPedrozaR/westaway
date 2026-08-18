import Image from "next/image";
import Link from "next/link";
import { IntakeChat } from "@/components/IntakeChat";

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-wa-tint flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Image src="/westaway-logo.png" alt="Westaway" width={200} height={75} className="h-9 w-auto" />
          <Link href="/" className="text-wa-blue text-sm font-medium">
            &larr; Back
          </Link>
        </div>

        <div>
          <h1 className="text-3xl">Let&rsquo;s get your call ready.</h1>
          <p className="text-wa-meta mt-2">
            A quick chat before you book — a few questions, then you&rsquo;re set. This is the
            same concierge that will sit behind the &ldquo;Book Free Consult&rdquo; button on
            westaway.com.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-wa-hair shadow-sm p-8">
          <IntakeChat />
        </div>
      </div>
    </div>
  );
}
