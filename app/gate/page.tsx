import Image from "next/image";
import { verifyPasscode } from "./actions";
import { Button } from "@/components/Button";

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/";
  const hasError = params.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-wa-navy to-[#0d1640] p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-12">
        <div className="mb-8 flex justify-center">
          <Image
            src="/westaway-logo.png"
            alt="Westaway"
            width={220}
            height={54}
            className="h-10 w-auto"
          />
        </div>
        <h1 className="text-2xl text-center mb-2">Restricted access</h1>
        <p className="text-center text-wa-meta mb-8">
          Enter the passcode to continue to Westaway.
        </p>
        <form action={verifyPasscode} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <input
            type="password"
            name="passcode"
            placeholder="Passcode"
            autoFocus
            className="rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg outline-none focus:border-wa-blue"
          />
          {hasError && (
            <p className="text-sm text-wa-red">
              That passcode isn&rsquo;t right &mdash; try again.
            </p>
          )}
          <Button type="submit" size="lg" className="w-full">
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}
