"use client";

import { useState, useCallback, useEffect } from "react";
import { CV } from "@/types/cv";
import { CVPreview } from "@/components/preview/CVPreview";
import { PersonalSection } from "@/components/editor/PersonalSection";
import { ExperienceSection } from "@/components/editor/ExperienceSection";
import { ProjectsSection } from "@/components/editor/ProjectsSection";
import { EducationSection } from "@/components/editor/EducationSection";
import { SkillsSection } from "@/components/editor/SkillsSection";
import { LanguagesSection } from "@/components/editor/LanguagesSection";

interface Props {
  initialCV: CV;
  cvName: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface VersionEntry {
  sha: string;
  message: string;
  date: string;
  author: string;
}

const DRAFT_KEY = (name: string) => `cv-draft:${name}`;

type TabId = "personal" | "experience" | "projects" | "education" | "skills" | "languages";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "personal", label: "Personal",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    id: "experience", label: "Experience",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
  {
    id: "projects", label: "Projects",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    id: "education", label: "Education",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    id: "skills", label: "Skills",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    id: "languages", label: "Languages",
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
];

export function CVEditor({ initialCV, cvName }: Props) {
  const [cv, setCV] = useState<CV>(() => {
    if (typeof window === "undefined") return initialCV;
    try {
      const raw = localStorage.getItem(DRAFT_KEY(cvName));
      if (!raw) return initialCV;
      const draft = JSON.parse(raw) as CV;
      const draftTime = new Date(draft.meta.updatedAt).getTime();
      const serverTime = new Date(initialCV.meta.updatedAt).getTime();
      return draftTime > serverTime ? draft : initialCV;
    } catch {
      return initialCV;
    }
  });
  const [hasDraft, setHasDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [commitMessage, setCommitMessage] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<VersionEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY(cvName), JSON.stringify(cv));
      const serverTime = new Date(initialCV.meta.updatedAt).getTime();
      const draftTime = new Date(cv.meta.updatedAt).getTime();
      setHasDraft(draftTime > serverTime);
    } catch {}
  }, [cv, cvName, initialCV.meta.updatedAt]);

  const update = useCallback(<K extends keyof CV>(key: K, value: CV[K]) => {
    setCV((prev) => ({
      ...prev,
      [key]: value,
      meta: { ...prev.meta, updatedAt: new Date().toISOString() },
    }));
    setSaveStatus("idle");
  }, []);

  const save = async (message?: string) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, message }),
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem(DRAFT_KEY(cvName));
      setHasDraft(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  const openSaveDialog = () => {
    setCommitMessage(`Update ${cvName}`);
    setShowSaveDialog(true);
  };

  const handleSave = async () => {
    setShowSaveDialog(false);
    await save(commitMessage);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/cv/history?name=${cvName}`);
      const data = await res.json();
      setHistory(data.history || []);
    } finally {
      setLoadingHistory(false);
    }
  };

  const restoreVersion = async (sha: string) => {
    const res = await fetch(`/api/cv/history?name=${cvName}&sha=${sha}`);
    if (res.ok) {
      const restored = await res.json();
      localStorage.removeItem(DRAFT_KEY(cvName));
      setCV(restored);
      setHasDraft(false);
      setShowHistory(false);
      setSaveStatus("idle");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        openSaveDialog();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--v-bg-0)", overflow: "hidden" }}>
      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px", height: 40, borderBottom: "1px solid var(--v-border)",
        background: "var(--v-bg-1)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* CV name badge */}
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "2px 8px", borderRadius: 4,
            background: "var(--v-accent-muted)", border: "1px solid rgba(245,158,11,0.3)",
            color: "var(--v-accent)", fontSize: 11, fontWeight: 600,
            fontFamily: "var(--font-mono)", letterSpacing: "0.02em",
          }}>{cvName}</span>

          {/* Draft badge */}
          {hasDraft && (
            <>
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "2px 8px", borderRadius: 4,
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                color: "var(--v-accent)", fontSize: 11, fontWeight: 500,
              }}>Draft</span>
              <TopBarGhostBtn onClick={() => {
                localStorage.removeItem(DRAFT_KEY(cvName));
                setCV(initialCV);
                setHasDraft(false);
                setSaveStatus("idle");
              }}>Discard</TopBarGhostBtn>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {saveStatus === "saved" && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#10B981" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Saved to GitHub
            </span>
          )}
          {saveStatus === "error" && (
            <span style={{ fontSize: 11, color: "#EF4444" }}>Save failed</span>
          )}

          <TopBarGhostBtn onClick={() => { setShowHistory(true); loadHistory(); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            History
          </TopBarGhostBtn>

          <TopBarGhostBtn onClick={() => setShowPreview(v => !v)}>
            {showPreview ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </TopBarGhostBtn>

          {/* Save button */}
          <button
            onClick={openSaveDialog}
            disabled={saveStatus === "saving"}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 12px", fontSize: 12, fontWeight: 600,
              background: saveStatus === "saving" ? "rgba(245,158,11,0.4)" : "var(--v-accent)",
              color: "#0A0A0B", border: "none", borderRadius: 5,
              cursor: saveStatus === "saving" ? "default" : "pointer",
              fontFamily: "var(--font-sans)", transition: "background 0.15s ease",
            }}
            onMouseEnter={e => { if (saveStatus !== "saving") (e.currentTarget as HTMLElement).style.background = "var(--v-accent-hover)"; }}
            onMouseLeave={e => { if (saveStatus !== "saving") (e.currentTarget as HTMLElement).style.background = "var(--v-accent)"; }}
          >
            {saveStatus === "saving" ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
            )}
            Save
            <span style={{ fontSize: 10, opacity: 0.7 }}>⌘S</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Editor Panel */}
        <div style={{
          width: showPreview ? 420 : undefined,
          flex: showPreview ? undefined : 1,
          flexShrink: 0,
          display: "flex", flexDirection: "column",
          background: "var(--v-bg-1)", borderRight: "1px solid var(--v-border)",
          overflow: "hidden",
        }}>
          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "stretch",
            borderBottom: "1px solid var(--v-border)",
            flexShrink: 0, overflowX: "auto",
            background: "var(--v-bg-1)",
          }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 12px", fontSize: 12, fontWeight: isActive ? 500 : 400,
                    color: isActive ? "var(--v-text-1)" : "var(--v-text-3)",
                    background: "transparent", border: "none",
                    borderBottom: isActive ? "2px solid var(--v-accent)" : "2px solid transparent",
                    cursor: "pointer", fontFamily: "var(--font-sans)",
                    transition: "color 0.12s ease", whiteSpace: "nowrap", flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {activeTab === "personal" && (
              <>
                <SectionLabel>Personal Info</SectionLabel>
                <PersonalSection data={cv.personal} onChange={v => update("personal", v)} />
                <SectionLabel style={{ marginTop: 20 }}>Summary</SectionLabel>
                <textarea
                  rows={5}
                  value={cv.summary}
                  onChange={e => update("summary", e.target.value)}
                  placeholder="Professional summary..."
                  style={{
                    width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
                    border: "1px solid var(--v-border)", borderRadius: 6,
                    padding: "8px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
                    resize: "none", outline: "none", boxSizing: "border-box",
                    lineHeight: 1.5, transition: "border-color 0.15s ease",
                  }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
                />
              </>
            )}
            {activeTab === "experience" && (
              <>
                <SectionLabel>Experience</SectionLabel>
                <ExperienceSection data={cv.experience} onChange={v => update("experience", v)} />
              </>
            )}
            {activeTab === "projects" && (
              <>
                <SectionLabel>Projects</SectionLabel>
                <ProjectsSection data={cv.projects} onChange={v => update("projects", v)} />
              </>
            )}
            {activeTab === "education" && (
              <>
                <SectionLabel>Education</SectionLabel>
                <EducationSection data={cv.education} onChange={v => update("education", v)} />
              </>
            )}
            {activeTab === "skills" && (
              <>
                <SectionLabel>Core Skills</SectionLabel>
                <SkillsSection data={cv.skills} onChange={v => update("skills", v)} />
              </>
            )}
            {activeTab === "languages" && (
              <>
                <SectionLabel>Languages</SectionLabel>
                <LanguagesSection data={cv.languages} onChange={v => update("languages", v)} />
              </>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div style={{
            flex: 1, overflowY: "auto", background: "var(--v-bg-0)",
            padding: "24px", display: "flex", justifyContent: "center",
          }}>
            <div style={{
              boxShadow: "0 4px 40px rgba(0,0,0,0.5)",
              borderRadius: 4, overflow: "hidden",
              height: "fit-content",
            }}>
              <CVPreview cv={cv} />
            </div>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <ModalOverlay onClose={() => setShowSaveDialog(false)}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Save to GitHub</h3>
            <p style={{ fontSize: 12, color: "var(--v-text-3)", margin: 0 }}>
              This will commit your CV to your <code style={{ fontFamily: "var(--font-mono)", color: "var(--v-text-2)", fontSize: 11 }}>cv-store</code> repository.
            </p>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--v-text-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Commit message</label>
            <input
              value={commitMessage}
              onChange={e => setCommitMessage(e.target.value)}
              placeholder="Describe what changed..."
              onKeyDown={e => e.key === "Enter" && handleSave()}
              autoFocus
              style={{
                width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
                border: "1px solid var(--v-border)", borderRadius: 6, padding: "8px 12px",
                fontSize: 13, fontFamily: "var(--font-sans)", outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <GhostBtn onClick={() => setShowSaveDialog(false)}>Cancel</GhostBtn>
            <AmberBtn onClick={handleSave}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                <path d="M6 9v6M18 9V7a2 2 0 0 0-2-2H8"/>
              </svg>
              Commit &amp; Save
            </AmberBtn>
          </div>
        </ModalOverlay>
      )}

      {/* History Dialog */}
      {showHistory && (
        <ModalOverlay onClose={() => setShowHistory(false)}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Version History</h3>
            <p style={{ fontSize: 12, color: "var(--v-text-3)", margin: 0 }}>
              All commits for <code style={{ fontFamily: "var(--font-mono)", color: "var(--v-text-2)", fontSize: 11 }}>{cvName}.json</code> in your GitHub repo.
            </p>
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {loadingHistory && (
              <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--v-text-3)" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.7s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </div>
            )}
            {!loadingHistory && history.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--v-text-3)", textAlign: "center", padding: "20px 0" }}>
                No history yet. Save your CV to create the first version.
              </p>
            )}
            {history.map((v) => (
              <HistoryEntry key={v.sha} entry={v} onRestore={() => restoreVersion(v.sha)} />
            ))}
          </div>
        </ModalOverlay>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: "var(--v-text-3)",
      textTransform: "uppercase", letterSpacing: "0.07em",
      marginBottom: 10, ...style,
    }}>{children}</div>
  );
}

function HistoryEntry({ entry, onRestore }: { entry: { sha: string; message: string; date: string }; onRestore: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 12px", borderRadius: 8, marginBottom: 4,
        background: hov ? "var(--v-bg-3)" : "var(--v-bg-2)",
        border: "1px solid var(--v-border)", transition: "background 0.12s ease",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--v-text-1)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.message}</p>
        <p style={{ fontSize: 11, color: "var(--v-text-3)", margin: 0, fontFamily: "var(--font-mono)" }}>
          {new Date(entry.date).toLocaleString()} · <span style={{ color: "var(--v-accent)" }}>{entry.sha.slice(0, 7)}</span>
        </p>
      </div>
      {hov && (
        <button
          onClick={onRestore}
          style={{
            padding: "4px 10px", fontSize: 11, fontWeight: 500,
            background: "var(--v-bg-1)", color: "var(--v-text-2)",
            border: "1px solid var(--v-border)", borderRadius: 5,
            cursor: "pointer", fontFamily: "var(--font-sans)",
            flexShrink: 0, marginLeft: 8, transition: "all 0.12s ease",
          }}
        >Restore</button>
      )}
    </div>
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
        borderRadius: 12, padding: "24px 28px", width: 420,
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

function AmberBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "7px 16px", fontSize: 13, fontWeight: 600,
        background: "var(--v-accent)", color: "#0A0A0B",
        border: "none", borderRadius: 6, cursor: "pointer",
        fontFamily: "var(--font-sans)", transition: "background 0.15s ease",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--v-accent-hover)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--v-accent)"}
    >{children}</button>
  );
}

function TopBarGhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 8px", fontSize: 12, fontWeight: 400,
        background: "transparent", color: "var(--v-text-2)",
        border: "1px solid transparent", borderRadius: 5,
        cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = "var(--v-bg-3)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.borderColor = "transparent";
      }}
    >{children}</button>
  );
}
