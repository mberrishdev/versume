"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  cvList: string[];
  activeCv: string;
  username: string;
}

export function CVSidebar({ cvList, activeCv, username }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [hoveredCv, setHoveredCv] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  const createCV = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const { createEmptyCV } = await import("@/lib/default-cv");
    const cv = createEmptyCV(newName.trim());
    await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cv, message: `Create ${newName}` }),
    });
    setShowNew(false);
    setNewName("");
    setCreating(false);
    router.push(`/editor?cv=${encodeURIComponent(newName.trim())}`);
    router.refresh();
  };

  const iconBtn: React.CSSProperties = {
    width: 28, height: 28, borderRadius: 6, background: "transparent",
    border: "none", color: "var(--v-text-3)", display: "flex",
    alignItems: "center", justifyContent: "center", cursor: "pointer",
    padding: 0, transition: "all 0.15s ease", flexShrink: 0,
  };

  return (
    <>
      <aside style={{
        width: collapsed ? 44 : 200, flexShrink: 0, display: "flex", flexDirection: "column",
        background: "var(--v-bg-1)", borderRight: "1px solid var(--v-border)",
        height: "100vh", transition: "width 0.2s ease", overflow: "hidden",
      }}>
        {/* Logo + collapse toggle */}
        <div style={{ padding: collapsed ? "10px 8px" : "10px 10px 10px 14px", borderBottom: "1px solid var(--v-border)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--v-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0A0A0B", fontWeight: 800, fontSize: 13, fontFamily: "var(--font-mono)", flexShrink: 0 }}>V</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--v-text-1)", letterSpacing: "-0.03em" }}>versume</span>
            </div>
          )}
          {collapsed && (
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--v-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0A0A0B", fontWeight: 800, fontSize: 13, fontFamily: "var(--font-mono)" }}>V</div>
          )}
          {!collapsed && (
            <button onClick={toggleCollapse} style={iconBtn} title="Collapse sidebar"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--v-bg-3)"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div style={{ padding: "6px 8px", borderBottom: "1px solid var(--v-border)", display: "flex", justifyContent: "center" }}>
            <button onClick={toggleCollapse} style={iconBtn} title="Expand sidebar"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--v-bg-3)"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Repo row (hidden when collapsed) */}
        {!collapsed && (
          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--v-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--v-text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                <path d="M6 9v6M18 9V7a2 2 0 0 0-2-2H8"/>
              </svg>
              <span style={{ fontSize: 11, color: "var(--v-text-3)", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {username}/cv-store
              </span>
              <a href={`https://github.com/${username}/cv-store`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", flexShrink: 0, color: "var(--v-text-3)", lineHeight: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* CVs header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: collapsed ? "8px 8px 4px" : "10px 12px 6px" }}>
          {!collapsed && <span style={{ fontSize: 10, fontWeight: 600, color: "var(--v-text-3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>CVs</span>}
          <button
            onClick={() => setShowNew(true)}
            style={{ ...iconBtn, width: 20, height: 20, borderRadius: 4, border: "1px solid var(--v-border)" }}
            title="New CV"
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--v-bg-3)"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        {/* CV list */}
        <nav style={{ flex: 1, padding: collapsed ? "2px 8px" : "2px 6px", overflowY: "auto" }}>
          {cvList.map((name) => {
            const isActive = name === activeCv;
            const isHovered = hoveredCv === name;
            return (
              <div
                key={name}
                style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 1 }}
                onMouseEnter={() => setHoveredCv(name)}
                onMouseLeave={() => setHoveredCv(null)}
              >
                <Link href={`/editor?cv=${encodeURIComponent(name)}`} style={{ flex: 1, minWidth: 0, textDecoration: "none" }} title={collapsed ? name : undefined}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: collapsed ? "6px 0" : "6px 8px", borderRadius: 6, cursor: "pointer",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive ? "var(--v-bg-3)" : isHovered ? "var(--v-bg-2)" : "transparent",
                    transition: "background 0.12s ease",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isActive ? "var(--v-accent)" : "var(--v-text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {!collapsed && <span style={{ fontSize: 12, fontWeight: isActive ? 500 : 400, color: isActive ? "var(--v-text-1)" : "var(--v-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>}
                  </div>
                </Link>
                {isHovered && !collapsed && (
                  <button
                    onClick={(e) => { e.preventDefault(); setConfirmDelete(name); }}
                    style={{ width: 22, height: 22, borderRadius: 4, background: "transparent", border: "none", color: "var(--v-text-3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, flexShrink: 0, transition: "color 0.12s ease" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#EF4444"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: collapsed ? "8px" : "8px 6px", borderTop: "1px solid var(--v-border)", display: "flex", justifyContent: collapsed ? "center" : "stretch" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sign out"
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 7, justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "6px" : "7px 8px", borderRadius: 6, background: "transparent",
              border: "none", color: "var(--v-text-3)", fontSize: 12, cursor: "pointer",
              fontFamily: "var(--font-sans)", transition: "all 0.12s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--v-bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {/* New CV Modal */}
      {showNew && (
        <ModalOverlay onClose={() => { setShowNew(false); setNewName(""); }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>New CV</h3>
            <p style={{ fontSize: 12, color: "var(--v-text-3)", margin: 0 }}>Creates a new empty CV file in your cv-store repo.</p>
          </div>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. backend, fullstack, startup"
            onKeyDown={e => e.key === "Enter" && createCV()}
            autoFocus
            style={{
              width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
              border: "1px solid var(--v-border)", borderRadius: 6, padding: "8px 12px",
              fontSize: 13, fontFamily: "var(--font-sans)", outline: "none",
              boxSizing: "border-box", marginBottom: 14,
            }}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <GhostBtn onClick={() => { setShowNew(false); setNewName(""); }}>Cancel</GhostBtn>
            <AmberBtn onClick={createCV} disabled={creating || !newName.trim()}>
              {creating ? "Creating…" : "Create"}
            </AmberBtn>
          </div>
        </ModalOverlay>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <ModalOverlay onClose={() => setConfirmDelete(null)}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Delete CV</h3>
            <p style={{ fontSize: 13, color: "var(--v-text-2)", margin: 0, lineHeight: 1.5 }}>
              This will permanently delete <strong style={{ color: "var(--v-text-1)" }}>{confirmDelete}</strong> from your GitHub repo. This cannot be undone.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <GhostBtn onClick={() => setConfirmDelete(null)}>Cancel</GhostBtn>
            <button
              disabled={deleting}
              onClick={async () => {
                if (!confirmDelete) return;
                setDeleting(true);
                await fetch(`/api/cv?name=${encodeURIComponent(confirmDelete)}`, { method: "DELETE" });
                localStorage.removeItem(`cv-draft:${confirmDelete}`);
                const wasActive = confirmDelete === activeCv;
                setConfirmDelete(null);
                setDeleting(false);
                if (wasActive) router.push("/editor");
                router.refresh();
              }}
              style={{
                padding: "7px 16px", fontSize: 13, fontWeight: 500,
                background: deleting ? "rgba(239,68,68,0.4)" : "#EF4444",
                color: "#fff", border: "none", borderRadius: 6,
                cursor: deleting ? "default" : "pointer",
                fontFamily: "var(--font-sans)", transition: "background 0.15s ease",
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </ModalOverlay>
      )}
    </>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "var(--v-bg-1)", border: "1px solid var(--v-border)",
        borderRadius: 12, padding: "24px 28px", width: 380,
        animation: "modalIn 0.2s ease both",
      }}>
        {children}
      </div>
    </div>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px", fontSize: 13, fontWeight: 500,
        background: "transparent", color: "var(--v-text-2)",
        border: "1px solid var(--v-border)", borderRadius: 6,
        cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s ease",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--v-bg-3)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
    >{children}</button>
  );
}

function AmberBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "7px 16px", fontSize: 13, fontWeight: 600,
        background: disabled ? "rgba(245,158,11,0.4)" : "var(--v-accent)",
        color: "#0A0A0B", border: "none", borderRadius: 6,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "var(--font-sans)", transition: "background 0.15s ease",
      }}
    >{children}</button>
  );
}
