import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { loadCV, getOctokit } from "@/lib/github";
import { CVPreview } from "@/components/preview/CVPreview";

export default async function PrintPage({ searchParams }: { searchParams: Promise<{ cv?: string }> }) {
  const session = await auth();
  if (!session?.githubLogin) redirect("/");

  const { cv: cvName } = await searchParams;
  if (!cvName) redirect("/editor");

  const octokit = getOctokit(session.accessToken!);
  const cv = await loadCV(octokit, session.githubLogin, cvName);
  if (!cv) redirect("/editor");

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { margin: 0; }
          .no-print { display: none !important; }
        }
        body { margin: 0; background: #fff; }
      `}</style>

      {/* Print trigger */}
      <script dangerouslySetInnerHTML={{ __html: `window.onload = () => window.print();` }} />

      {/* Close button — hidden on print */}
      <div className="no-print" style={{
        position: "fixed", top: 12, right: 12, zIndex: 100,
        display: "flex", gap: 8,
      }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: "6px 14px", fontSize: 13, fontWeight: 600,
            background: "#F59E0B", color: "#0A0A0B",
            border: "none", borderRadius: 6, cursor: "pointer",
          }}
        >
          Print / Save PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            padding: "6px 14px", fontSize: 13,
            background: "#fff", color: "#555",
            border: "1px solid #ddd", borderRadius: 6, cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      <CVPreview cv={cv} />
    </>
  );
}
