export const dynamic = "force-dynamic";

import { getActiveCase, parseMessages } from "@/lib/onboarding";
import { ChatWindow } from "@/components/ChatWindow";

export default async function ChatPage() {
  const activeCase = await getActiveCase();
  const messages = activeCase ? parseMessages(activeCase.messages) : [];
  const parametersCollected = Boolean(activeCase?.collectedParameters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">A few quick questions.</h1>
        <p className="text-wa-meta mt-2">
          We&rsquo;ll ask only what your uploaded documents don&rsquo;t already tell us.
        </p>
      </div>
      <ChatWindow initialMessages={messages} parametersCollected={parametersCollected} />
    </div>
  );
}
