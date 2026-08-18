"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { CalendarIcon, CheckIcon } from "@/components/icons";

const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const REP_NAMES: Record<string, string> = {
  kyle: "Kyle Westaway",
  stephanie: "Stephanie",
};

function nextBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (days.length < count) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function FakeCalendly({ rep, email }: { rep: string | null; email?: string }) {
  const [days] = useState(() => nextBusinessDays(4));
  const [selected, setSelected] = useState<{ day: Date; time: string } | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const repName = REP_NAMES[rep ?? ""] ?? "our team";

  if (confirmed && selected) {
    return (
      <div className="rounded-2xl bg-wa-green-light border border-wa-green/20 px-6 py-8 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-wa-green text-white flex items-center justify-center">
          <CheckIcon size={22} />
        </div>
        <div className="text-lg text-wa-navy font-medium">You&rsquo;re booked with {repName}</div>
        <div className="text-wa-navy">
          {selected.day.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at {selected.time} CST
        </div>
        <p className="text-wa-meta text-sm mt-1">
          A confirmation email and calendar invite has been sent to{" "}
          {email ? <span className="text-wa-navy font-medium">{email}</span> : "your email"}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-wa-navy font-medium">
        <CalendarIcon size={18} className="text-wa-blue" />
        Pick a time with {repName}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {days.map((day) => (
          <div key={day.toISOString()} className="flex flex-col gap-1.5">
            <div className="text-center text-xs font-semibold uppercase tracking-wide text-wa-meta">
              {day.toLocaleDateString("en-US", { weekday: "short" })}
              <div className="text-wa-navy text-sm normal-case font-normal">
                {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
            {TIMES.map((time) => {
              const isSelected =
                selected?.day.toDateString() === day.toDateString() && selected.time === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelected({ day, time })}
                  className={`text-xs rounded-lg px-2 py-2 border-[1.5px] transition-colors ${
                    isSelected
                      ? "bg-wa-blue text-white border-wa-blue"
                      : "bg-white text-wa-navy border-wa-hair hover:border-wa-blue"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-xs text-wa-dis">All times shown in CST.</p>
      <Button onClick={() => setConfirmed(true)} disabled={!selected} size="lg" className="w-full">
        Confirm booking
      </Button>
    </div>
  );
}
