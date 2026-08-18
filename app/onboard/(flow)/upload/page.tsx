export const dynamic = "force-dynamic";

import { getActiveCase, parseJsonArray } from "@/lib/onboarding";
import { CheckIcon, UploadIcon } from "@/components/icons";
import { markUploaded } from "./actions";
import { Button, LinkButton } from "@/components/Button";

type UploadDoc = { name: string; uploaded: boolean; optional?: boolean };

export default async function UploadPage() {
  const activeCase = await getActiveCase();
  const docs = activeCase ? parseJsonArray<UploadDoc>(activeCase.uploadedDocs) : [];

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-3xl">Upload your existing documents.</h1>
        <p className="text-wa-meta mt-2">
          We&rsquo;ll use these to pre-fill as much of your Employment Agreement as possible
          &mdash; no need to re-type what we already have.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {docs.map((doc) => (
          <div
            key={doc.name}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${
              doc.uploaded ? "border-wa-hair bg-white shadow-sm" : "border-dashed border-wa-hair bg-white/60"
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                doc.uploaded ? "bg-wa-green text-white" : "bg-wa-tint text-wa-dis"
              }`}
            >
              {doc.uploaded ? <CheckIcon size={18} /> : <UploadIcon size={18} />}
            </div>
            <div className="flex-grow">
              <div className="text-lg text-wa-navy font-medium">
                {doc.name}
                {doc.optional && (
                  <span className="text-wa-meta text-sm font-normal"> (optional)</span>
                )}
              </div>
              <div className="text-sm text-wa-meta">
                {doc.uploaded ? "Uploaded" : "Not yet uploaded"}
              </div>
            </div>
            {!doc.uploaded && (
              <form
                action={async () => {
                  "use server";
                  await markUploaded(doc.name);
                }}
              >
                <Button type="submit" variant="secondary" size="sm">
                  Upload
                </Button>
              </form>
            )}
          </div>
        ))}
      </div>

      <LinkButton href="/onboard/chat" size="lg" className="self-end">
        Continue to Chatbot &rarr;
      </LinkButton>
    </div>
  );
}
