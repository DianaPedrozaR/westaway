"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export type ProspectInfo = { name: string; email: string; title: string; company: string };

export function IntakeContactForm({ onSubmit }: { onSubmit: (prospect: ProspectInfo) => void }) {
  const [values, setValues] = useState<ProspectInfo>({
    name: "",
    email: "",
    title: "",
    company: "",
  });

  const canSubmit = values.name.trim() && values.email.trim();

  function set(key: keyof ProspectInfo) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit(values);
      }}
      className="flex flex-col gap-4"
    >
      <p className="text-wa-meta text-sm -mt-1">
        Quick intro before we chat — this helps our team know who they&rsquo;re meeting.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input
          value={values.name}
          onChange={set("name")}
          placeholder="Full name"
          required
          autoFocus
          className="col-span-2 rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-base text-wa-navy outline-none focus:border-wa-blue"
        />
        <input
          value={values.email}
          onChange={set("email")}
          type="email"
          placeholder="Email"
          required
          className="col-span-2 rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-base text-wa-navy outline-none focus:border-wa-blue"
        />
        <input
          value={values.title}
          onChange={set("title")}
          placeholder="Title"
          className="rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-base text-wa-navy outline-none focus:border-wa-blue"
        />
        <input
          value={values.company}
          onChange={set("company")}
          placeholder="Company"
          className="rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-base text-wa-navy outline-none focus:border-wa-blue"
        />
      </div>
      <Button type="submit" size="lg" disabled={!canSubmit} className="w-full mt-2">
        Continue
      </Button>
    </form>
  );
}
