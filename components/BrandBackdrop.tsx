// Ambient brand layer for the "operating system" screens (OS + Onboarding):
// a huge, faint W chevron (the mark from the real logo) plus a slow-drifting
// gradient blob, Stripe-dashboard-style. Fixed behind content, no pointer
// events, so it never interferes with the actual UI.
export function BrandBackdrop() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute -right-32 -top-24 w-[55rem] h-[55rem] opacity-[0.04]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M20 20 L60 160 L100 60 L140 160 L180 20"
          stroke="currentColor"
          strokeWidth="14"
          className="text-wa-navy"
        />
      </svg>
      <div className="absolute top-1/3 -left-40 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-wa-blue/10 to-wa-navy/5 blur-3xl animate-drift" />
    </div>
  );
}
