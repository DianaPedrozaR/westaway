import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-wa-blue text-white hover:bg-wa-navy shadow-sm hover:shadow-md",
  secondary:
    "bg-white text-wa-navy border-[1.5px] border-wa-hair hover:border-wa-navy",
  ghost: "bg-transparent text-wa-blue hover:bg-wa-blue-light",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm gap-1.5",
  md: "px-5 py-3 text-[15px] gap-2",
  lg: "px-8 py-4 text-base gap-2",
};

const BASE = "inline-flex items-center justify-center font-medium rounded-xl disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
