import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/editor");

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--v-bg-0)", position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: 900, height: 700,
        background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.3,
        backgroundImage: "radial-gradient(circle, #27272A 1px, transparent 1px)",
        backgroundSize: "24px 24px", pointerEvents: "none",
      }} />

      {/* Nav */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6, background: "var(--v-accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#0A0A0B", fontWeight: 800, fontSize: 14,
            fontFamily: "var(--font-mono)",
          }}>V</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--v-text-1)", letterSpacing: "-0.03em" }}>versume</span>
        </div>
        <LoginButton variant="ghost" />
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", zIndex: 1, maxWidth: 600, padding: "0 24px", animation: "fadeIn 0.6s ease both" }}>
        <h1 style={{
          fontSize: 56, fontWeight: 700, letterSpacing: "-0.045em",
          lineHeight: 1.08, color: "var(--v-text-1)", margin: "0 0 20px",
        }}>
          Version your resume<br />like code<span style={{ color: "var(--v-accent)" }}>.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--v-text-2)", margin: "0 0 32px" }}>
          Structured CV editor backed by GitHub.<br />
          Every save is a commit. Full history. Multiple variants.
        </p>

        {/* Pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {[
            { label: "GitHub backed" },
            { label: "Version history" },
            { label: "Multiple CVs" },
          ].map(({ label }) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 100,
              background: "var(--v-bg-2)", border: "1px solid var(--v-border)",
              color: "var(--v-text-2)", fontSize: 13, fontWeight: 500,
            }}>{label}</span>
          ))}
        </div>

        <LoginButton variant="primary" />

        <p style={{ fontSize: 12, color: "var(--v-text-3)", marginTop: 16 }}>
          Creates a private{" "}
          <code style={{
            fontFamily: "var(--font-mono)", color: "var(--v-text-2)",
            background: "var(--v-bg-2)", padding: "1px 5px", borderRadius: 3, fontSize: 11,
          }}>cv-store</code>{" "}
          repo in your GitHub account
        </p>
      </div>

      {/* Git log widget */}
      <div style={{
        zIndex: 1, marginTop: 48, animation: "fadeIn 0.8s ease 0.2s both",
        background: "var(--v-bg-1)", border: "1px solid var(--v-border)", borderRadius: 10,
        padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 12,
        color: "var(--v-text-3)", lineHeight: 1.8, maxWidth: 380,
      }}>
        <div style={{
          fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em",
          color: "var(--v-text-3)", marginBottom: 6,
          fontFamily: "var(--font-sans)", fontWeight: 500,
        }}>git log — cv-store/default.json</div>
        {[
          { sha: "a3f2c1d", msg: "Update skills section" },
          { sha: "b7e4f8a", msg: "Add new project description" },
          { sha: "c9d1e3b", msg: "Initial commit" },
        ].map(({ sha, msg }) => (
          <div key={sha}>
            <span style={{ color: "var(--v-accent)" }}>{sha}</span>{" "}{msg}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 20, fontSize: 12, color: "var(--v-text-3)", zIndex: 1 }}>
        Built for developers who version everything.
      </div>
    </div>
  );
}
