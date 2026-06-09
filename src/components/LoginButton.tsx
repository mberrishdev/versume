"use client";
import { signIn } from "next-auth/react";

interface Props {
  variant?: "primary" | "ghost";
}

export function LoginButton({ variant = "primary" }: Props) {
  if (variant === "ghost") {
    return (
      <button
        onClick={() => signIn("github", { callbackUrl: "/editor" })}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", background: "transparent",
          border: "1px solid var(--v-border)", borderRadius: 6,
          color: "var(--v-text-2)", fontSize: 13, fontWeight: 500,
          cursor: "pointer", fontFamily: "var(--font-sans)",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--v-bg-2)";
          (e.currentTarget as HTMLElement).style.color = "var(--v-text-1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)";
        }}
      >
        Sign in
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/editor" })}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "13px 32px", fontSize: 15, fontWeight: 600,
        background: "var(--v-accent)", color: "#0A0A0B",
        border: "none", borderRadius: 8, cursor: "pointer",
        fontFamily: "var(--font-sans)", letterSpacing: "-0.01em",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.background = "var(--v-accent-hover)";
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 4px 24px rgba(245,158,11,0.3)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.background = "var(--v-accent)";
        el.style.transform = "none";
        el.style.boxShadow = "none";
      }}
    >
      Continue with GitHub
    </button>
  );
}
