export const dynamic = "force-dynamic";

import { getActiveCase } from "@/lib/onboarding";
import { DocIcon, SparkleIcon } from "@/components/icons";
import { LinkButton } from "@/components/Button";
import { Pill } from "@/components/Pill";

const DOCS = [
  "Employment Agreement",
  "Offer Letter",
  "CIIAA",
  "At-Will Acknowledgment",
  "Stock Option Grant",
  "Form I-9",
  "Form W-4 + State Withholding",
];

export default async function PrefillPage() {
  const activeCase = await getActiveCase();
  const ready = Boolean(activeCase?.collectedParameters);

  if (!ready) {
    return (
      <div className="flex flex-col gap-6 items-start">
        <h1 className="text-3xl">Not quite ready yet.</h1>
        <p className="text-wa-meta text-lg">
          Finish the conversation with our onboarding assistant first &mdash; we need those
          answers before we can pre-fill your documents.
        </p>
        <LinkButton href="/onboard/chat" size="lg">
          Back to Chatbot
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-3xl">Your documents are pre-filled.</h1>
        <p className="text-wa-meta mt-2">
          Built from your uploaded documents and chatbot answers. Review each one before
          it&rsquo;s final.
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-wa-blue-light to-white border border-wa-blue/15 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <SparkleIcon size={18} className="text-wa-blue" />
        </div>
        <span className="text-lg text-wa-navy">
          {DOCS.length} of {DOCS.length} documents pre-filled from your answers.
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {DOCS.map((doc) => (
          <div
            key={doc}
            className="rounded-2xl border border-wa-hair bg-white p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-wa-blue-light flex items-center justify-center">
              <DocIcon className="text-wa-blue" size={20} />
            </div>
            <div className="text-lg text-wa-navy">{doc}</div>
            <Pill tone="success" className="w-fit">
              Pre-filled
            </Pill>
          </div>
        ))}
      </div>

      <LinkButton href="/onboard/review" size="lg" className="self-end">
        Review &amp; Complete &rarr;
      </LinkButton>
    </div>
  );
}
