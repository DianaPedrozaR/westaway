"use client";

import { usePathname } from "next/navigation";
import { CheckIcon } from "./icons";

const STEPS = [
  { path: "/onboard/upload", label: "Upload" },
  { path: "/onboard/chat", label: "Chatbot" },
  { path: "/onboard/prefill", label: "Pre-fill" },
  { path: "/onboard/review", label: "Review" },
  { path: "/onboard/sheets", label: "Sheets" },
];

export function Stepper() {
  const pathname = usePathname();
  const activeIndex = STEPS.findIndex((s) => s.path === pathname);

  return (
    <div className="flex justify-center py-9 bg-wa-tint">
      <div className="flex items-start">
        {STEPS.map((step, i) => (
          <div key={step.path} className="flex items-start">
            <div className="flex flex-col items-center gap-2 w-[130px]">
              {i < activeIndex ? (
                <div className="w-10 h-10 rounded-full bg-wa-blue text-white flex items-center justify-center shadow-sm shadow-wa-blue/30">
                  <CheckIcon size={16} />
                </div>
              ) : i === activeIndex ? (
                <div className="w-10 h-10 rounded-full bg-wa-blue text-white flex items-center justify-center text-sm font-medium ring-4 ring-wa-blue-light">
                  {i + 1}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white border-[1.5px] border-wa-hair text-wa-dis flex items-center justify-center text-sm">
                  {i + 1}
                </div>
              )}
              <span className={`text-sm ${i <= activeIndex ? "text-wa-navy font-medium" : "text-wa-meta"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-14 h-[2px] rounded-full mt-5 ${i < activeIndex ? "bg-wa-blue" : "bg-wa-hair"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
